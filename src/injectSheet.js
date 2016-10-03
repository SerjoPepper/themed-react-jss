import React, { Component, PropTypes } from 'react'
import hoistNonReactStatics from 'hoist-non-react-statics'

export function create(provider) {
  const { contextFieldName } = provider

  return function injectSheet(styles, jssOptions = {}) {

    function getResultStyles(data) {
      if (typeof styles === 'function')
        return styles(data)
      return styles
    }

    function createSheet(themeData) {
      return provider.jss.createStyleSheet(getResultStyles(themeData), jssOptions)
    }

    return function decorate(WrappedComponent) {

      function attachSheetOnce(themeData) {
        if (sheets.has(themeData)) {
          const info = sheets.get(themeData)
          if (!info.refs) {
            info.refs = 1
            info.sheet.attach()
          } else {
            info.refs += 1
          }
        } else {
          const info = {}
          info.refs = 1
          info.sheet = createSheet(themeData)
          info.sheet.attach()
          sheets.set(themeData, info)
        }
      }

      function detachSheetOnce(themeData) {
        const info = sheets.get(themeData)
        info.refs -= 1
        if (!info.refs)
          info.sheet.detach()
      }

      const emptyThemeData = {}
      const sheets = new WeakMap()
      const displayName =
        WrappedComponent.displayName ||
        WrappedComponent.name ||
        'Component'

      if (!jssOptions.meta)
        jssOptions.meta = displayName

      class Jss extends Component {
        static wrapped = WrappedComponent
        static displayName = `Jss(${displayName})`
        static contextTypes = {
          [contextFieldName]: PropTypes.object
        }

        get sheet() {
          return sheets[this.getThemeData()].sheet
        }

        getThemeData(context = this.context) {
          const { themeData = emptyThemeData } = (context[contextFieldName] || {})
          return themeData
        }

        componentWillMount() {
          attachSheetOnce(this.getThemeData())
        }

        componentWillUnmount() {
          detachSheetOnce(this.getThemeData())
        }

        componentWillUpdate(nextProps, nextState, nextContext) {
          const themeData = this.getThemeData()
          const nextThemeData = this.getThemeData(nextContext)
          if (themeData === nextThemeData)
            return
          detachSheetOnce(themeData)
          attachSheetOnce(nextThemeData)
        }

        render() {
          return <WrappedComponent { ...this.props } sheet={ this.sheet } />
        }
      }

      return hoistNonReactStatics(Jss, WrappedComponent, { wrapped: true })
    }
  }
}

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import hoistNonReactStatics from 'hoist-non-react-statics'

export function create(provider) {
  const { contextFieldName } = provider

  return function injectSheet(styles, jssOptions = {}) {

    function getResultStyles(data) {
      if (typeof styles === 'function')
        return styles(data)
      return styles
    }

    function createSheet(theme, jss) {
      return jss.createStyleSheet(getResultStyles(theme), jssOptions)
    }

    return function decorate(WrappedComponent) {

      function attachSheetOnce(theme, jss) {
        if (sheets.has(theme)) {
          const info = sheets.get(theme)
          if (!info.refs) {
            info.refs = 1
            info.sheet.attach()
          } else {
            info.refs += 1
          }
        } else {
          const info = {}
          info.refs = 1
          info.sheet = createSheet(theme, jss)
          info.sheet.attach()
          sheets.set(theme, info)
        }
      }

      function detachSheetOnce(theme) {
        const info = sheets.get(theme)
        info.refs -= 1
        if (!info.refs)
          info.sheet.detach()
      }

      const sheets = new Map()
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
          return sheets.get(this.getThemeData()).sheet
        }

        getJss(context = this.context) {
          return context[contextFieldName].jss
        }

        getThemeData(context = this.context) {
          return context[contextFieldName].theme
        }

        componentWillMount() {
          attachSheetOnce(this.getThemeData(), this.getJss())
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
          attachSheetOnce(nextThemeData, this.getJss())
        }

        render() {
          return <WrappedComponent { ...this.props }
            sheet={ this.sheet }
            theme={ this.getThemeData() } />
        }
      }

      return hoistNonReactStatics(Jss, WrappedComponent, { wrapped: true })
    }
  }
}

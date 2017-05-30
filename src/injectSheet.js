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
          return sheets.get(this.themeData).sheet
        }

        get jss() {
          return this.context[contextFieldName].jss
        }

        onThemeUpdate = (nextThemeData) => {
          if (this.themeData === nextThemeData)
            return
          attachSheetOnce(nextThemeData, this.jss)
          detachSheetOnce(this.themeData)
          this.themeData = nextThemeData
          this.forceUpdate()
        };

        componentWillMount() {
          this.themeData = this.context[contextFieldName].theme
          attachSheetOnce(this.themeData, this.jss)
          this.context[contextFieldName].events.on('update', this.onThemeUpdate)
        }

        componentWillUnmount() {
          detachSheetOnce(this.themeData)
          this.context[contextFieldName].events.removeListener('update', this.onThemeUpdate)
        }

        render() {
          return <WrappedComponent { ...this.props }
            sheet={ this.sheet }
            theme={ this.themeData } />
        }
      }

      return hoistNonReactStatics(Jss, WrappedComponent, { wrapped: true })
    }
  }
}

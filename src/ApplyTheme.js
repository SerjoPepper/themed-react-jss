import { Component, PropTypes } from 'react'
import merge from 'lodash/merge'

export function create (provider) {
  const { contextFieldName } = provider

  return class ApplyTheme extends Component {

    static propTypes = {
      /**
       * Theme. Can be key or object with theme overrides
       */
      theme: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
      /**
       * Indicate watch on theme or not
       */
      watch: PropTypes.bool
    }

    static contextTypes = {
      [contextFieldName]: PropTypes.object
    }

    static childContextTypes = {
      [contextFieldName]: PropTypes.object
    }

    themeContext = {}

    getThemeData() {
      const parent = this.context[contextFieldName]
      const { theme } = this.props
      const isOverride = theme && typeof theme !== 'string'
      if (!parent) {
        if (isOverride)
          return theme
        return provider.getThemeData(theme)
      }
      if (isOverride)
        return merge({}, parent.themeData, theme)
      return merge({}, parent.themeData, provider.getThemeData(theme))
    }

    getChildContext() {
      this.themeContext.themeData = this.getThemeData()
      return {
        [contextFieldName]: this.themeContext
      }
    }

    componentWillUpdate({ watch, theme }) {
      if (!watch)
        return
      if (theme !== this.props.theme)
        this.themeContext.themeData = this.getThemeData()
    }
  }
}

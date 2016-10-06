import { Component, PropTypes } from 'react'
import merge from 'lodash/merge'

export function create(provider) {
  const { contextFieldName } = provider

  return class ApplyTheme extends Component {

    static propTypes = {
      /**
       * Theme. Can be key or object with theme overrides
       */
      name: PropTypes.string,
      /**
       * Override some values
       * @type {[type]}
       */
      override: PropTypes.object,
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

    buildThemeData() {
      const parent = this.context[contextFieldName]
      const { name, override } = this.props
      let data
      if (!parent) {
        data = name ? provider.getThemeData(name) : provider.getDefaultThemeData()
        if (override)
          data = merge({}, data, override)
      } else {
        data = parent
        if (name)
          data = merge({}, data, provider.getThemeData(name))
        if (override)
          data = merge({}, data, override)
      }
      return data
    }

    getChildContext() {
      if (this.props.watch || !this.themeData)
        this.themeData = this.buildThemeData()
      return {
        [contextFieldName]: this.themeData
      }
    }

    render() {
      return this.props.children
    }
  }
}

import { Component } from 'react'
import PropTypes from 'prop-types'
import merge from 'lodash/merge'
import isEqual from 'lodash/isEqual'

export function create(provider) {
  const { contextFieldName, createDefaultJss } = provider

  return class ApplyTheme extends Component {

    static propTypes = {
      /**
       * Theme object
       */
      theme: PropTypes.object,
      /**
       * Jss object
       */
      jss: PropTypes.object
    }

    static contextTypes = {
      [contextFieldName]: PropTypes.object
    }

    static childContextTypes = {
      [contextFieldName]: PropTypes.object
    }

    getJSS() {
      if (this.jss)
        return this.jss
      const ctx = this.context[contextFieldName]
      this.jss = ctx && ctx.jss
      if (!this.jss)
        this.jss = this.props.jss || createDefaultJss()
      return this.jss
    }

    getResultTheme() {
      const ctx = this.context[contextFieldName]
      const parentTheme = ctx && ctx.theme
      const propsTheme = this.props.theme

      if (this.resultTheme && parentTheme === this.parentTheme && (propsTheme === this.propsTheme || isEqual(propsTheme, this.propsTheme)))
        return this.resultTheme

      this.resultTheme = merge({}, parentTheme, propsTheme)
      this.propsTheme = propsTheme
      this.parentTheme = parentTheme
      return this.resultTheme
    }

    getChildContext() {
      return {
        [contextFieldName]: {
          provider,
          jss: this.getJSS(),
          theme: this.getResultTheme()
        }
      }
    }

    render() {
      return this.props.children
    }
  }
}

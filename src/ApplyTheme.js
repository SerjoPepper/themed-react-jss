import { Component } from 'react'
import PropTypes from 'prop-types'
import merge from 'lodash/merge'
import EventEmitter from 'events'
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

    constructor(props) {
      super(props)
      this.events = new EventEmitter()
      this.events.setMaxListeners(0)
    }

    componentWillUnmount() {
      this.events.removeAllListeners()
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

    getResultTheme(props = this.props, context = this.context) {
      const ctx = context[contextFieldName]
      const parentTheme = ctx && ctx.theme
      const propsTheme = props.theme

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
          events: this.events,
          jss: this.getJSS(),
          theme: this.getResultTheme()
        }
      }
    }

    componentWillUpdate(nextProps, nextState, nextContext) {
      if (this.resultTheme !== this.getResultTheme(nextProps, nextContext))
        this.events.emit('update', this.resultTheme)
    }

    render() {
      return this.props.children
    }
  }
}

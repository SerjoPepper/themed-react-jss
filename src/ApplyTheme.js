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

    onParentUpdate = (parentTheme) => {
      if (this.resultTheme !== this.getResultTheme(this.props.theme, parentTheme))
        this.events.emit('update', this.resultTheme)
    };

    componentWillMount() {
      const ctx = this.context[contextFieldName]
      if (ctx)
        ctx.events.on('update', this.onParentUpdate)
    }

    componentWillUnmount() {
      const ctx = this.context[contextFieldName]
      if (ctx)
        ctx.events.removeListener('update', this.onParentUpdate)
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

    getParentTheme(context = this.context) {
      const ctx = context[contextFieldName]
      return ctx ? ctx.theme : null
    }

    getResultTheme(propsTheme, parentTheme) {
      if (this.resultTheme && (parentTheme === this.parentTheme) && isEqual(propsTheme, this.propsTheme))
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
          theme: this.getResultTheme(this.props.theme, this.getParentTheme())
        }
      }
    }

    componentWillUpdate(nextProps, nextState, nextContext) {
      if (this.resultTheme !== this.getResultTheme(nextProps.theme, this.getParentTheme(nextContext)))
        this.events.emit('update', this.resultTheme)
    }

    render() {
      return this.props.children
    }
  }
}

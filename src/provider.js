import preset from 'jss-preset-default'
import { create as createOriginalJss } from 'jss'
import { create as createApplyTheme } from './ApplyTheme'
import { create as createInjectSheet } from './injectSheet'

export const createJss = (options = preset()) => createOriginalJss(options)

const randomId = () =>
  Math.floor(Math.random() * 10e10).toString(36)

/**
 * Theme provider
 */
class Provider {
  /**
   * Constructor
   * @param  {Object} [options] - Options
   * @param  {String} [options.contextFieldName] - Property name for context
   */
  constructor(options = {}) {
    this.contextFieldName = options.contextFieldName || `themeProvider_${randomId()}`
    this.createDefaultJss = createJss
    this.ApplyTheme = createApplyTheme(this)
    this.injectSheet = createInjectSheet(this)
  }
}

export function createProvider(options) {
  return new Provider(options)
}

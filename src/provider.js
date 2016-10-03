import preset from 'jss-preset-default'
import merge from 'lodash/merge'
import { create as createJss } from 'jss'
import { create as createApplyTheme } from './ApplyTheme'
import { create as createInjectSheet } from './injectSheet'

const randomId = () =>
  Math.floor(Math.random() * 10e10).toString(36)

/**
 * Theme provider
 */
class Provider {
  /**
   * Constructor
   * @param  {Object} options - Options
   * @param  {Object} options.jss - Jss Object
   * @param  {String} options.contextFieldName - Property name for context
   */
  constructor(options) {
    this.contextFieldName = options.contextFieldName || `themeProvider_${randomId()}`
    this.jss = options.jss || createJss(preset())
    this.ApplyTheme = createApplyTheme(this)
    this.injectSheet = createInjectSheet(this)
    this.themes = {}
  }

  defineTheme(name, parentTheme, themeData) {
    let resultData = {}
    if (!themeData) {
      themeData = parentTheme
      parentTheme = undefined
    }
    if (typeof parentTheme === 'string')
      parentTheme = [parentTheme]
    parentTheme.forEach((parentThemeName) => {
      resultData = merge(resultData, this.getThemeData(parentThemeName))
    })
    this.setThemeData(name, merge(resultData, themeData))
  }

  extendTheme(name, themeData) {
    this.setThemeData(name, merge({}, this.getThemeData(name), themeData))
  }

  setThemeData(name, themeData) {
    this.themes[name] = themeData
  }

  getThemeData(name) {
    return this.themes[name]
  }

}

export function create(options) {
  return new Provider(options)
}

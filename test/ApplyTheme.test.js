import React, { Component } from 'react'
import { mount } from 'enzyme'
import { findDOMNode } from 'react-dom'
import { createProvider, createJss } from '../src/provider'

const provider = createProvider()
const { ApplyTheme, injectSheet } = provider
class RawComponent extends Component {
  render() {
    const { sheet: { classes }, theme } = this.props
    return <div className={ classes.baseDiv } style={{ width: theme.size.width }}>hello</div>
  }
}
const StyledComponent = injectSheet(theme => ({
  baseDiv: {
    display: 'inline-block',
    height: theme.size.height,
    color: theme.palette.accent
  }
}))(RawComponent)

const themeFoo = {
  palette: {
    accent: 'rgb(0, 0, 0)'
  },
  size: {
    height: '20px',
    width: '100px'
  }
}

const themeFooChild = {
  ...themeFoo,
  size: {
    ...themeFoo.size,
    height: '10px'
  }
}

const themeBar = {
  size: {
    height: '5px'
  },
  palette: {
    accent: 'rgb(255, 0, 0)'
  }
}


describe('ApplyTheme test', () => {

  let container

  const getStyles = (component) => {
    const node = findDOMNode(mount(component, { attachTo: container }).get(0))
    const computedStyles = getComputedStyle(node)
    const resultStyles = {}
    for (let i = 0; i < computedStyles.length; i += 1) {
      const name = computedStyles[i]
      resultStyles[name] = computedStyles.getPropertyValue(name)
    }
    return resultStyles
  }

  beforeAll(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
  })

  it('Theme "foo" is applied', () => {
    const styles = getStyles(
      <ApplyTheme theme={themeFoo}><StyledComponent/></ApplyTheme>
    )
    expect(styles.height).toEqual('20px')
    expect(styles.width).toEqual('100px')
    expect(styles.color).toEqual('rgb(0, 0, 0)')
  })

  it('Inherited theme applied', () => {
    const styles = getStyles(
      <ApplyTheme theme={themeFooChild}><StyledComponent/></ApplyTheme>
    )
    expect(styles.height).toEqual('10px')
    expect(styles.width).toEqual('100px')
    expect(styles.color).toEqual('rgb(0, 0, 0)')
  })

  it('Override theme values', () => {
    const styles = getStyles(
      <ApplyTheme theme={themeFoo}>
        <ApplyTheme theme={{ palette: { accent: 'rgb(0, 128, 0)' } }}>
          <StyledComponent/>
        </ApplyTheme>
      </ApplyTheme>
    )
    expect(styles.height).toEqual('20px')
    expect(styles.width).toEqual('100px')
    expect(styles.color).toEqual('rgb(0, 128, 0)')
  })

  it('Apply multiple themes', () => {
    const styles = getStyles(
      <ApplyTheme theme={themeFoo}>
        <ApplyTheme theme={themeBar}>
          <StyledComponent/>
        </ApplyTheme>
      </ApplyTheme>
    )
    expect(styles.height).toEqual('5px')
    expect(styles.width).toEqual('100px')
    expect(styles.color).toEqual('rgb(255, 0, 0)')
  })

  it('Jss renders to string', () => {
    const jss = createJss()
    mount(
      <ApplyTheme theme={themeFooChild} jss={jss}>
        <StyledComponent/>
      </ApplyTheme>,
      { attachTo: container }
    )
    expect(jss.sheets.toString().length > 0).toBe(true)
  })
})

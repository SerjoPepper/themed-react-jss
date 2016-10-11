# Apply theme provider for JSS
This library helps you style your react components with JSS

## Install
```
npm install --save themed-react-jss
```

## Usage
```js
import React, { Component } from 'react'
import { render } from 'react/lib/ReactDOM'
import { create as createProvider } from 'themed-react-jss'

const provider = createProvider()
const { ApplyTheme, injectSheet, defineTheme, changeTheme } = provider

provider.defineTheme('myTheme', {
  sizes: {
    padding: '10px',
    font: '16px'
  },
  palette: {
    font: '#000',
    background: '#eee'
  }
}, { isDefault: true })

provider.defineTheme('otherTheme', {
  sizes: {
    font: '18px'
  }
}, {
  inherit: ['myTheme']
})

class RawButton extends Component {
  render() {
    const { sheet, theme } = this.props
    return <button 
      className={ sheet.classes.button } 
      style={{ fontSize: theme.sizes.font }}>hello</button>
  }
}

// or use decorators
// @injectSheet(...)
const StyledButton = injectSheet(theme => ({
  button: {
    padding: theme.sizes.padding,
    'font-size': theme.sizes.font,
    color: theme.palette.font,
    background: theme.palette.background,
    margin: '20px'
  }
}))(RawButton)

// Usage
render((
  <ApplyTheme name='myTheme'><StyledButton/></ApplyTheme>
), document.body)

// Usage with overrides and defaultThemes
render((
  <ApplyTheme>
    <ApplyTheme name="otherTheme">
      <StyledButton/>
    </ApplyTheme>
    <ApplyTheme override={{ palette: { font: 'green' } }}>
      <StyledButton/>
    </ApplyTheme>
  </ApplyTheme>
))

```

### Provider options
```js
import { create as createProvider } from 'themed-react-jss'

const provider = createProvider({
  // name of context field, random generated string by default
  contextFieldName: 'MyThemeProvider',
  // instance of JSS
  jss: createJss()
})
```

### Define and change themes
```js
import { create as createProvider } from 'themed-react-jss'
const provider = createProvider()
const { ApplyTheme, injectSheet, defineTheme, changeTheme } = provider

defineTheme('light', {
  size: '20px',
  color: '#fff'
})

defineTheme('dark', {
  color: '#000'
}, {
  // parent themes
  inherit: ['light'],
  // Default theme or not
  isDefault: true
})

// change defined theme
changeTheme('light', {
  size: '10px'
})
```

### injectSheet options
```js
// This options passed to
// jss.createStyleSheet(rules, options)
// as options
@injectSheet(theme => {

}, {
  ...options
})
class Buttons extends Component {
  ...
}
```

### Server-side rendering
You can get your styles as a string with
```js
provider.jss.sheets.toString()
```


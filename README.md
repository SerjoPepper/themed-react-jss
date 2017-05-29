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
import { createProvider } from 'themed-react-jss'

const provider = createProvider()
const { ApplyTheme } = provider

const myTheme = {
  sizes: {
    padding: '10px',
    font: '16px'
  },
  palette: {
    font: '#000',
    background: '#eee'
  }
}

const otherTheme = {
  sizes: {
    font: '18px'
  }
}

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
  <ApplyTheme theme={myTheme}><StyledButton/></ApplyTheme>
), document.body)

// Usage with overrides and customJss

render((
  <ApplyTheme theme={myTheme} jss={createJss()}>
    <ApplyTheme theme={otherTheme}>
      <StyledButton/>
    </ApplyTheme>
    <ApplyTheme theme={{ palette: { font: 'green' } }}>
      <StyledButton/>
    </ApplyTheme>
  </ApplyTheme>
))

```

### Provider options
```js
import { createProvider } from 'themed-react-jss'

const provider = createProvider({
  // name of context field, random generated string by default
  contextFieldName: 'MyThemeProvider'
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
import React, { Component } from 'react'
import { render } from 'react/lib/ReactDOM'
import { createProvider, createJss } from 'themed-react-jss'

const jss = createJss()
render((
  <ApplyTheme theme={myTheme} jss={jss}>
    <StyledButton/>
  </ApplyTheme>
))

const resultCssString = jss.sheets.toString()
```


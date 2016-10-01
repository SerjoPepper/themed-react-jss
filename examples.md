# Component declaration
```
import { applyStyles } from '../themeProvider'

// theme - result theme variables
// у каждого объекта темы есть id-шник
@applyStyles(theme => ({
  'Button': {
    color: theme.buttons.color
  },
  'Button__text': {
    color: theme.buttons.textColor
  }
}))
class Button extends Component {
  render() {
    return (
      <div className={ {classnames(this.props.classes.Button) }>
        <span className={ this.props.classes.Button__text }>
          { this.props.children }
        </span>
      </div>
    )
  }
}
```

Outputs:
```
<div class="button--123123 button--098098 button--234234">
</div>
```

Where `button--098098` relates to blue theme and `button--234234` relates to customStyle. 

# Component using
```
@applyStyles({
  asdasd: 123,
  asdad: 13234
})
class App extends Component {
  render() {
    return <Button theme="blue" } />
  }
}
```

# Creating theme
```
const myTheme = {
  buttons: {
    color: 'red'
  }
}
const config = {
  themes: {
    myTheme: myTheme,
    blue: {
      buttons: { color: 'blue' }
    }
  },
  default: 'myTheme'
}

const provider = createThemeProvider({
  themeConfig: {},
  defaultTheme: 'default',
  jss: createJss()
})
const { ApplyTheme, injectSheet, defineTheme, extendTheme } = provider

extendTheme('black', {
  palette: {
    buttons: '#000'
  }
})

defineTheme('white', ['default'], {
  palette: {
    buttons: '#eee'
  }
})

<ApplyTheme theme={{ buttons: { color: 'black' } }}>
  <ApplyTheme theme='black'>
    <ApplyTheme theme='black'>
      <App />
    </ApplyTheme>
  </ApplyTheme>
  <ApplyTheme theme="red">
    <Button />
  </ApplyTheme>
</ApplyTheme>
```

import * as React from 'react'
import * as ReactDOM from 'react-dom'

import MainApp from './mainApp'

const App = React.createElement(MainApp, {}, null)
ReactDOM.render(App, document.getElementById('app'))

import React from 'react'
import ReactDOM from 'react-dom'
import 'babel-polyfill'
import { ApolloProvider } from 'react-apollo'
import { BrowserRouter } from 'react-router-dom'
import { IntlProvider, addLocaleData } from 'react-intl'
import { ToastContainer } from 'react-toastify'
import en from 'react-intl/locale-data/en'
import es from 'react-intl/locale-data/es'
import fr from 'react-intl/locale-data/fr'
import de from 'react-intl/locale-data/de'
import zh from 'react-intl/locale-data/zh'
import registerServiceWorker from './registerServiceWorker'
import localeData from './data.json'
import configureClient from './configureClient'
import './styles/index.scss'
import './assets/bootstrap.scss'
import '../node_modules/font-awesome/css/font-awesome.min.css'
import Routes from './routes'
import App from './App'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

const client = configureClient()

addLocaleData([...en, ...es, ...fr, ...de, ...zh])
let language =
  (navigator.languages && navigator.languages[0]) ||
  navigator.language ||
  navigator.userLanguage
if (language.indexOf('-') !== -1) language = language.split('-')[0]

if (language.indexOf('_') !== -1) language = language.split('_')[0]
const messages = localeData[language] || localeData.en
ReactDOM.render(
  <MuiThemeProvider>
    <BrowserRouter>
      <IntlProvider locale={language} messages={messages}>
        <ApolloProvider client={client}>
          <div>
            <ToastContainer className="toast-container" autoClose={false} />
            <Routes />
            <App />
          </div>
        </ApolloProvider>
      </IntlProvider>
    </BrowserRouter>
  </MuiThemeProvider>,
  document.getElementById('root')
)
registerServiceWorker()

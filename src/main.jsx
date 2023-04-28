import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import ThemeWrapper from '../theme/ThemeProvider.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
//import UserProvider from '../context/UserContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      {/* <UserProvider> */}
        <ThemeWrapper>
          <App />
        </ThemeWrapper>
      {/* </UserProvider> */}
    </BrowserRouter>
  </React.StrictMode>,
)
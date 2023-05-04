import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import ThemeWrapper from '../theme/ThemeProvider.jsx'
import { BrowserRouter } from 'react-router-dom'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/en-gb';
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <>
    {/* <React.StrictMode> */}
    <BrowserRouter>
      <ThemeWrapper>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='en-gb'>
          <App />
        </LocalizationProvider>
      </ThemeWrapper>
    </BrowserRouter>
    {/* </React.StrictMode> */}
  </>
)
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.scss'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthProvider.jsx'
import { ThemeProvider, createTheme } from '@mui/material'
import { DataProvider } from './context/DataProvider.jsx'

const theme = createTheme({
  typography: {
    allVariants: {
      fontFamily: 'Poppins, sans-serif'
    }
  },
  palette: {
    primary: {
      main: "#2DA544",
      light: '#FFD500'
    },
    secondary: {
      main: "#F8C6FB",
      light: "#FFF"
    },

    common: {
      main: "#FFF"
    }
  },

  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          padding: '12px',
          borderRadius: '8px'
        },
        contained: {
          fontWeight: 'bold'
        },
        sizeSmall: {
          padding: '8px',
        }
      }
    }
  }
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <ThemeProvider theme={theme} >
    <AuthProvider>
      <DataProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/*" element={<App />} />
          </Routes>
        </BrowserRouter>
      </DataProvider>
    </AuthProvider>
  </ThemeProvider>
)

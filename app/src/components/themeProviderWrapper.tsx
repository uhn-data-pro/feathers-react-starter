import React from 'react'
import { ThemeProvider } from '@mui/material/styles'

const ThemeProviderWrapper = (props) => {

  const { theme } = props

  return (
    <ThemeProvider theme={theme()}>
      {props.children}
    </ThemeProvider>
  );
}

export default ThemeProviderWrapper
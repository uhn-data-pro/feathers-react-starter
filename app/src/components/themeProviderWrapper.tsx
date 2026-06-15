import { ThemeProvider } from "@mui/material/styles"
import React from "react"

const ThemeProviderWrapper = (props) => {
  const { theme } = props

  return <ThemeProvider theme={theme()}>{props.children}</ThemeProvider>
}

export default ThemeProviderWrapper

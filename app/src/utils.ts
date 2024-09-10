import { Breakpoint, Theme, useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTranslation } from 'react-i18next'

import { ENVIRONMENT } from './constants/'

type BreakpointOrNull = Breakpoint | null;

export function useWidth() {
  const theme: Theme = useTheme()
  const keys: readonly Breakpoint[] = [...theme.breakpoints.keys].reverse()
  return (
    keys.reduce((output: BreakpointOrNull, key: Breakpoint) => {
      const matches = useMediaQuery(theme.breakpoints.up(key))
      return !output && matches ? key : output
    }, null) || 'xs'
  )
}

export function isMobile() {
  const width = useWidth()
  return width === 'xs' || width === 'sm'
}

export function translateString(id : string, defaultMessage : string) {
  
  const { t, i18n } = useTranslation()

  if (ENVIRONMENT === 'development') {
    if (!i18n.exists(id)) {
      return('**' + defaultMessage + '**')
    }
  }
  return t(id)

}

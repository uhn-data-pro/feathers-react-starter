import React from 'react'
import { useTranslation } from 'react-i18next'

import { ENVIRONMENT } from '../constants/'

// Highlight any missing strings in the app to easily tell which are using defaults
export default ({ values = {}, ...props}) => {

  const { t, i18n } = useTranslation()
  const { id, defaultMessage } = props

  if (ENVIRONMENT === 'development') {

    if (!i18n.exists(id)) {
      return (<mark>{defaultMessage}</mark>)
    }
  }

  return t(id)
}

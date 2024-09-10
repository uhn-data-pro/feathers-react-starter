import { Theme, createTheme, StyledEngineProvider } from '@mui/material/styles'
import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import { SPA_BASE_URL } from './constants/'
import './i18n'
import App from 'STARTER/App'
import ThemeProviderWrapper from 'STARTER/components/themeProviderWrapper'
import AuthProvider from 'STARTER/contexts/auth'

const SW_UPDATE_PERIOD = process.env.NODE_ENV === 'production' ? 1000 * 60 * 5 : 5000 // 5 minutes on prod, 5 seconds on dev

const theme : (() => Theme) = () => createTheme({ 
  //put things like standard colours, font family, MUI overrides here
  typography: {
    fontFamily: ['Roboto', 'sans-serif'].join(',')
  },
})

let newWorker : ServiceWorker
window.addEventListener('message', e => {
  if(e.data === 'updateActionSelected'){
    newWorker.postMessage({ action: 'skipWaiting' })
  }
})

// Register the service worker if possible
if ('serviceWorker' in navigator && (process.env.NODE_ENV === 'production' ? (window.location.protocol === 'https:') : (window.location.hostname === 'localhost' || window.location.protocol === 'http:'))) {

  const cacheName = 'sw_cache'
  window.addEventListener('fetch', (event : FetchEvent ) => {
    // Check if this is a navigation request
    if (event.request.mode === 'navigate') {
      // Open the cache
      event.respondWith(caches.open(cacheName).then((cache) => {
        // Go to the network first
        return fetch(event.request.url).then((fetchedResponse) => {
          cache.put(event.request, fetchedResponse.clone())

          return fetchedResponse
        }).catch(() => {
          // If the network is unavailable, get
          return cache.match(event.request.url)
        })
      }))
    } else {
      return
    }
  })

  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').then(reg => {

      reg.addEventListener('updatefound', () => {
        newWorker = reg.installing

        newWorker.addEventListener('statechange', () => {
          switch (newWorker.state) {
          case 'installed':
            if (navigator.serviceWorker.controller) {
              // new update available
              window.postMessage('newUpdateDetected', SPA_BASE_URL)
            }
            // No update available
            break
          }
        })
      })

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const update_interval = setInterval(() => {
        reg.update()
      }, SW_UPDATE_PERIOD)

      let refreshing
      // The event listener that is fired when the service worker updates
      // Here we reload the page
      navigator.serviceWorker.addEventListener('controllerchange', function () {

        if (refreshing) return
        window.location.reload()
        refreshing = true
      })

    }).catch(registrationError => {
      console.log('SW registration failed: ', registrationError)
    })
  })
}

const container = document.getElementById('app')
const root = createRoot(container)

root.render(
  <AuthProvider>
    <StyledEngineProvider injectFirst>
      <ThemeProviderWrapper theme={theme}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ThemeProviderWrapper>
    </StyledEngineProvider>
  </AuthProvider>
)

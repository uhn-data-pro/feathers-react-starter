import React, { createContext, useEffect, useState } from 'react'

import app from 'STARTER/feathers-client'

export type AuthContextType = {
  isAuthed: boolean,
  isAuthLoading: boolean,
  isLoginLoading: boolean,
  authenticate : (options: authData) => Promise<void>,
  user: user,
  logout: () => void
}

export const AuthContext = createContext<AuthContextType>(null)
AuthContext.displayName = 'AuthContext' // Show context name in React Dev Tools

export type user = { id: string, email: string, role: string }

export type authData = { strategy: string, email: string, password: string }

const AuthProvider = ({ children }) => {

  const [isAuthed, _setIsAuthed] = useState(false)
  const [isAuthLoading, setIsAuthLoading] = useState(true)
  const [isLoginLoading, setIsLoginLoading] = useState(false)
  const [user, setUser] = useState(null)

  const isAuthedRef = React.useRef(isAuthed)
  const setIsAuthed = (isAuthed : boolean) => {
    isAuthedRef.current = isAuthed
    _setIsAuthed(isAuthed)
  }

  const authenticate = (options : authData) => {
    return app
      .authenticate(options)
      .then((auth : any) => loadUserData(auth.user))
      .catch((error : Error) => {
        setIsAuthed(false)

        // Propagate error forward so we can handle it in the login component
        throw error
      })
  }

  const setAuthState = (authed : boolean) => {
    setIsAuthed(authed)
    setIsAuthLoading(false)
    setIsLoginLoading(false)
  }

  const logout = ( ) => {
    app.logout().then(() => {
      setIsAuthed(false)
      setUser(null)
    })
  }

  const loadUserData = (user : user) => {
    setUser(user)
    setAuthState(true)
  }

  const login = () => {
    const hash = window.location.hash
    Promise.all([
      app.authentication.getAccessToken(),
      app.authentication.getFromLocation(window.location)
    ])
      .then(([storageToken, windowToken]) => {
        if (windowToken) {
          return app.authentication.setAccessToken(windowToken)
        }
      })
      .then(() => app.reAuthenticate())
      .then((auth) => {
        loadUserData(auth)
      })
      .catch(() => {
        setAuthState(false)
      })
  }

  useEffect(() =>  {
    if(!isAuthed && !isLoginLoading) {
      setIsLoginLoading(true)
      login()
    }
  }, [isAuthed])


  const defaultContext : AuthContextType = {
    isAuthed, isAuthLoading, isLoginLoading, authenticate, user, logout
  }

  return (
    <AuthContext.Provider value={defaultContext}>
      {children}
    </AuthContext.Provider>
  )
} 

export default AuthProvider
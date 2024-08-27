import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import AuthContextProvider from 'STARTER/contexts/auth'

import Home from 'STARTER/pages/home'
import Dashboard from 'STARTER/pages/dashboard'
import Protected from 'STARTER/components/protected'


const App = () => {

  return (
    <AuthContextProvider>
      <Routes>
        <Route path='/home' element={<Home/>}/>
        <Route
          path='/dashboard'
          element={
            <Protected>
              <Dashboard/>
            </Protected>
          }
        />
        <Route path="*" element={<Navigate to="/home" replace />}/>
      </Routes>
    </AuthContextProvider>
  )
}

export default App

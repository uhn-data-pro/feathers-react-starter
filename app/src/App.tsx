import React from "react"
import { Navigate, Route, Routes } from "react-router-dom"

import Protected from "STARTER/components/protected"
import AuthContextProvider from "STARTER/contexts/auth"
import Dashboard from "STARTER/pages/dashboard"
import Home from "STARTER/pages/home"

const App = () => {
  return (
    <AuthContextProvider>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route
          path="/dashboard"
          element={
            <Protected>
              <Dashboard />
            </Protected>
          }
        />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </AuthContextProvider>
  )
}

export default App

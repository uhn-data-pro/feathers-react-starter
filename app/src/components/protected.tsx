import CircularProgress from '@mui/material/CircularProgress'
import React, { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { AuthContext, AuthContextType } from 'STARTER/contexts/auth'


const Protected = ({ children }) => {
  const { isAuthed, isAuthLoading } = useContext(AuthContext) as AuthContextType
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuthed && !isAuthLoading) navigate('/login', {replace: true})
  }, [isAuthed, isAuthLoading])

  return(
    <div>
      {(isAuthLoading || !isAuthed)
        ? <CircularProgress />
        : children
      }
    </div>
  )
}

export default Protected

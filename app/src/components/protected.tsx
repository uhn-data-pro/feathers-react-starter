import React, { useContext, useEffect } from 'react'
import { AuthContext, AuthContextType } from 'STARTER/contexts/auth'
import {
  useNavigate
} from 'react-router-dom'

import CircularProgress from '@mui/material/CircularProgress'

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
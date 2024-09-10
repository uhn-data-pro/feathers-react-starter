import CircularProgress from '@mui/material/CircularProgress'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import React, { useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'

import FormattedMessage from 'STARTER/components/formattedMessage'
import Login from 'STARTER/components/login'
import Registration from 'STARTER/components/registration'
import { AuthContext, AuthContextType } from 'STARTER/contexts/auth'
import { isMobile } from 'STARTER/utils'

export default function Home() {
  const { authenticate, isLoginLoading, isAuthed  } = useContext(AuthContext) as AuthContextType

  const navigate = useNavigate()

  const onMobile = isMobile()

  useEffect(() => {
    if (isAuthed) navigate('/dashboard', { replace: true })
  }, [isAuthed])

  const handleLogin = (options) => {
    return authenticate(options)
      .then(() => navigate('/dashboard'))
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        width: '100%',
        overflow: 'hidden',
        position: 'absolute',
      }}
    >
      <Paper
        elevation={onMobile ? 0 : 3}
        style={{
          padding: onMobile ? 10 : 20,
          position: 'relative',
          minHeight: 500,
          ...(onMobile
            ? { height: '100%', width: '100%', overflow: 'scroll' }
            : { width: 500 }),
        }}
      >
        <div
          style={{
            fontFamily: 'Roboto, Arial, Helvetica, sans-serif',
            fontSize: 28,
            fontWeight: 700,
            textAlign: 'center',
            marginTop: onMobile ? 10 : 20,
            marginBottom: onMobile ? 10 : 40,
          }}
        >
						Project Name
        </div>
        {isLoginLoading ? (
          <div
            style={{
              position: 'fixed',
              right: 'calc(50vw - 22px)',
              top: 'calc(50vh - 22px)',
            }}
          >
            <CircularProgress />
          </div>
        ) : (
          <div>
            <Typography style={{ fontSize: 16, padding: '0 20px' }}>
              <FormattedMessage id='login.alreadyHaveAccount' defaultMessage='Already have an account?'/>
            </Typography>
            <Login authenticate={handleLogin} />
            <Typography
              style={{
                margin: '30px auto',
                textAlign: 'center',
              }}
            >
              <FormattedMessage id='home.or' defaultMessage='or'/>
            </Typography>
            <Typography style={{fontSize: 16, padding: '0 20px' }}>
              <FormattedMessage id='register.newUser' defaultMessage='Register as a new user'/>
            </Typography>
            <Registration authenticate={authenticate} />
          </div>
        )}
      </Paper>
    </div>
  )
}

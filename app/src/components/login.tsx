import Button from '@mui/material/Button'
import Snackbar from '@mui/material/Snackbar'
import TextField from '@mui/material/TextField'
import React, { useState } from 'react'

import FormattedMessage from 'STARTER/components/formattedMessage'
import { translateString } from 'STARTER/utils'

export interface LoginProps {
	authenticate: (options: any) => Promise<void>;
}

export default function Login({ authenticate }: LoginProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [snackBarOpen, setSnackBarOpen] = useState(false)
  const [snackBarMessage, setSnackBarMessage] = useState('')

  const handleCloseSnackBar = () => {
    setSnackBarOpen(false)
    setSnackBarMessage('')
  }

  const handleLogin = () => {
    return authenticate({ strategy: 'local', email, password })
      .catch(() => {
        setSnackBarOpen(true)
        setSnackBarMessage('Login unsuccessful')
      })
  }

  return (
    <div style={{ padding: '0 20px' }}>
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        open={snackBarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackBar}
        message={snackBarMessage}
      />
      <TextField
        autoComplete='true'
        id='email-local'
        fullWidth
        margin='normal'
        label={translateString('login.email', 'email')}
        onChange={(e) => setEmail(e.target.value)}
        type='email'
        value={email}
        variant='outlined'
      />
      <TextField
        autoComplete='true'
        id='password-local'
        fullWidth
        margin='normal'
        label={translateString('login.password', 'password')}
        onChange={(e) => setPassword(e.target.value)}
        type='password'
        value={password}
        variant='outlined'
      />
      <div style={{ textAlign: 'center', marginBottom: 20, marginTop: 16 }}>
        <Button
          variant='outlined'
          fullWidth
          size='large'
          onClick={() => handleLogin()}
        >
          <FormattedMessage id='login.login' defaultMessage='Login'/>
        </Button>
      </div>
    </div>
  )
}

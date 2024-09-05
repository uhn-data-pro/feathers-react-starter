import React, { useState } from 'react';

import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'

import FormattedMessage from 'STARTER/components/formattedMessage'
import { translateString } from 'STARTER/utils'

export interface LoginProps {
	authenticate: (options: any) => Promise<void>;
}

export default function Login({ authenticate }: LoginProps) {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	return (
		<div style={{ padding: '0 20px' }}>
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
					onClick={() => authenticate({ strategy: 'local', email, password })}
				>
					<FormattedMessage id='login.login' defaultMessage='Login'/>
				</Button>
			</div>
		</div>
	);
}

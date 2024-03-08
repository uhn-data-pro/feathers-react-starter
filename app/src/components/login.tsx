import React, { useState } from 'react';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

export interface LoginProps {
	authenticate: (options: any) => Promise<void>;
}

export default function Login({ authenticate }: LoginProps) {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	return (
		<div style={{ padding: '0 20px' }}>
			<TextField
				fullWidth
				required
				id='email-local'
				label='Email'
				margin='normal'
				onChange={(event) => setEmail(event.target.value)}
				type='email'
				variant='outlined'
				value={email}
			/>
			<TextField
				fullWidth
				required
				id='password-local'
				label='Password'
				margin='normal'
				onChange={(event) => setPassword(event.target.value)}
				type='password'
				variant='outlined'
				value={password}
			/>
			<div style={{ textAlign: 'center', marginBottom: 20, marginTop: 16 }}>
				<Button
					variant='contained'
					color='secondary'
					onClick={() => authenticate({ email, password })}
					style={{ width: '100%' }}
				>
					Login
				</Button>
			</div>
		</div>
	);
}

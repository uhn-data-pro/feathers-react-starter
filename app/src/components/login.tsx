import React, { useState } from 'react';

import { Button, TextField } from '@shopify/polaris';

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
				label='Email'
				onChange={(value) => setEmail(value)}
				type='email'
				value={email}
			/>
			<TextField
				autoComplete='true'
				id='password-local'
				label='Password'
				onChange={(value) => setPassword(value)}
				type='password'
				value={password}
			/>
			<div style={{ textAlign: 'center', marginBottom: 20, marginTop: 16 }}>
				<Button
					variant='primary'
					fullWidth
					size='large'
					onClick={() => authenticate({ email, password })}
				>
					Login
				</Button>
			</div>
		</div>
	);
}

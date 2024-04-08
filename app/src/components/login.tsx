import React, { useState } from 'react';

import { Button, TextField } from '@shopify/polaris';

export interface LoginProps {
	loginUser: { email: string; password: string };
	updateLoginUser: (field, value) => void;
	authenticate: (options: any) => Promise<void>;
}

export default function Login({
	loginUser,
	updateLoginUser,
	authenticate,
}: LoginProps) {
	const { email, password } = loginUser;

	return (
		<div style={{ padding: '0 20px' }}>
			<TextField
				autoComplete='true'
				id='email-local'
				label='Email'
				onChange={(value) => updateLoginUser('email', value)}
				type='email'
				value={email}
			/>
			<TextField
				autoComplete='true'
				id='password-local'
				label='Password'
				onChange={(value) => updateLoginUser('password', value)}
				type='password'
				value={password}
			/>
			<div style={{ textAlign: 'center', marginBottom: 20, marginTop: 16 }}>
				<Button
					variant='primary'
					fullWidth
					size='large'
					onClick={() => authenticate({ strategy: 'mfa', email, password })}
				>
					Login
				</Button>
			</div>
		</div>
	);
}

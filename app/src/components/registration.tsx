import React, { useState } from 'react';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Snackbar from '@mui/material/Snackbar';

import app from '../feathers-client';

export interface RegistrationProps {
	registerUser: {
		email: string;
		password: string;
		passwordConfirmation: string;
	};
	updateRegisterUser: (field: string, value: string) => void;
	authenticate: (options: any) => Promise<void>;
}
export default function Registration({
	registerUser,
	updateRegisterUser,
	authenticate,
}: RegistrationProps) {
	const { email, password, passwordConfirmation } = registerUser;
	const [error, setError] = useState('');
	const [snackBarOpen, setSnackBarOpen] = useState(false);
	const [snackBarMessage, setSnackBarMessage] = useState('');

	const handleCloseSnackBar = () => setSnackBarOpen(false);

	const handleRegisterUser = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();

		if (password !== passwordConfirmation) {
			return setError('Please make sure your passwords match');
		}

		return app
			.service('users')
			.create({ email, password })
			.then(() => authenticate({ strategy: 'local', email, password }))
			.catch((err) => {
				console.error(err);
				setSnackBarOpen(true);
				setSnackBarMessage('Sorry, this email has already been used');
			});
	};

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
				error={error === 'email'}
				fullWidth
				required
				id='email'
				label='Email'
				margin='normal'
				onChange={(event) => updateRegisterUser('email', event.target.value)}
				type='email'
				variant='outlined'
				value={email}
			/>
			<TextField
				fullWidth
				required
				id='password'
				label='Password'
				margin='normal'
				onChange={(event) => updateRegisterUser('password', event.target.value)}
				type='password'
				variant='outlined'
				value={password}
			/>
			<TextField
				error={!!error}
				fullWidth
				helperText={error}
				required
				id='password-confirmation'
				label='Confirm Password'
				margin='normal'
				onChange={(event) =>
					updateRegisterUser('passwordConfirmation', event.target.value)
				}
				type='password'
				variant='outlined'
				value={passwordConfirmation}
			/>
			<div style={{ textAlign: 'center', marginBottom: 20, marginTop: 16 }}>
				<Button
					variant='contained'
					color='secondary'
					onClick={handleRegisterUser}
					style={{ width: '100%' }}
				>
					Sign Up
				</Button>
			</div>
		</div>
	);
}

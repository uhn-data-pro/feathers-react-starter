import React, { useState } from 'react';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Snackbar from '@mui/material/Snackbar';

import app from 'FRS/feathers-client.js';

export default function Registration(props) {
	const [newUser, setnewUser] = useState({
		email: '',
		password: '',
		passwordConfirmation: '',
	});
	const [error, setError] = useState(null);
	const [snackBarOpen, setSnackBarOpen] = useState(false);
	const [snackBarMessage, setSnackBarMessage] = useState('');

	const handleCloseSnackBar = () => setSnackBarOpen(false);

	const handleRegistrationChange = (field, value) =>
		setnewUser({ ...newUser, [field]: value });

	const handleRegisterUser = (event) => {
		event.preventDefault();
		const { email, password } = newUser;

		if (password !== newUser.passwordConfirmation) {
			return setError('Please make sure your passwords match');
		}

		app
			.service('users')
			.create({ email, password })
			.then(() => props.authenticate({ strategy: 'local', email, password }))
			.catch(() => {
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
				onChange={(event) =>
					handleRegistrationChange('email', event.target.value)
				}
				type='email'
				variant='outlined'
				value={newUser.email}
			/>
			<TextField
				fullWidth
				required
				id='password'
				label='Password'
				margin='normal'
				onChange={(event) =>
					handleRegistrationChange('password', event.target.value)
				}
				type='password'
				variant='outlined'
				value={newUser.password}
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
					handleRegistrationChange('passwordConfirmation', event.target.value)
				}
				type='password'
				variant='outlined'
				value={newUser.passwordConfirmation}
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

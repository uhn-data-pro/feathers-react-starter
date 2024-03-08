import React, { useState, useEffect } from 'react';

import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import Snackbar from '@mui/material/Snackbar';

import app from 'FRS/feathers-client.js';
import Login from 'FRS/components/login.jsx';
import Registration from 'FRS/components/registration.jsx';

import { isMobile } from './utils';

export default function App() {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [snackBarOpen, setSnackBarOpen] = useState(false);
	const [snackBarMessage, setSnackBarMessage] = useState(null);

	const authenticate = (options) => {
		return app
			.authenticate({ strategy: 'local', ...options })
			.then(() => setIsAuthenticated(true))
			.catch((err) => {
				setIsAuthenticated(false);
				setSnackBarOpen(true);
				setSnackBarMessage(
					'Login failed, please check your email and/or password'
				);
			});
	};

	const handleCloseSnackBar = () => setSnackBarOpen(false);

	useEffect(() => {
		app.authentication
			.getAccessToken()
			.then((accessToken) => {
				if (accessToken) {
					return app.reAuthenticate().then(() => setIsAuthenticated(true));
				}
			})
			.then(() => setIsLoading(false));
	}, []);

	const onMobile = isMobile();

	const textStyle = {
		fontFamily: 'Roboto, Arial, Helvetica, sans-serif',
		fontSize: 22,
		fontWeight: 100,
	};

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
			<Snackbar
				anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
				open={snackBarOpen}
				autoHideDuration={6000}
				onClose={handleCloseSnackBar}
				message={snackBarMessage}
			/>
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
				{isLoading ? (
					<div
						style={{
							position: 'fixed',
							right: 'calc(50vw - 22px)',
							top: 'calc(50vh - 22px)',
						}}
					>
						<CircularProgress />
					</div>
				) : isAuthenticated ? (
					<div
						style={{ ...textStyle, margin: '60px auto', textAlign: 'center' }}
					>
						Congrats, you're now logged in!
						<button onClick={() => setIsAuthenticated(false)}>Logout</button>
					</div>
				) : (
					<div>
						<div style={{ ...textStyle, fontSize: 16, padding: '0 20px' }}>
							Already have an account?
						</div>
						<Login authenticate={authenticate} />
						<div
							style={{
								...textStyle,
								margin: '30px auto',
								textAlign: 'center',
							}}
						>
							OR
						</div>
						<div style={{ ...textStyle, fontSize: 16, padding: '0 20px' }}>
							Register as a new user
						</div>
						<Registration authenticate={authenticate} />
					</div>
				)}
			</Paper>
		</div>
	);
}

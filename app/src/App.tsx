import React, { useState, useEffect } from 'react';

import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import Snackbar from '@mui/material/Snackbar';
import Button from '@mui/material/Button';

import app from './feathers-client';
import Login from './components/login';
import Registration from './components/registration';
import EnableTwoFa from './components/enableTwoFa';
import OtpInput from './components/otpInput';

import { isMobile } from './utils';
import '@shopify/polaris/build/esm/styles.css';
import translations from '@shopify/polaris/locales/en.json';
import { AppProvider } from '@shopify/polaris';

export default function App() {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [snackBarOpen, setSnackBarOpen] = useState(false);
	const [snackBarMessage, setSnackBarMessage] = useState('');
	const [registerUser, setRegisterUser] = useState({
		email: '',
		password: '',
		passwordConfirmation: '',
	});
	const [loginUser, setLoginUser] = useState({ email: '', password: '' });
	const [openEnable, setOpenEnable] = useState(false);
	const [openOtp, setOpenOtp] = useState(false);

	const authenticate = (options: any) => {
		return app
			.authenticate({ ...options })
			.then((res) => {
				// prompt if 2FA hasn't been enabled yet
				if (!res.user.twoFa) setOpenEnable(true);
				setIsAuthenticated(true);
			})
			.catch((err) => {
				// if mfa authentication strategy, prompt for code
				if (err.message === 'Prompt for OTP') {
					setOpenOtp(true);
				} else if (err.message === 'Incorrect OTP') {
					setSnackBarOpen(true);
					setSnackBarMessage('Incorrect code, please try again.');
				} else {
					console.error(err);
					setIsAuthenticated(false);
					setSnackBarOpen(true);
					setSnackBarMessage(
						'Login failed, please check your email and/or password'
					);
				}
			});
	};

	const handleCloseSnackBar = () => setSnackBarOpen(false);

	useEffect(() => {
		app.authentication
			.getAccessToken()
			.then((accessToken: string) => {
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
		<AppProvider i18n={translations}>
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
							style={{
								...textStyle,
								margin: '60px auto',
								display: 'flex',
								flexDirection: 'column',
								textAlign: 'center',
								gap: 20,
							}}
						>
							<EnableTwoFa
								open={openEnable}
								setOpen={setOpenEnable}
								email={registerUser.email || loginUser.email}
							/>
							<div>Congrats, you're now logged in!</div>
							<Button
								variant='contained'
								onClick={() => {
									setIsAuthenticated(false);
									setOpenOtp(false);
									setRegisterUser({
										email: '',
										password: '',
										passwordConfirmation: '',
									});
									setLoginUser({ email: '', password: '' });
									localStorage.removeItem('feathers-jwt');
								}}
							>
								Logout
							</Button>
						</div>
					) : (
						<div>
							<div style={{ ...textStyle, fontSize: 16, padding: '0 20px' }}>
								Already have an account?
							</div>
							<Login
								loginUser={loginUser}
								updateLoginUser={(field, value) =>
									setLoginUser({ ...loginUser, [field]: value })
								}
								authenticate={authenticate}
							/>
							<OtpInput
								open={openOtp}
								setOpen={setOpenOtp}
								authenticate={authenticate}
								user={loginUser}
							/>
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
							<Registration
								registerUser={registerUser}
								updateRegisterUser={(field, value) =>
									setRegisterUser({ ...registerUser, [field]: value })
								}
								authenticate={authenticate}
							/>
						</div>
					)}
				</Paper>
			</div>
		</AppProvider>
	);
}

import React, { useState, useEffect, useContext } from 'react';

import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import Snackbar from '@mui/material/Snackbar';
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

import app from 'STARTER/feathers-client';
import Login from 'STARTER/components/login';
import Registration from 'STARTER/components/registration';
import FormattedMessage from 'STARTER/components/formattedMessage'
import { AuthContext, AuthContextType, authData } from 'STARTER/contexts/auth'

import { isMobile } from 'STARTER/utils';

export default function Home() {
	const [snackBarOpen, setSnackBarOpen] = useState(false);
	const [snackBarMessage, setSnackBarMessage] = useState('');

  const { authenticate, isLoginLoading, isAuthed, logout } = useContext(AuthContext) as AuthContextType

	const handleCloseSnackBar = () => setSnackBarOpen(false);

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
					) : isAuthed ? (
						<div
							style={{ ...textStyle, margin: '60px auto', textAlign: 'center' }}
						>
							Congrats, you're now logged in!
							<Button onClick={logout}>Logout</Button>
						</div>
					) : (
						<div>
							<Typography style={{ fontSize: 16, padding: '0 20px' }}>
                <FormattedMessage id='login.alreadyHaveAccount' defaultMessage='Already have an account?'/>
							</Typography>
							<Login authenticate={authenticate} />
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
	);
}

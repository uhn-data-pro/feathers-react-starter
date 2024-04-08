import React, { useState } from 'react';
import Button from '@mui/material/Button';
import OutlinedInput from '@mui/material/OutlinedInput';
import Modal from '@mui/material/Modal';

export interface otpInput {
	authenticate: (options: any) => Promise<void>;
	user: { email: string; password: string };
	open: boolean;
	setOpen: (open: boolean) => void;
}

export default function OtpInput({ authenticate, user, open, setOpen }) {
	const { email, password } = user;
	const [otp, setOtp] = useState('');

	const modalStyle = {
		position: 'absolute' as 'absolute',
		top: '50%',
		left: '50%',
		transform: 'translate(-50%, -50%)',
		width: 400,
		background: 'white',
		padding: 20,
		borderRadius: 4,
		margin: '40px',
		gap: '20px',
		fontFamily: 'Roboto, Arial, Helvetica, sans-serif',
		fontSize: 22,
		fontWeight: 300,
	};

	const handleClose = (event, reason) => {
		if (reason && reason === 'backdropClick') return;
		setOpen(false);
	};

	return (
		<Modal open={open} onClose={handleClose}>
			<div
				style={{
					...modalStyle,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
				}}
			>
				<div>Enter Verification Code</div>
				<OutlinedInput
					fullWidth
					value={otp}
					inputProps={{ minLength: 6, maxLength: 6 }}
					onChange={(e) => setOtp(e.target.value)}
				/>
				<div
					style={{
						display: 'flex',
						justifyContent: 'right',
						width: '100%',
						gap: 12,
					}}
				>
					<Button onClick={() => setOpen(false)}>Cancel</Button>
					<Button
						variant='contained'
						style={{ width: '35%' }}
						onClick={() => {
							authenticate({ strategy: 'mfa', email, password, otp });
						}}
					>
						Verify
					</Button>
				</div>
			</div>
		</Modal>
	);
}

import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import app from '../feathers-client';

export interface EnableTwoFaProps {
	open: boolean;
	setOpen: (open: boolean) => void;
	email: string;
}
export default function EnableTwoFa({
	open,
	setOpen,
	email,
}: EnableTwoFaProps) {
	const [enabled, setEnabled] = useState(false);
	const [qrCode, setQrCode] = useState('');

	const modalStyle = {
		position: 'absolute' as 'absolute',
		top: '50%',
		left: '50%',
		transform: 'translate(-50%, -50%)',
		width: 400,
		background: 'white',
		padding: 20,
		borderRadius: 4,
	};

	const enable2FA = () => {
		return app
			.service('users')
			.find({
				query: {
					email,
				},
			})
			.then((res) => {
				return app
					.service('users')
					.patch(res.data[0].id, { email, twoFa: true });
			})
			.then((res) => {
				setEnabled(true);
				setQrCode(res.url);
			})
			.catch((err) => console.error(err));
	};

	return (
		<Modal open={open} onClose={() => setOpen(false)}>
			<div
				style={{
					...modalStyle,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					gap: 10,
					fontFamily: 'Roboto',
				}}
			>
				<div
					style={{
						fontSize: 22,
						fontWeight: 500,
					}}
				>
					Enable 2FA
				</div>
				<div
					style={{
						fontSize: 16,
						fontWeight: 300,
						textAlign: 'center',
					}}
				>
					{!enabled
						? 'Enable and set up two-factor authentication to keep your account more secure.'
						: 'Scan this QR code with your Google Authenticator app.'}
				</div>
				{enabled && <img src={qrCode} />}
				{!enabled ? (
					<div
						style={{
							display: 'flex',
							justifyContent: 'right',
							width: '100%',
							gap: 8,
						}}
					>
						<Button onClick={() => setOpen(false)}>Not now</Button>
						<Button variant='contained' onClick={enable2FA}>
							Set Up
						</Button>
					</div>
				) : (
					<Button
						variant='contained'
						color='primary'
						style={{ width: '100%' }}
						onClick={() => setOpen(false)}
					>
						Finish Setup
					</Button>
				)}
			</div>
		</Modal>
	);
}

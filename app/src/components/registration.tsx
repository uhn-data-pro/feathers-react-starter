import Button from "@mui/material/Button"
import Snackbar from "@mui/material/Snackbar"
import TextField from "@mui/material/TextField"
import React, { useState } from "react"

import { registrationService } from "../feathers-client"
import FormattedMessage from "STARTER/components/formattedMessage"
import { translateString } from "STARTER/utils"

export interface RegistrationProps {
  authenticate: (options: any) => Promise<void>
}
export default function Registration({ authenticate }: RegistrationProps) {
  const [newUser, setnewUser] = useState({
    email: "",
    password: "",
    passwordConfirmation: "",
  })
  const [error, setError] = useState("")
  const [snackBarOpen, setSnackBarOpen] = useState(false)
  const [snackBarMessage, setSnackBarMessage] = useState("")

  const passwordMatchErrorString = translateString(
    "register.errors.passwordsMatch",
    "Please make sure your passwords match",
  )
  const registrationErrorString = translateString(
    "register.errors.emailUsed",
    "Sorry, this email has already been used",
  )

  const handleCloseSnackBar = () => setSnackBarOpen(false)

  const handleRegistrationChange = (field: string, value: string) => setnewUser({ ...newUser, [field]: value })

  const handleRegisterUser = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    const { email, password } = newUser

    if (password !== newUser.passwordConfirmation) {
      return setError(passwordMatchErrorString)
    }

    registrationService
      .create({ email, password })
      .then(() => authenticate({ strategy: "local", email, password }))
      .catch(() => {
        setSnackBarOpen(true)
        setSnackBarMessage(registrationErrorString)
      })
  }

  return (
    <div style={{ padding: "0 20px" }}>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        open={snackBarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackBar}
        message={snackBarMessage}
      />
      <TextField
        error={error === "email"}
        fullWidth
        required
        id="email"
        label={translateString("login.email", "Email")}
        margin="normal"
        onChange={(event) => handleRegistrationChange("email", event.target.value)}
        type="email"
        variant="outlined"
        value={newUser.email}
      />
      <TextField
        fullWidth
        required
        id="password"
        label={translateString("login.password", "Password")}
        margin="normal"
        onChange={(event) => handleRegistrationChange("password", event.target.value)}
        type="password"
        variant="outlined"
        value={newUser.password}
      />
      <TextField
        error={!!error}
        fullWidth
        helperText={error}
        required
        id="password-confirmation"
        label={translateString("register.confirmPassword", "Confirm Password")}
        margin="normal"
        onChange={(event) => handleRegistrationChange("passwordConfirmation", event.target.value)}
        type="password"
        variant="outlined"
        value={newUser.passwordConfirmation}
      />
      <div style={{ textAlign: "center", marginBottom: 20, marginTop: 16 }}>
        <Button variant="contained" color="secondary" onClick={handleRegisterUser} style={{ width: "100%" }}>
          <FormattedMessage id="register.signUp" defaultMessage="Sign Up" />
        </Button>
      </div>
    </div>
  )
}

import Button from "@mui/material/Button"
import Paper from "@mui/material/Paper"
import Typography from "@mui/material/Typography"
import React, { useContext } from "react"

import FormattedMessage from "STARTER/components/formattedMessage"
import { AuthContext, AuthContextType } from "STARTER/contexts/auth"
import { isMobile } from "STARTER/utils"

export default function Dashboard() {
  const { logout } = useContext(AuthContext) as AuthContextType

  const onMobile = isMobile()

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        width: "100%",
        overflow: "hidden",
        position: "absolute",
      }}
    >
      <Paper
        elevation={onMobile ? 0 : 3}
        style={{
          padding: onMobile ? 10 : 20,
          position: "relative",
          minHeight: 500,
          ...(onMobile ? { height: "100%", width: "100%", overflow: "scroll" } : { width: 500 }),
        }}
      >
        <Typography>
          <FormattedMessage id="dashboard.loggedIn" defaultMessage="Congrats, you're now logged in!" />
        </Typography>
        <Button onClick={logout}>
          <FormattedMessage id="actions.logout" defaultMessage="Logout" />
        </Button>
      </Paper>
    </div>
  )
}

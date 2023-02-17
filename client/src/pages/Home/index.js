import React from "react";
import { Button, Snackbar, Alert } from "@mui/material";

import "./index.css";

import logo from "../../images/face.png";

function loginButtonClicked() {
  window.location.href = "https://discord.com/api/oauth2/authorize?client_id=1038232661900152912&redirect_uri=http%3A%2F%2Flocalhost%3A7070%2Fauth&response_type=token&scope=identify%20guilds";
}

function Denied() {
  return (
    <div className="info--denied">
      <Snackbar open='true' autoHideDuration={2000}>
        <Alert severity="error" sx={{ width: '100%' }}>
          Login failed, please try again!
        </Alert>
      </Snackbar>
    </div>
  )
}

function Home(props) {
  return (
    <div className="container--general">
      <div className="container--window">
        <center>
          <img src={logo} alt="logo"></img>
          <h1>Aviation Bot Dashboard</h1>

          <Button
            variant="contained"
            color="primary"
            sx={{ marginTop: "20px" }}
            onClick={loginButtonClicked}
          >
            LOGIN WITH DISCORD
          </Button>
        </center>

        {props.response === "denied" ? <Denied /> : null}
      </div>
    </div>
  );
}

export default Home;

import React from "react";
import { useParams } from "react-router-dom";
import { Button, Snackbar, Alert } from "@mui/material";

import "./index.css";

import logo from "../../images/face.png";

function loginButtonClicked() {
  window.location.href = "https://discord.com/api/oauth2/authorize?client_id=1038232661900152912&redirect_uri=http%3A%2F%2Flocalhost%3A7070%2Fresponse%2Fauth&response_type=code&scope=identify%20guilds";
}

function AlertOutput(props) {
  const state = props.state;

  let [open, setOpen] = React.useState(true);
  
  let severity = (state === "denied" ? "error" : "info");
  let info = (severity === "error" ? "Something went wrong, please try again." : "Your session has been closed, please login again.")

  return (
    <div className="info">
      <Snackbar open={open} onClose={() => setOpen(false)} autoHideDuration={5000} anchorOrigin={{vertical: 'top', horizontal: 'center'}}>
        <Alert severity={severity} sx={{ width: '100%' }}>
          {info}
        </Alert>
      </Snackbar>
    </div>
  )
}

function Home() {
  const { state } = useParams();

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

        {state === "denied" ? <AlertOutput state="denied" /> : null}
        {state === "sessionclosed" ? <AlertOutput state="sessionclosed" /> : null}
      </div>
    </div>
  );
}

export default Home;

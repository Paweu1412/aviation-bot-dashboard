require("dotenv").config();
const express = require("express");
const path = require("path");
const app = express();
const axios = require("axios");
const cookieParser = require("cookie-parser");
const uuidv4 = require("uuid").v4;

app.use(express.static(path.join(__dirname, "client/build")));
app.use(cookieParser());

app.listen(7070);

let sessions = [];
let response;

app.get("/response/auth", async (req, res) => {
  const { code } = req.query;
  if (code) {
    try {
      response = await axios.post(
        "https://discord.com/api/oauth2/token",
        {
          client_id: process.env.CLIENT_ID,
          client_secret: process.env.CLIENT_SECRET,
          grant_type: "authorization_code",
          code: code,
          redirect_uri: "http://localhost:7070/response/auth",
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      fetch("https://discord.com/api/users/@me", {
        headers: {
          authorization: `${response.data.token_type} ${response.data.access_token}`,
        },
      })
        .then((res) => res.json())
        .then((response) => {
          const { id } = response;

          const uniqueToken = uuidv4();

          sessions[id] = uniqueToken;

          // setTimeout(() => {
          //   sessions[id] = undefined;
          // }, 60000);

          res.cookie("client_id", id);
          res.cookie("unique_token", uniqueToken);

          res.redirect("/dashboard");
        });
    } catch (err) {
      res.redirect("/response/denied");
    }
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/build/index.html"));
});
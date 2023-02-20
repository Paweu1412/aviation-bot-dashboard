require("dotenv").config();
const express = require("express");
const path = require("path");
const app = express();
const axios = require("axios");
const cookieParser = require("cookie-parser");
const uuidv4 = require("uuid").v4;
const mysql = require("mysql");
const bodyParser = require("body-parser");

app.use(express.static(path.join(__dirname, "client/build")));
app.use(cookieParser());

app.listen(7070);

let sessions = [];
let response;

let databasePool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
});

app.get("/response/language", (req, res) => {
  if (req.query.client_id && req.query.unique_token && req.query.guild_id && req.query.language) {
    if (sessions[req.query.client_id] === req.query.unique_token) {
      databasePool.query('UPDATE `languages` SET `language`=? WHERE `id`=?', [req.query.language, req.query.guild_id], (err, result) => {
        return res.send(true);
      });
    } else {
      return res.send(false);
    }
  }
});

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
          redirect_uri: `http://${process.env.SERVER_IP}:${process.env.SERVER_PORT}/response/auth`,
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      let { token_type, access_token } = response.data;

      fetch("https://discord.com/api/users/@me", {
        headers: {
          authorization: `${response.data.token_type} ${response.data.access_token}`,
        },
      })
        .then((res) => res.json())
        .then((response) => {
          const { id, username, discriminator } = response;

          const uniqueToken = uuidv4();

          sessions[id] = uniqueToken;

          setTimeout(() => {
            sessions[id] = undefined;
          }, 300 * 1000); // 5 minutes

          res.cookie("client_username", username);
          res.cookie("client_discriminator", discriminator);
          res.cookie("client_id", id);
          res.cookie("unique_token", uniqueToken);
          res.cookie("token_type", token_type);
          res.cookie("access_token", access_token);

          res.redirect("/dashboard");
        });
    } catch (err) {
      res.redirect("/response?state=denied");
    }
  }
});

app.get("/response/sessions", (req, res) => {
  if (req.query.client_id && req.query.unique_token) {
    if (sessions[req.query.client_id] === req.query.unique_token) {
      res.send(true);
    } else {
      res.send(false);
    }
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/build/index.html"));
});

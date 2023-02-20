import {
  ImageList,
  ImageListItem,
  ImageListItemBar,
  IconButton,
  ListSubheader,
  Button,
  Snackbar,
  Alert
} from "@mui/material";

import CheckIcon from "@mui/icons-material/Check";

import React from "react";

import axios from 'axios';
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import "./index.css";

function getCookie(key) {
  var b = document.cookie.match("(^|;)\\s*" + key + "\\s*=\\s*([^;]+)");
  return b ? b.pop() : "";
}

function checkSession() {
  axios.get(`/response/sessions`, {
    params: {
      client_id: getCookie("client_id"),
      unique_token: getCookie("unique_token"),
    }
  })
  .then((res) => {
    if (!res.data === true) { window.location.href = "/response?state=session_closed"; }
  });
}

function chooseLanguage() {
  axios.get(`/response/language`, {
    params: {
      client_id: getCookie("client_id"),
      unique_token: getCookie("unique_token"),
      guild_id: getCookie("chosen_guild_id"),
      language: chosenLanguage,
    }
  });
}

let chosenLanguage;

function getString() {
  if (chosenLanguage === "english") { return "Language changed to English."; }
  if (chosenLanguage === "russian") { return "Язык изменен на Русский."; }
  if (chosenLanguage === "ukrainian") { return "Слава Україні, героям слава! Змінено мову на українську."; }
  if (chosenLanguage === "polish") { return "Język zmieniono na Polski."; }
}

export function Settings() {
  const { page } = useParams();

  let [open, setOpen] = React.useState(false);

  if (page === "settings") {
    if (!getCookie("chosen_guild_id") || !getCookie("chosen_guild_name")) { window.location.href = "/dashboard"; }

    checkSession()

    return (
      <div className="container">
        <div className="container--general">
          <center>
            <h1>{getCookie("chosen_guild_name")}</h1>
            <h1>Language selecting</h1>
          </center>

          <div className="container--buttons">
            <Button variant="contained" color="primary" sx={{ marginBottom: '20px' }} onClick={() => { chosenLanguage = "english"; chooseLanguage(); setOpen(true); }}>English</Button>
            <Button variant="contained" color="primary" sx={{ marginBottom: '20px' }} onClick={() => { chosenLanguage = "russian"; chooseLanguage(); setOpen(true); }}>Русский</Button>
            <Button variant="contained" color="primary" sx={{ marginBottom: '20px' }} onClick={() => { chosenLanguage = "ukrainian"; chooseLanguage(); setOpen(true); }}>Українська</Button>
            <Button variant="contained" color="primary" onClick={() => { chosenLanguage = "polish"; chooseLanguage(); setOpen(true); }}>Polski</Button>
          </div>

          <Snackbar open={open} onClose={() => setOpen(false)} autoHideDuration={5000} anchorOrigin={{vertical: 'top', horizontal: 'center'}}>
            <Alert severity="success" sx={{ width: '100%' }}>
              {getString()}
            </Alert>
          </Snackbar>
        </div>
      </div>
    );
  }
}

function Dashboard() {
  let [guildsData, setGuildsData] = useState([]);
  let [visible, setVisible] = useState(false);

  checkSession()

  function getColsNumber() {
    if (guildsData.length === 1) { return 1; }
    if (window.innerWidth > 1000 && guildsData.length >= 3) { return 3; }
    if (window.innerWidth > 650 && guildsData.length >= 2) { return 2; }
    if (window.innerWidth < 650 && guildsData.length >= 1) { return 1; }
  }

  useEffect(() => {
    fetch("https://discord.com/api/users/@me/guilds", {
      headers: {
        authorization: `${getCookie("token_type")} ${getCookie("access_token")}`,
      },
    })
    .then((res) => res.json())
    .then((response) => {
      let guilds = [];

      if (!response.length) { window.location.reload(false); }

      response.forEach(element => {
        if ((element.permissions & 0x8) !== 0x8) { return; }
        
        guilds.push(element);
      });

      setVisible(true);
      setGuildsData(guilds);
    });
  }, []);

  function getGuildAvatar(id, icon) {
    if (icon === null) { return `https://icons.veryicon.com/png/o/miscellaneous/eva-icon-outline/question-mark-outline.png`; }

    return `https://cdn.discordapp.com/icons/${id}/${icon}.webp?size=1024`;
  }

  return (
    <div className="container">
      <div className="container--general">
        <div className="container--imagelist">
          <ImageList cols={getColsNumber()} gap={8}>
            <ImageListItem key="Subheader" cols={getColsNumber()}>
              <ListSubheader component="div" style={{ visibility: visible ? 'visible' : 'hidden', backgroundColor: '#2C74B3' }}>
                <center>
                  <span>{`Hi ${getCookie("client_username")}#${getCookie("client_discriminator")} 👋 Please select a server 🛬`}</span>
                </center>
              </ListSubheader>
            </ImageListItem>

            {guildsData.map((item) => (
              <ImageListItem key={item.id} style={{ backgroundColor: 'rgba(169, 169, 169, 0.9)' }}>
                <center>
                  <img
                    src={getGuildAvatar(item.id, item.icon)}
                    srcSet={getGuildAvatar(item.id, item.icon)}
                    alt={item.name}
                    loading="lazy"
                    style={{ width: "300px", height: "300px" }}
                  />
                </center>

                <ImageListItemBar
                  title={item.name}
                  subtitle={item.id}
                  actionIcon={
                    <IconButton onClick={
                      () => { 
                        document.cookie = `chosen_guild_id=${item.id}`;
                        document.cookie = `chosen_guild_name=${item.name}`;
                        window.location.href = `/dashboard/settings`; 
                      }
                    }
                      sx={{ color: "#FFF" }}
                      aria-label={`set the settings of ${item.title}`}
                    >
                      <CheckIcon />
                    </IconButton>
                  }
                />
              </ImageListItem>
            ))}
          </ImageList>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

import {
  ImageList,
  ImageListItem,
  ImageListItemBar,
  IconButton,
  ListSubheader,
} from "@mui/material";

import CheckIcon from "@mui/icons-material/Check";

import axios from 'axios';
import { useState, useEffect } from "react";

import "./index.css";

function getCookie(key) {
  var b = document.cookie.match("(^|;)\\s*" + key + "\\s*=\\s*([^;]+)");
  return b ? b.pop() : "";
}

function Dashboard() {
  let [guildsData, setGuildsData] = useState([]);
  let [visible, setVisible] = useState(false);

  axios.get(`/response/sessions`, {
    params: {
      client_id: getCookie("client_id"),
      unique_token: getCookie("unique_token"),
    }
  })
  .then((res) => {
    if (!res.data === true) { window.location.href = "/response/sessionclosed"; }
  });

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
                  <IconButton
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
  );
}

export default Dashboard;

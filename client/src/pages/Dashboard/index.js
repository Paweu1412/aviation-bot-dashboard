import axios from 'axios';

import "./index.css";

function getCookie(key) {
  var b = document.cookie.match("(^|;)\\s*" + key + "\\s*=\\s*([^;]+)");
  return b ? b.pop() : "";
}

function Dashboard() {
  axios.get(`/response/sessions`, {
    params: {
      client_id: getCookie("client_id"),
      unique_token: getCookie("unique_token"),
    }
  })
  .then((res) => {
    if (!res.data === true) { window.location.href = "/response/sessionclosed"; }
  });

  return (
    <div className="container--general">
      <h1>Logged in!</h1>
    </div>
  );
}

export default Dashboard;

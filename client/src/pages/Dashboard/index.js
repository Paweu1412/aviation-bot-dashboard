function getCookie(key) {
  var b = document.cookie.match("(^|;)\\s*" + key + "\\s*=\\s*([^;]+)");
  return b ? b.pop() : "";
}

function Dashboard() {
  
  console.log(getCookie("client_id"), getCookie("unique_token"));
}

export default Dashboard;

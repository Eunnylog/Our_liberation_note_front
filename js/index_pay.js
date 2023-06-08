function checkSubscribe2() {
  const isSubscribe = JSON.parse(localStorage.getItem("payload"))['is_subscribe'];

  if (isSubscribe === true) {
    window.location.replace(`${frontend_base_url}/index.html`)
  }
}

checkLogin()
checkSubscribe2()

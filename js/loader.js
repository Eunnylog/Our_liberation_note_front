async function injectNavbar() {
  fetch("/navbar.html").then(response => {
    return response.text()
  })
    .then(data => {
      document.querySelector("header").innerHTML = data;
    })
  let navbarHtml = await fetch("/navbar.html")
  let data = await navbarHtml.text()
  document.querySelector("header").innerHTML = data;

  const payload = localStorage.getItem("payload");
  const cookies = document.cookie.split(';');

  let jwtToken;

  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    const [name, value] = cookie.split('=');

    if (name === "jwt_token") {
      jwtToken = value;
      break;
    }
  }

  if (jwtToken || payload) {
    const userdelete = document.getElementById("userdelete")
    userdelete.innerText = "회원탈퇴"
    const logout = document.getElementById("logout")
    logout.innerText = "로그아웃"
    let loginButton = document.getElementById("login-button")
    loginButton.style.display = "none";
    let signupButton = document.getElementById("signup-button")
    signupButton.style.display = "none";
  }

}
injectNavbar();
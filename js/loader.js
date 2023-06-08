async function injectNavbar(){
  fetch("../navbar.html").then(response => {
      return response.text()
  })
      .then(data => {
          document.querySelector("header").innerHTML = data;
      })
  let navbarHtml = await fetch("../navbar.html")
  let data = await navbarHtml.text()
  document.querySelector("header").innerHTML = data;

  let nav_login = document.getElementById("nav-login")
  let nav_signup = document.getElementById("nav-signup")
  let nav_mydiary = document.getElementById("nav-mydiary")
      nav_mydiary.style.display = "none"
  const payload = localStorage.getItem("payload")

  if(payload){
      nav_login.style.display = "none"
      nav_signup.style.display = "none"
      nav_mydiary.style.display = "block"

      const payload = localStorage.getItem("payload")
      const payload_parse = JSON.parse(payload)
      console.log(payload_parse.username)

      const intro = document.getElementById("intro")

      intro.innerText = `${payload_parse.username} 님 안녕하세요!`


      let navbarRight = document.getElementById("nav-right")
      let newLi = document.createElement("li")
      newLi.setAttribute("class", 'nav-link active')

      newLi.innerText = "로그아웃"
      newLi.setAttribute("onClick", "handleLogout()")



      navbarRight.appendChild(newLi)

  
  }
}
injectNavbar();
async function injectNavbar() {
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
    let nav_mypage = document.getElementById("nav-mypage")
    let nav_makegroup = document.getElementById("nav-makegroup")

    nav_mydiary.style.display = "none"
    nav_mypage.style.display = "none"
    nav_makegroup.style.display = "none"
    const payload = localStorage.getItem("payload")

    if (payload) {
        nav_login.style.display = "none"
        nav_signup.style.display = "none"
        nav_mydiary.style.display = "block"
        nav_mypage.style.display = "block"
        nav_makegroup.style.display = "block"

        const payload = localStorage.getItem("payload")
        const payload_parse = JSON.parse(payload)
        console.log(payload_parse.email)

        const intro = document.getElementById("intro")

        intro.innerText = `${payload_parse.email} 님 안녕하세요!😄`


        let navbarLeft = document.getElementById("nav-left")
        let newLi = document.createElement("li")
        newLi.setAttribute("class", 'nav-item')
        newLi.setAttribute("id", 'nav-logout')

        let newA = document.createElement("a")
        newA.setAttribute("class", "nav-link active")

        newA.innerText = "로그아웃"
        newA.setAttribute("onClick", "handleLogout()")



        newLi.appendChild(newA)
        navbarLeft.appendChild(newLi)


    }
}
injectNavbar();
// 네비게이션 바 함수
async function injectNavbar() {
    // 헤더에 네비게이션 바 넣어주기
    fetch("../navbar.html").then(response => {
        return response.text()
    })
        .then(data => {
            document.querySelector("header").innerHTML = data;
        })
    let navbarHtml = await fetch("../navbar.html")
    let data = await navbarHtml.text()
    document.querySelector("header").innerHTML = data;

    // 필요한 id값 불러오기
    let nav_login = document.getElementById("nav-login")
    let nav_signup = document.getElementById("nav-signup")
    let nav_mydiary = document.getElementById("nav-mydiary")
    let nav_mypage = document.getElementById("nav-mypage")
    let nav_makegroup = document.getElementById("nav-makegroup")
    let nav_trash = document.getElementById("nav-trash")
    let intro = document.getElementById("intro")

    // 로그인 전 갈 수 없는 항목들 숨겨주기
    intro.style.display = "none"
    nav_mydiary.style.display = "none"
    nav_mypage.style.display = "none"
    nav_makegroup.style.display = "none"
    nav_trash.style.display = "none"

    // intro에 이메일을 넣어주기 위해서 payload 불러오기
    let payload = localStorage.getItem("payload")

    // 로그인 후 보여주는 화면
    if (payload) {
        // 회원가입, 로그인 버튼 숨겨주기 
        nav_login.style.display = "none"
        nav_signup.style.display = "none"

        // payload값에서 이메일 불러오기 쉽게 json형식으로 payload 불러오기
        let payload_parse = JSON.parse(payload)

        // payload에서 불러온 email값 넣어주기
        intro.innerText = `Hello~ ${payload_parse.email.split('@')[0]}! 😄`

        // 로그인 전 숨겼던 항목 보여주기
        intro.style.display = "block"
        nav_mydiary.style.display = "block"
        nav_mypage.style.display = "block"
        nav_makegroup.style.display = "block"
        nav_trash.style.display = "block"

        // 로그아웃 만들어주기
        let navbarLeft = document.getElementById("nav-left")
        let newLi = document.createElement("li")
        newLi.setAttribute("class", 'nav-item')
        newLi.setAttribute("id", 'nav-logout')

        let newA = document.createElement("a")
        newA.setAttribute("class", "nav-link active")

        newA.innerText = "Logout"
        newA.setAttribute("onClick", "handleLogout()")
        newA.setAttribute("href", "#")


        // 만든 로그아웃 넣어주기
        newLi.appendChild(newA)
        navbarLeft.appendChild(newLi)


    }
}

injectNavbar();
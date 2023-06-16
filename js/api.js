// 기본 URL
const backend_base_url = "http://127.0.0.1:8000"
const frontend_base_url = "http://127.0.0.1:5500"

let jwtToken;

async function navigateToDetailPage() {
  console.log("테스트")
  // HTML에서 상세 페이지로 이동할 요소를 선택합니다.

  const payloadData = localStorage.getItem("payload")

  if (!payloadData) {
    alert("회원가입 또는 로그인을 해주세요!")
  }

  const payloadObj = JSON.parse(payloadData); // JSON 문자열을 JavaScript 객체로 변환
  const Obj_is_subscribe = payloadObj.is_subscribe;

  console.log(Obj_is_subscribe)
  if (Obj_is_subscribe) {
    alert("이미 구독 중입니다!")

  }
  else {
    window.location.replace(`${frontend_base_url}/window.html`)
  }
}

// 회원 가입
async function handleSignup() {
  const email = document.getElementById("email").value
  const password = document.getElementById("password").value
  const password2 = document.getElementById("password2").value
  const confirmcode = document.getElementById("confirmcode").value

  const response = await fetch(`${backend_base_url}/user/signup/`, {
    headers: {
      'content-type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({
      "email": email,
      "password": password,
      "password2": password2,
      "code": confirmcode
    })
  })
  console.log()

  if (response.status == 201) {
    document.getElementById("signup").querySelector('[data-bs-dismiss="modal"]').click();
    alert("회원가입이 완료되었습니다!")
    window.location.replace(`${frontend_base_url}/index.html`)
  }
  else {

    const response_json = await response.json()

    const regex = /string='([^']+)'/;
    const match = JSON.stringify(response_json).match(regex)

    if (match && match.length > 1) {
      const cleanedString = match[1].replace("string=", "");
      alert("※ " + cleanedString);

    }
  }

}

// 로그인
async function handleSignin() {
  const email = document.getElementById("login-email").value
  const password = document.getElementById("login-password").value

  const response = await fetch(`${backend_base_url}/user/login/`, {
    headers: {
      'content-type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({
      "email": email,
      "password": password,
    })
  })

  if (response.status == 200) {
    const response_json = await response.json()

    // localstorage에 저장하기
    localStorage.setItem('refresh', response_json.refresh)
    localStorage.setItem('access', response_json.access)

    const base64Url = response_json.access.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''))

    localStorage.setItem('payload', jsonPayload)
    document.getElementById("login").querySelector('[data-bs-dismiss="modal"]').click();
    location.reload()
  }
  else {
    alert("※이메일 혹은 비밀번호가 올바르지 않습니다!")
  }
}

// 이메일 인증코드 보내기
async function sendCode() {
  const email = document.getElementById("email").value

  const response = await fetch(`https://api.miyeong.net/user/sendemail/`, {
    headers: {
      'content-type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({
      "email": email,
    })
  })
  alert("인증 코드가 발송 되었습니다! 이메일을 확인해주세요")
}

// 쿠키에 있는 값을 로컬스토리지에 저장
function savePayloadToLocalStorage() {
  const cookies = document.cookie.split(';');

  console.log()

  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    const [name, value] = cookie.split('=');

    if (name === "jwt_token") {
      jwtToken = value;
      break;
    }
  }


  if (jwtToken) {
    const token = jwtToken.replace(/"/g, '').replace(/'/g, '"').replace(/\\054/g, ',')
    const response_json = JSON.parse(token);
    const access_token = response_json.access

    const base64Url = response_json.access.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    localStorage.setItem("access", access_token);
    localStorage.setItem("payload", jsonPayload);
  }
}

function savePayIsSubscribe() {
  const payload = localStorage.getItem("payload");
  const payload_parse = JSON.parse(payload)
  const isSubscribe = payload_parse.is_subscribe

  localStorage.setItem("is_subscribe", isSubscribe);
}

if (localStorage.getItem("social")) {
} else if (location.href.split('=')[1]) {
  // 각 서비스 구분하기 위해 현재 url 변수 할당
  const currentUrl = location.href
  console.log("url", currentUrl)

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const state = location.href.split('=')[2] // 카카오 네이버&구글 구분

  const code = urlParams.get('code'); // 로그인하기 위한 인가 코드
  console.log(code)

  // 값이 있으면 localStorage에 저장
  if (code) {
    if (state) {
      if (currentUrl.includes("google")) {
        console.log("구글", code)
        // 구글은 인코딩된 url 디코딩 후 localStorage에 저장
        const encodeCode = code
        const decodeCode = decodeURIComponent(encodeCode.replace(/\+/g, " "))
        localStorage.setItem('code', decodeCode)
        console.log("디코딩", decodeCode)
        googleLoginApi(decodeCode) // googleLoginApi 함수 호출
      } else {
        console.log("네이버")
        localStorage.setItem('code', code);
        localStorage.setItem('state', state);
        naverLoginApi(code) // naverLoginApi 함수 호출
      }

    } else {
      console.log('카카오:', code);
      localStorage.setItem('code', code);
      kakaoLoginApi(code); // kakaoLoginApi 함수 호출
    }

  } else {
    console.log('인가 코드가 존재하지 않습니다.');
  }

}

if (localStorage.getItem("payload")) {
  if (JSON.parse(localStorage.getItem("payload")).password_expired == true) {
    expired_password_confirm()
  }
}

// 카카오 로그인 페이지로 이동
async function kakaoLogin() {
  console.log("소셜")
  const response = await fetch(`${backend_base_url}/user/social/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ "social": "kakao" }),
  })
  const data_url = await response.json(); // 서버로부터 받은 응답을 JSON 데이터로 파싱합니다.
  const response_url = data_url.url
  window.location.href = response_url
}

// 카카오 로그인 데이터 서버로 전송
async function kakaoLoginApi(code) {
  const response = await fetch(`${backend_base_url}/user/kakao/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ "code": code }),
  })
  response_json = await response.json()
  console.log("response_json", response_json)

  if (response.status === 200) {
    localStorage.setItem("access", response_json.access);
    localStorage.setItem("refresh", response_json.refresh);

    const base64Url = response_json.access.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64).split('').map(function (c) {
        return '%' + (
          '00' + c.charCodeAt(0).toString(16)
        ).slice(-2);
      }).join('')
    );
    localStorage.setItem("payload", jsonPayload);
    // window.location.reload();
    window.location.href = frontend_base_url
  } else {
    alert(response_json['error'])
    window.location.href = frontend_base_url
  }
}

// 구글 로그인 페이지로 이동
async function googleLogin() {
  const response = await fetch(`${backend_base_url}/user/social/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ "social": "google" }),
  })
  const data_url = await response.json(); // 서버로부터 받은 JSON으로 할당
  const response_url = data_url.url
  console.log(response_url)
  window.location.href = response_url
}

// 구글 로그인 데이터 서버로 전송
async function googleLoginApi(decodeCode) {
  const response = await fetch(`${backend_base_url}/user/google/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ "code": decodeCode }),
  })
  response_json = await response.json()
  console.log(response_json)

  console.log("response_json", response_json)
  if (response.status === 200) {
    localStorage.setItem("access", response_json.access);
    localStorage.setItem("refresh", response_json.refresh);

    const base64Url = response_json.access.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64).split('').map(function (c) {
        return '%' + (
          '00' + c.charCodeAt(0).toString(16)
        ).slice(-2);
      }).join('')
    );
    localStorage.setItem("payload", jsonPayload);
    window.location.href = frontend_base_url
  } else {
    alert(response_json['error'])
    window.history.back()
  }
}

// 네이버 로그인 페이지로 이동
async function naverLogin() {
  const response = await fetch(`${backend_base_url}/user/social/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ "social": "naver" }),
  })
  const data_url = await response.json(); // 서버로부터 받은 응답을 JSON으로 할당
  const response_url = data_url.url
  console.log(response_url)
  window.location.href = response_url
}

// 네이버 로그인 데이터 서버로 전송
async function naverLoginApi(Code) {
  const response = await fetch(`${backend_base_url}/user/naver/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ "code": Code }),
  })
  response_json = await response.json()
  console.log(response_json)

  console.log("response_json", response_json)
  if (response.status === 200) {
    localStorage.setItem("access", response_json.access);
    localStorage.setItem("refresh", response_json.refresh);

    const base64Url = response_json.access.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64).split('').map(function (c) {
        return '%' + (
          '00' + c.charCodeAt(0).toString(16)
        ).slice(-2);
      }).join('')
    );
    localStorage.setItem("payload", jsonPayload);
    window.location.href = frontend_base_url
  } else {
    alert(response_json['error'])
    window.history.back()
  }
}

async function facebookLogin() {
  const cookies = document.cookie.split(';');

  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    const [name, value] = cookie.split('=');

    if (name === "jwt_token") {
      jwtToken = value;
      break;
    }
  }

  if (!jwtToken) {
    window.location.replace(`${backend_base_url}/users/facebook/login/`);
  }
}

function handleLogout() {
  const payload = localStorage.getItem("payload");
  const cookies = document.cookie.split(';');

  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    const [name, value] = cookie.split('=');

    if (name === "jwt_token") {
      jwtToken = value;
      break;
    }
  }

  if (jwtToken || payload) {
    localStorage.removeItem("access")
    localStorage.removeItem("refresh")
    localStorage.removeItem("payload")
    localStorage.removeItem("code")
    localStorage.removeItem("state")
    localStorage.removeItem("is_subscribe")
    localStorage.removeItem("is_subscribe")
    document.cookie = "jwt_token=; expires=Thu, 01 Jan 2023 00:00:01 UTC; path=/;";  // 쿠키 삭제
    window.location.replace(`${frontend_base_url}/index.html`)
  }

}

function checkLogin() {
  const payload = localStorage.getItem("payload");

  if (!payload) {
    window.location.replace(`${frontend_base_url}/index.html`)
  }
}


// 회원탈퇴
async function handlesUserDelete() {
  const access_token = localStorage.getItem("access");
  const payload = localStorage.getItem("payload");
  const payload_parse = JSON.parse(payload)

  const response = await fetch(`${backend_base_url}/user/delete/${payload_parse.user_id}/`, {
    headers: {
      "Authorization": `Bearer ${access_token}`
    },
    method: 'DELETE',
  })
  if (response.status == 204) {
    alert("※ 회원탈퇴가 정상적으로 완료되었습니다!")
    localStorage.removeItem("access")
    localStorage.removeItem("refresh")
    localStorage.removeItem("payload")
    localStorage.removeItem("is_subscribe")
    localStorage.removeItem("is_subscribe")
    document.cookie = "jwt_token=; expires=Thu, 01 Jan 2023 00:00:01 UTC; path=/;";  // 쿠키 삭제
    location.reload()
  }
  if (response.status == 403) {
    alert("※ 권한이 없습니다!")
    location.reload()
  }
}

// 로그인&회원가입 오류 메세지
function signUpsignInError() {
  const urlParams = new URLSearchParams(window.location.search);
  const status = urlParams.get('status_code');
  const error = urlParams.get('err_msg');

  if (error === 'error') {
    alert("※ 오류가 발생하였습니다. 다른 소셜 계정으로 다시 시도해주세요!");
  }
  if (error === 'failed_to_get') {
    alert("※ 소셜 인증을 실패하였습니다. 다른 소셜 계정으로 다시 시도해주세요!");
  }
  if (status === '204') {
    alert("※ 연결된 소셜 계정이 없습니다. 일반 로그인으로 시도해주세요!");
  }
  if (status === '400') {
    alert("※ 다른 소셜로 가입된 계정입니다. 다시 로그인해주세요!");
  }
  if (error === 'failed_to_signin') {
    alert("※ 로그인에 실패하였습니다. 다시 시도해주세요!");
  }
  if (error === 'kakao_signup') {
    alert("※ 카카오에서 요청을 거부했습니다. 다른 소셜 계정으로 다시 시도해주세요!");
  }
  if (error === 'google_signup') {
    alert("※ 구글에서 요청을 거부했습니다. 다른 소셜 계정으로 다시 시도해주세요!");
  }
  if (error === 'naver_signup') {
    alert("※ 네이버에서 요청을 거부했습니다. 다른 소셜 계정으로 다시 시도해주세요!");
  }
  if (error === 'github_signup') {
    alert("※ 다른 소셜로 가입된 계정입니다. 다시 로그인해주세요!");
  }
  if (status === '201') {
    alert("※ 회원가입이 완료되었습니다!");
  }
}

signUpsignInError()
savePayloadToLocalStorage()
savePayIsSubscribe()


const getCookieValue = (key) => {
  const cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    const [name, value] = cookie.split('=');

    if (name === "jwt_token") {
      jwtToken = value;
      break;
    }
  }
  return jwtToken
}

// Ai기능사용관련
function checkSubscribe() {
  const isSubscribe = JSON.parse(localStorage.getItem("payload"))['is_subscribe'];

  if (isSubscribe === false) {
    window.location.replace(`${frontend_base_url}/index.html`)
  }
}

function handleAi() {
  const payload = localStorage.getItem("payload");

  if (!payload) {
    alert("※ 🤖AI기능을 사용하시려면 로그인을 해주세요!")
  }

  const isSubscribe = JSON.parse(localStorage.getItem("payload"))['is_subscribe'];

  if (isSubscribe === false) {
    alert("※ 🤖AI기능을 사용하시려면 멤버십 구독을 해주세요!")
  }

  if (isSubscribe === true) {
    window.location.replace(`${frontend_base_url}/aipage.html`)
  }

}

// async function Check_user_data() {
//   // 클라이언트에서 API 요청 보내는 예시 (JavaScript)
//   const access_token = localStorage.getItem("access");

//   const url = `${backend_base_url}/payments/api/subscription/`;  // API 엔드포인트 URL

//   fetch(url, {
//     method: 'GET',
//     headers: {
//       "Authorization-Token": `${access_token}`   // 액세스 토큰 값 설정
//     },
//   })

//     .then(response => response.json())
//     .then(data => {
//       // 서버로부터 받은 데이터 처리
//       const subscription = data;
//       console.log(subscription)
//     })
//     .catch(error => {
//       // 에러 처리
//     });
// }


// Check_user_data();


// 그룹 만들기 모달
// 작성 취소
function cancel() {
  window.location.href = `${frontend_base_url}/index.html`;
}
// 그룹 생성
function addGroup() {
  alert("그룹이 저장되었습니다.")
}
// 멤버 추가
function addMember() {
  alert("멤버가 추가되었습니다.")
}
// 닉네임 추가
function addNickname() {
  alert("닉네임이 추가되었습니다!")
}

// 마이페이지 유저프로필
async function getUserprofile() {
  let token = localStorage.getItem("access")
  const payload = localStorage.getItem("payload");
  const payload_parse = JSON.parse(payload)

  const response = await fetch(`${backend_base_url}/user/my-page/${payload_parse.user_id}/`, {
    headers: {
      "Authorization": `Bearer ${token}`
    },
    method: 'GET'
  })

  if (response.status == 200) {
    const response_json = await response.json()

    return response_json
  } else {
    alert("불러오는데 실패했습니다")
  }

}


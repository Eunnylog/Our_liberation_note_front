// 기본 URL
// const backend_base_url = "https://api.liberation-note.com"
// const frontend_base_url = "https://liberation-note.com"
const backend_base_url = "http://127.0.0.1:8000"
const frontend_base_url = "http://127.0.0.1:5500"


let jwtToken;

// 회원 가입
async function handleSignup() {
  const email = document.getElementById("email").value
  const password = document.getElementById("password").value
  const password2 = document.getElementById("password2").value
  const confirmcode = document.getElementById("confirmcode").value

  let emailBox = document.getElementById("email");
  let passwordBox = document.getElementById("password");
  let password2Box = document.getElementById("password2");
  let confirmcodeBox = document.getElementById("confirmcode");
  let emptyField = false

  if (!email) {
    emailBox.classList.add("custom-class")
    emptyField = true
  } else {
    emailBox.classList.remove("custom-class")
  }

  if (!password || !password2) {
    passwordBox.classList.add("custom-class")
    password2Box.classList.add("custom-class")
    emptyField = true
  } else {
    passwordBox.classList.remove("custom-class")
    password2Box.classList.remove("custom-class")
  }

  if (!confirmcode) {
    confirmcodeBox.classList.add("custom-class")
    emptyField = true
  } else {
    confirmcodeBox.classList.remove("custom-class")
  }

  if (emptyField) {
    showToast("빈칸을 입력해주세요.")
    return
  }


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

  if (response.status == 201) {
    showToast("가입 완료! 그룹이 생성 되었습니다!")
    setTimeout(async () => {
      // 2초 후 회원가입 후 로그인 함수 호출
      await handleSignin(email, password);
    }, 1000);
  } else {
    const errorResponse = await response.json();

    const message = errorResponse.message;
    if (message) {
      showToast("※ " + message);

      // 클래스 초기화
      emailBox.classList.remove("custom-class");
      passwordBox.classList.remove("custom-class");
      password2Box.classList.remove("custom-class");
      confirmcodeBox.classList.remove("custom-class");

      // custom-class 추가
      switch (message) {
        case "이메일이 이미 존재합니다.":
          emailBox.classList.add("custom-class");
          break;
        case "해당 메일로 보낸 인증 코드가 없습니다.":
          confirmcodeBox.classList.add("custom-class");
          break;
        case "인증 코드 유효 기간이 지났습니다.":
          confirmcodeBox.classList.add("custom-class");
          break;
        case "인증 코드가 유효하지 않습니다.":
          confirmcodeBox.classList.add("custom-class");
          break;
        case "비밀번호와 비밀번호 확인이 일치하지 않습니다.":
          passwordBox.classList.add("custom-class");
          password2Box.classList.add("custom-class");
          break;
        case "8자 이상의 영문 대/소문자, 숫자, 특수문자 조합이어야 합니다!":
          passwordBox.classList.add("custom-class");
          password2Box.classList.add("custom-class");
      }
    }
  }
}

let currentSignupTimer // 현재 실행 중인 타이머 추적

// 회원 가입 타이머
async function signupTimer() {
  const Timer = document.getElementById('signupTimer'); // 스코어 기록창-분
  let time = 300000;
  let min = 5;
  let sec = 0;

  Timer.value = min + ":" + '00';

  // 실행중인 타이머가 있는 경우에는 중지
  if (currentSignupTimer) {
    clearInterval(currentSignupTimer);
  }

  function TIMER() {
    currentSignupTimer = setInterval(function () {
      time = time - 1000; // 1초씩 줄어듦
      min = Math.floor(time / (60 * 1000)); // 초를 분으로 나눠준다
      sec = Math.floor((time % (60 * 1000)) / 1000); // 분을 제외한 나머지 초 계산

      if (sec === 0 && min === 0) {
        clearInterval(currentSignupTimer); // 00:00이 되면 타이머를 중지
      }

      Timer.value = min.toString().padStart(2, '0') + ':' + sec.toString().padStart(2, '0'); // 2자리 숫자로 표시

    }, 1000); // 1초마다
  }

  TIMER();
}

$(document).ready(function () {
  $('#signup').on('hide.bs.modal', function () {
    // 모달창 닫힐 때 타이머 종료
    clearInterval(currentSignupTimer);
    $('#signupTimer').val("")

    $('#email').val("");
    $('#password').val("");
    $('#password2').val("");
    $('#confirmcode').val("");
    $('.custom-class').removeClass('custom-class');
  });
});

// 로그인
async function handleSignin(email = null, password = null) {
  if (!email || !password) {
    email = document.getElementById("login-email").value;
    password = document.getElementById("login-password").value;
  }

  let emailBox = document.getElementById("login-email")
  let passwordBox = document.getElementById("login-password")
  let emptyField = false

  if (!email) {
    showToast("아이디를 입력해주세요.")
    emailBox.classList.add("custom-class")
    emptyField = true
  } else {
    emailBox.classList.remove("custom-class")
  }

  if (!password) {
    showToast("비밀번호를 입력해주세요.")
    passwordBox.classList.add("custom-class")
    emptyField = true
  } else {
    passwordBox.classList.remove("custom-class")
  }

  if (emptyField) {
    showToast("빈칸을 입력해주세요.")
    return
  }

  try {
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
      showToast("로그인 완료!");
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
      window.location.href = '/index.html'
    }
    else {
      showToast("※이메일 혹은 비밀번호가 올바르지 않습니다!")
    }
  }
  catch (error) {
    console.log(error)
  }
}

$(document).ready(function () {
  $('#login').on('hide.bs.modal', function () {
    $('#login-email').val("");
    $('#login-password').val("");
    $('.custom-class').removeClass('custom-class');
  });
});

// 회원가입 이메일 인증코드 보내기
async function sendCode() {
  const email = document.getElementById("email").value
  const emailBox = document.getElementById("email")
  const codeBox = document.getElementById("confirmcode")

  emailBox.classList.remove("custom-class")
  codeBox.classList.remove("custom-class")

  codeBox.value = ""
  if (!email) {
    showToast('이메일을 입력하세요!')
    emailBox.classList.add("custom-class")
    return
  } else {
    emailBox.classList.remove("custom-class")
  }

  var loading = document.getElementById('loading');

  try {

    // 로딩창 표시
    loading.style.display = 'block';

    const response = await fetch(`${backend_base_url}/user/sendemail/`, {
      headers: {
        "content-type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        email: email,
      }),
    });

    const data = await response.json()

    if (response.ok) {
      showToast("인증 코드가 발송 되었습니다! 이메일을 확인해주세요");
      signupTimer();
    } else if (data.message) {
      showToast(data.message)
      emailBox.classList.add("custom-class")
    } else {
      throw new Error("이메일 발송에 실패했습니다.");
    }

  } catch (error) {
    showToast(error.message);
  } finally {
    // 로딩창 숨김
    loading.style.display = 'none';
  }

}

if (localStorage.getItem("social")) {
} else if (location.href.split('=')[1]) {  // 로그인 정보가 url에 있는 경우
  // 각 서비스 구분하기 위해 현재 url 변수 할당
  const currentUrl = location.href

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const state = location.href.split('=')[2] // 카카오 네이버&구글 구분

  const code = urlParams.get('code'); // 로그인하기 위한 인가 코드

  // 인가코드가 있으면 localStorage에 저장
  if (code) {
    if (state) {
      if (currentUrl.includes("google")) {
        // 구글은 인코딩된 url 디코딩 후 localStorage에 저장
        const encodeCode = code
        const decodeCode = decodeURIComponent(encodeCode.replace(/\+/g, " "))
        localStorage.setItem('code', decodeCode)
        googleLoginApi(decodeCode) // googleLoginApi 함수 호출
      } else {
        localStorage.setItem('code', code);
        localStorage.setItem('state', state);
        naverLoginApi(code) // naverLoginApi 함수 호출
      }

    } else {
      localStorage.setItem('code', code);
      kakaoLoginApi(code); // kakaoLoginApi 함수 호출
    }

  }

}

if (localStorage.getItem("payload")) {
  if (JSON.parse(localStorage.getItem("payload")).password_expired == true) {
    expired_password_confirm()
  }
}

// 카카오 로그인 페이지로 이동
async function kakaoLogin() {
  const response = await fetch(`${backend_base_url}/user/social/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ "social": "kakao" }),
  })
  const data_url = await response.json();
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

  if (response.status === 200) {
    showToast("로그인 완료!");
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
    showToast(response_json['error'])
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

  if (response.status === 200) {
    showToast("로그인 완료!");
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
    showToast(response_json['error'])
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

  if (response.status === 200) {
    showToast("로그인 완료!");
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
    showToast(response_json['error'])
    window.history.back()
  }
}

// 로그아웃
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
    localStorage.removeItem("noteName")
    localStorage.removeItem("trashCount")
    window.location.replace(`${frontend_base_url}/index.html`)
  }

}

function checkLogin() {
  const payload = localStorage.getItem("payload");

  if (!payload) {
    alert('로그인 또는 회원가입이 필요합니다!')
    window.location.replace(`${frontend_base_url}/index.html?sign=0`)
  }
}

$(document).ready(function () {
  if (window.location == `${frontend_base_url}/index.html?sign=0`) {
    $('#login').modal('show');
  }
})

// 회원탈퇴
async function handlesUserDelete() {
  const access_token = localStorage.getItem("access");
  const payload = localStorage.getItem("payload");
  const payload_parse = JSON.parse(payload)

  const response = await fetch(`${backend_base_url}/user/`, {
    headers: {
      "Authorization": `Bearer ${access_token}`
    },
    method: 'DELETE',
  })
  if (response.status == 204) {
    showToast("※ 회원탈퇴가 정상적으로 완료되었습니다!")
    localStorage.removeItem("access")
    localStorage.removeItem("refresh")
    localStorage.removeItem("payload")
    localStorage.removeItem("is_subscribe")
    localStorage.removeItem("noteName")
    localStorage.removeItem("trashCount")
    localStorage.removeItem("code")
    localStorage.removeItem("state")
    location.reload()
  }
  if (response.status == 403) {
    showToast("※ 권한이 없습니다!")
    location.reload()
  }
}

// 로그인&회원가입 오류 메세지
function signUpsignInError() {
  const urlParams = new URLSearchParams(window.location.search);
  const status = urlParams.get('status_code');
  const error = urlParams.get('err_msg');

  if (error === 'error') {
    showToast("※ 오류가 발생하였습니다. 다른 소셜 계정으로 다시 시도해주세요!");
  }
  if (error === 'failed_to_get') {
    showToast("※ 소셜 인증을 실패하였습니다. 다른 소셜 계정으로 다시 시도해주세요!");
  }
  if (status === '204') {
    showToast("※ 연결된 소셜 계정이 없습니다. 일반 로그인으로 시도해주세요!");
  }
  if (status === '400') {
    showToast("※ 다른 소셜로 가입된 계정입니다. 다시 로그인해주세요!");
  }
  if (error === 'failed_to_signin') {
    showToast("※ 로그인에 실패하였습니다. 다시 시도해주세요!");
  }
  if (error === 'kakao_signup') {
    showToast("※ 카카오에서 요청을 거부했습니다. 다른 소셜 계정으로 다시 시도해주세요!");
  }
  if (error === 'google_signup') {
    showToast("※ 구글에서 요청을 거부했습니다. 다른 소셜 계정으로 다시 시도해주세요!");
  }
  if (error === 'naver_signup') {
    showToast("※ 네이버에서 요청을 거부했습니다. 다른 소셜 계정으로 다시 시도해주세요!");
  }
  if (error === 'github_signup') {
    showToast("※ 다른 소셜로 가입된 계정입니다. 다시 로그인해주세요!");
  }
  if (status === '201') {
    showToast("※ 회원가입이 완료되었습니다!");
  }
}

signUpsignInError()

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

  const isSubscribe = JSON.parse(localStorage.getItem("payload"))['is_subscribe'];

  if (isSubscribe === false) {
    showToast("※ 🤖AI기능을 사용하시려면 멤버십 구독을 해주세요!")
  }

  if (isSubscribe === true) {
    window.location.replace(`${frontend_base_url}/aipage.html`)
  }

}

// 비밀번호 변경 페이지 가기 전 소셜 로그인 체크
function checkSocialLogin() {
  const code = localStorage.getItem('code');

  if (code) {
    showToast("소셜 로그인은 비밀번호를 변경할 수 없습니다");
    location.reload();
    return;
  }
}

// 비밀번호 변경 모달창이 뜨면 소셜계정인지 일반 계정인지 체크
function changePasswordAndOpenModal() {
  checkSocialLogin(); // checkSocialLogin() 함수 실행
  $('#updatePassword').modal('show'); // 모달 창 열기
}

// 비밀번호 변경
async function updatePassword() {
  const access_token = localStorage.getItem("access")

  const updateData = {
    check_password: document.querySelector("#check_password").value,
    new_password: document.querySelector("#update_password").value,
    check_new_password: document.querySelector("#check_update_password").value,
  }

  let currentPasswordBox = document.getElementById("check_password")
  let newPasswordBox = document.getElementById("update_password")
  let checkNewPasswordBox = document.getElementById("check_update_password")
  let emptyField = false

  if (!updateData.check_password) {
    currentPasswordBox.classList.add("custom-class")
    emptyField = true
  } else {
    currentPasswordBox.classList.remove("custom-class")
  }

  if (!updateData.new_password) {
    newPasswordBox.classList.add("custom-class")
    emptyField = true
  } else {
    newPasswordBox.classList.remove("custom-class")
  }

  if (!updateData.check_new_password) {
    checkNewPasswordBox.classList.add("custom-class")
    emptyField = true
  } else {
    checkNewPasswordBox.classList.remove("custom-class")
  }

  if (emptyField) {
    showToast("빈칸을 입력해주세요.")
    return
  }

  const response = await fetch(`${backend_base_url}/user/`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "Bearer " + access_token,
    },
    method: 'PATCH',
    body: JSON.stringify(updateData)
  }
  )
  const data = await response.json()
  if (response.status == 200) {
    showToast("회원정보 수정 완료!! 다시 로그인을 진행해 주세요!")
    localStorage.removeItem("access")
    localStorage.removeItem("refresh")
    localStorage.removeItem("payload")
    location.replace(`${frontend_base_url}/index.html`)
  } else {
    showToast(data["message"])
  }

}

$(document).ready(function () {
  $('#updatePassword').on('hide.bs.modal', function () {
    $('#check_password').val("");
    $('#update_password').val("");
    $('#check_update_password').val("");
    $('.custom-class').removeClass('custom-class');
  });
});

// 작성 취소
function cancel() {
  window.location.href = `${frontend_base_url}/index.html`;
}

// 저장 전 선택한 이메일을 저장할 배열
let selectedEmails = [];

function showSearchEmailInfo() {
  const searchEmailInfo = document.getElementById('search-email-info')

  if ($("#email-ul").children().length === 0) {
    searchEmailInfo.style.display = "block";
  } else {
    searchEmailInfo.style.display = "none";
  }
}

// 멤버 추가
async function addMember() {
  const access_token = localStorage.getItem("access")
  const membersEmail = document.getElementById("usersearch").value
  const membersEmailInput = document.getElementById("usersearch")

  membersEmailInput.classList.remove("custom-class");

  if (!membersEmail) {
    showToast("이메일을 입력해주세요!")
    membersEmailInput.classList.add("custom-class")
    return
  }

  const url = `${backend_base_url}/user/userlist?usersearch=${membersEmail}`

  axios.get(url).then(response => {
    const emails = response.data.map(item => item.email);

    if (emails.length == 0) {
      showToast('검색 결과가 없습니다!')
    }

    // 검색 결과가 없을 경우 알림창으로 표시

    if (response.data.length === 0) {
      showToast('검색 결과가 없습니다!')
    }

    var email = document.getElementById("email-ul");
    email.innerHTML = "";

    // 검색 결과 처리
    emails.forEach((useremail, index) => {
      let temp_html = `
          <li style="list-style-type: none; margin-bottom: 20px; display: flex; justify-content: space-between;" >
            ${useremail}
            <input type="checkbox" id="email_${index}" name="email_radio" value="${index}">
            <label for="email_${index}"></label>
          </li>
        `;
      email.innerHTML += temp_html;
    });
    showSearchEmailInfo()
  })
    .catch(error => {
      // 에러 처리
      showToast('문제가 발생했습니다!')
    });
}

function showNoEmailInfo() {
  const noEmailInfo = document.getElementById('no-email-info');

  if ($('#selected-email-ul').children().length === 0) {
    noEmailInfo.style.display = "block";
  } else {
    noEmailInfo.style.display = "none";
  }
}

$(document).ready(function () {
  $('#makegroup').on('hide.bs.modal', function () {
    // 모달 창을 닫을 때 입력 값 다 지우기
    $('#usersearch').val("");
    $('#groupname').val("");
    $("#selected-email-list").empty();
    $("#email-ul").empty();
    $('input[type=checkbox]').prop('checked', false);
    $('.custom-class').removeClass('custom-class');
    selectedEmails = [];
  });
});



function cancleGroupMake() {
  $('#email-list').empty()
  let temp_html2 = `<ul id="email-ul" style="position: relative; right: 10px;"></ul>
  <div id="search-email-info"> 검색한 이메일이 이곳에 보여집니다!</div>`
  $('#email-list').append(temp_html2)
  $('#selected-email-list').empty()
  let temp_html = `<ul id="selected-email-ul" style="position: relative; right: 10px;">
  </ul>
  <div id="no-email-info"> 이메일을 추가하지 않으면 본인만 구성원으로 등록됩니다!</div>
  `
  $('#selected-email-list').append(temp_html)
  selectedEmails = [];

}

let groupIndex = 0;

// 멤버 추가 버튼 클릭 시 이메일 리스트에 추가
function addMembersToGroup() {
  const checkedInputs = document.querySelectorAll('input[name="email_radio"]:checked');

  if (checkedInputs.length === 0) {
    showToast("선택된 이메일이 없습니다.");
    return;
  }

  checkedInputs.forEach((checkedInput) => {
    const selectedEmail = checkedInput.previousSibling.textContent.trim(); // 선택된 이메일 텍스트 가져오기

    if (!selectedEmails.includes(selectedEmail)) {
      selectedEmails.push(selectedEmail);

      // 선택된 이메일을 ul에 추가
      const selectedEmailUl = document.getElementById("selected-email-ul");
      const newEmailLi = document.createElement("li");
      newEmailLi.style = "list-style-type: none; margin-bottom: 20px; display: flex; justify-content: space-between;";

      // input 태그 추가
      const newInput = document.createElement("input");
      newInput.type = "checkbox";
      newInput.name = "checked_email_radio";
      newInput.id = "add" + groupIndex;

      // label 태그 추가
      const newLabel = document.createElement("label");
      newLabel.htmlFor = "add" + groupIndex;

      newEmailLi.appendChild(document.createTextNode(selectedEmail));
      selectedEmailUl.appendChild(newEmailLi);
      newEmailLi.appendChild(newInput);
      newEmailLi.appendChild(newLabel);

      groupIndex++; // 다음 인풋에 할당할 고유한 id 값 증가
    } else {
      showToast("이미 추가된 이메일입니다.");
    }
  });

  $('input[type=checkbox]').prop('checked', false);
  showNoEmailInfo();
}



// function addMembersToGroup() {
//   // 선택한 input 요소의 value 속성을 배열에 push
//   const checkedInput = document.querySelector('input[name="email_radio"]:checked');

//   if (checkedInput) {

//     const selectedEmail = checkedInput.previousSibling.textContent.trim(); // 선택된 이메일 텍스트 가져오기


//     // 이미 추가된 이메일인지 확인
//     const alreadyAdded = selectedEmails.includes(selectedEmail);


//     if (!alreadyAdded) {
//       selectedEmails.push(selectedEmail);

//       // 선택된 이메일을 ul에 추가
//       const selectedEmailUl = document.getElementById("selected-email-ul");
//       const newEmailLi = document.createElement("li");
//       newEmailLi.style = "list-style-type: none; margin-bottom: 20px; display: flex; justify-content: space-between;"

//       // input 태그 추가
//       const newInput = document.createElement("input");
//       newInput.type = "checkbox";
//       newInput.name = "checked_email_radio";
//       newInput.id = "add" + groupIndex

//       // label 태그 추가
//       const newLabel = document.createElement("label")
//       newLabel.htmlFor = "add" + groupIndex

//       newEmailLi.appendChild(document.createTextNode(selectedEmail));
//       selectedEmailUl.appendChild(newEmailLi);
//       newEmailLi.appendChild(newInput);
//       newEmailLi.appendChild(newLabel);

//       groupIndex++; // 다음 인풋에 할당할 고유한 id 값 증가
//     }
//     else {
//       showToast("이미 추가된 이메일입니다.");
//     }

//   } else {
//     showToast("선택된 이메일이 없습니다.")
//   }
//   $('input[type=checkbox]').prop('checked', false);
//   showNoEmailInfo();
// }

// 버튼 클릭 시 선택한 이메일 리스트에서 삭제
// function DeleteMembers() {
//   const checkedRadios = document.querySelectorAll('input[name="checked_email_radio"]:checked');

//   if (checkedRadios.length === 0) {
//     showToast("선택된 이메일이 없습니다.");
//     return;
//   }

//   checkedRadios.forEach((checkedRadio) => {
//     const selectedEmail = checkedRadio.previousSibling.textContent.trim();
//     const emailIndex = selectedEmails.indexOf(selectedEmail); // 추가된 이메일 목록에서 인덱스 찾기

//     if (emailIndex > -1) {
//       selectedEmails.splice(emailIndex, 1); // 선택된 이메일 삭제
//       checkedRadio.closest("li").remove();
//     } else {
//       showToast("선택된 이메일이 추가된 이메일 목록에 없습니다.");
//     }
//   });

//   $('input[type=checkbox]').prop('checked', false);
//   showNoEmailInfo();
// }



function DeleteMembers() {
  // 선택된 라디오 버튼의 객체 가져오기
  const checkedRadio = document.querySelector('input[name="checked_email_radio"]:checked');

  // 선택된 라디오 버튼이 있는 경우
  if (checkedRadio) {
    const selectedEmail = checkedRadio.previousSibling.textContent.trim();
    const emailIndex = selectedEmails.indexOf(selectedEmail); // 추가된 이메일 목록에서 인덱스 찾기

    // 목록에서 선택된 이메일이 있는 경우
    if (emailIndex > -1) {
      selectedEmails.splice(emailIndex, 1); // 선택된 이메일 삭제
      checkedRadio.closest("li").remove();
    } else {
      showToast("선택된 이메일이 추가된 이메일 목록에 없습니다.");
    }
  } else {
    showToast("선택된 이메일이 없습니다.");
  }
  $('input[type=checkbox]').prop('checked', false);
  showNoEmailInfo();
}

// input 글자수 제한 알림
function checkLength(input) {
  const maxLength = input.getAttribute("maxlength");
  if (input.value.length >= maxLength) {
    showToast(`최대 글자수가 초과되었습니다! (${maxLength}자 이내로 작성해주세요)`);
    input.classList.add("custom-class"); // custom-class 추가
  } else {
    input.classList.remove("custom-class"); // custom-class 제거 (선택사항)
  }
}

// 그룹 생성
async function addGroup() {
  const access_token = localStorage.getItem("access");
  const groupNameInput = document.getElementById("groupname");
  const groupName = document.getElementById("groupname").value;
  const membersList = document.getElementById("selected-email-ul");

  if (!groupName) {

    showToast('그룹 이름을 적어주세요')
    groupNameInput.classList.add("custom-class");
    return false;
  }

  const membersEmails = Array.from(membersList.getElementsByTagName("li")).map(li => li.textContent);

  // 멤버 id 저장용 빈 배열 준비
  const memberIdList = [];

  // 멤버 이메일을 반복하면서 각각 서버로 전송하여 멤버 객체를 받아옴
  for (const memberEmail of membersEmails) {
    // 특수문자가 올바르게 전송되도록 보장하기 위해 인코딩한 후 쿼리 매개변수로 전달
    const membersResponse = await fetch(`${backend_base_url}/user/userlist?usersearch=${encodeURIComponent(memberEmail)}`);
    const membersData = await membersResponse.json();

    // 해당 멤버의 id를 리스트에 추가
    const memberId = membersData[0].id;
    memberIdList.push(memberId);
  }

  const requestData = {
    name: groupName,
    members: memberIdList
  };

  const response = await fetch(`${backend_base_url}/user/group/`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "Bearer " + access_token,
    },
    method: 'POST',
    body: JSON.stringify(requestData)
  });

  if (response.status == 201) {
    showToast("그룹이 저장되었습니다.");
    window.location.reload()
  } else {
    const data = await response.json();
    if (data.message) {
      showToast("※ " + data.message);
    } else if (data["non_field_errors"]) {
      showToast("※ " + data["non_field_errors"])
    } else if (data.error) {
      showToast("※ " + data.error)
    } else if (data['name'][0]) {
      showToast("※제한 글자수는 2~15자 입니다!")
    }
  }
}
// 마이페이지 유저프로필
async function getUserprofile() {
  let token = localStorage.getItem("access")
  const payload = localStorage.getItem("payload");
  const payload_parse = JSON.parse(payload)

  const response = await fetch(`${backend_base_url}/user/my-page/`, {
    headers: {
      "Authorization": `Bearer ${token}`
    },
    method: 'GET'
  })

  if (response.status == 200) {
    const response_json = await response.json()

    return response_json
  } else {
    const data = await response.json();
    if (data.message) {
      showToast("※ " + data.message);
    }
  }
}

let currentFindPasswordTimer  // 비밀번호 발급 타이머 추적

// 비밀번호 발급 타이머
async function findPasswordTimer() {
  const Timer = document.getElementById('findPasswordTimer');
  let time = 300000;
  let min = 5;
  let sec = 0;

  Timer.value = min + ":" + '00';

  // 실행되고 있는 타이머 정지
  if (currentFindPasswordTimer) {
    clearInterval(currentFindPasswordTimer)
  }

  function TIMER() {
    currentFindPasswordTimer = setInterval(function () {
      time = time - 1000; // 1초씩 줄어듦
      min = Math.floor(time / (60 * 1000)); // 초를 분으로 나눠준다.
      sec = Math.floor((time % (60 * 1000)) / 1000); // 분을 제외한 나머지 초 계산

      if (sec === 0 && min === 0) {
        clearInterval(currentFindPasswordTimer); // 00:00이 되면 타이머를 중지한다.
      }

      Timer.value = min.toString().padStart(2, '0') + ':' + sec.toString().padStart(2, '0'); // 2자리 숫자로 표시

    }, 1000); // 1초마다
  }

  TIMER();
}

// 비밀번호 재발급 인증코드 보내기
async function sendVerificationEmail() {
  const email = document.getElementById("sendEmail").value
  const emailBox = document.getElementById("sendEmail")
  const codeBox = document.getElementById("confirm-code")

  codeBox.value = ""

  if (!email) {
    showToast('이메일을 입력해주세요!')
    emailBox.classList.add("custom-class")
    return
  }

  if (email) {
    emailBox.classList.remove("custom-class")
  }

  var loading = document.getElementById('loading');

  try {

    // 로딩창 표시
    loading.style.display = 'block';

    const response = await fetch(`${backend_base_url}/user/sendemail/`, {
      headers: {
        'content-type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        "email": email,
      })
    })

    if (response.ok) {
      showToast("인증 코드가 발송 되었습니다! 이메일을 확인해주세요");
      findPasswordTimer()
    } else {
      throw new Error("이메일 발송에 실패했습니다.");
    }
  } catch (error) {
    showToast(error.message);
  } finally {
    // 로딩창 숨김
    loading.style.display = 'none';
  }
}

// 비밀번호 분실 새 비밀번호 발급
async function ChangePassword() {

  let changeData = {
    email: document.querySelector("#sendEmail").value,
    code: document.querySelector("#confirm-code").value,
    new_password: document.querySelector("#change_password").value,
    check_password: document.querySelector("#check_change_password").value,
  }

  let emailBox = document.querySelector("#sendEmail")
  let codeBox = document.querySelector("#confirm-code")
  let new_password_box = document.querySelector("#change_password")
  let check_password_box = document.querySelector("#check_change_password")
  let emptyField = false

  if (!changeData.email) {
    emailBox.classList.add("custom-class")
    emptyField = true
  } else {
    emailBox.classList.remove("custom-class")
  }

  if (!changeData.code) {
    codeBox.classList.add("custom-class")
    emptyField = true
  } else {
    codeBox.classList.remove("custom-class")
  }

  if (!changeData.new_password) {
    new_password_box.classList.add("custom-class")
    emptyField = true
  } else {
    new_password_box.classList.remove("custom-class")
  }

  if (!changeData.check_password) {
    check_password_box.classList.add("custom-class")
    emptyField = true
  } else {
    check_password_box.classList.remove("custom-class")
  }

  if (emptyField) {
    showToast("빈칸을 입력해주세요.")
    return
  }

  const response = await fetch(`${backend_base_url}/user/changepassword/`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(changeData)
  }
  )

  if (response.status == 200) {
    showToast("비밀번호 변경 완료!")
    location.replace(`${frontend_base_url}/index.html`)
  } else {
    const data = await response.json();

    // 기본 메시지 초기화
    let message = "";

    // 경우에 따라 메시지 및 custom-class 업데이트
    switch (data.message) {
      case "비밀번호 찾기를 위한 이메일이 일치하지 않습니다.":
        emailBox.classList.add("custom-class");
        message = data.message;
        break;
      case "해당 메일로 보낸 인증 코드가 없습니다.":
        codeBox.classList.add("custom-class");
        message = data.message;
      case "인증 코드 유효 기간이 지났습니다.":
        codeBox.classList.add("custom-class");
        message = data.message;
        break;
      case "이메일 확인 코드가 유효하지 않습니다.":
        codeBox.classList.add("custom-class");
        message = data.message;
        break;
      case "비밀번호와 비밀번호 확인이 일치하지 않습니다.":
        new_password_box.classList.add("custom-class");
        check_password_box.classList.add("custom-class");
        message = data.message;
        break;
      case "8자 이상의 영문 대/소문자, 숫자, 특수문자 조합이어야 합니다!":
        new_password_box.classList.add("custom-class");
        check_password_box.classList.add("custom-class");
        message = data.message;
        break;
    }

    if (message) {
      showToast("※ " + message);
    }
  }
}

$(document).ready(function () {
  $('#findPassword').on('hide.bs.modal', function () {
    // 모달창 닫힐 때 타이머 종료
    clearInterval(currentFindPasswordTimer);
    $('#findPasswordTimer').val("");

    $('#sendEmail').val("");
    $('#confirm-code').val("");
    $('#change_password').val("");
    $('#check_change_password').val("");
    $('.custom-class').removeClass('custom-class');
  });
});

async function checkGroup() {
  params = new URLSearchParams(window.location.search);
  note_id = params.get("note_id");
  const response = await fetch(`${backend_base_url}/note/note-detail/${note_id}`, {
    headers: {
      'Content-Type': 'application/json',
      "Authorization": `Bearer ${access_token}`
    },
    method: 'GET',
  });
  if (response.status == 403) {
    alert('접근 권한이 없습니다!')
    window.location.href = '/index.html'
  }
}

//토스트//
let removeToast;

function showToast(string) {
  const toast = document.getElementById("toast");

  toast.classList.contains("reveal") ?
    (clearTimeout(removeToast), removeToast = setTimeout(function () {
      document.getElementById("toast").classList.remove("reveal")
    }, 1000)) :
    removeToast = setTimeout(function () {
      document.getElementById("toast").classList.remove("reveal")
    }, 1000)
  toast.classList.add("reveal"),
    toast.innerText = string
}


// 코드 실행 막기 함수
function checkCode(str) {
  var div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

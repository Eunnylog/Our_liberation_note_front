// 기본 URL
// const backend_base_url = "https://api.liberation-note.com"
const backend_base_url = "http://127.0.0.1:8000"
const frontend_base_url = "http://127.0.0.1:5500"



let jwtToken;


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

  if (response.status == 201) {
    document.getElementById("signup").querySelector('[data-bs-dismiss="modal"]').click();
    alert("회원가입이 완료되었습니다!")
    window.location.replace(`${frontend_base_url}/index.html`)
  }
  else {
    const errorResponse = await response.json();
    console.log('error', errorResponse)
    if (errorResponse.message) {
      alert("※ " + errorResponse.message);
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


// 로그인
async function handleSignin() {
  const email = document.getElementById("login-email").value
  const password = document.getElementById("login-password").value

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
      console.log(response)
    }
  }
  catch (error) {
    console.log(error)
  }
}

// 회원가입 이메일 인증코드 보내기
async function sendCode() {
  const email = document.getElementById("email").value

  if (!email) {
    alert('이메일을 입력하세요!')
    return
  }

  const response = await fetch(`${backend_base_url}/user/sendemail/`, {
    headers: {
      'content-type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({
      "email": email,
    })
  })
  alert("인증 코드가 발송 되었습니다! 이메일을 확인해주세요")
  signupTimer()
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
    window.location.replace(`${frontend_base_url}/index.html`)
  }
}


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
    alert("※ 회원탈퇴가 정상적으로 완료되었습니다!")
    localStorage.removeItem("access")
    localStorage.removeItem("refresh")
    localStorage.removeItem("payload")
    localStorage.removeItem("is_subscribe")
    localStorage.removeItem("noteName")
    localStorage.removeItem("trashCount")
    document.cookie = "jwt_token=; expires=Thu, 01 Jan 2023 00:00:01 UTC; path=/;";  // 쿠키 삭제
    localStorage.removeItem("code")
    localStorage.removeItem("state")
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
    alert("※ 🤖AI기능을 사용하시려면 멤버십 구독을 해주세요!")
  }

  if (isSubscribe === true) {
    window.location.replace(`${frontend_base_url}/aipage.html`)
  }

}

// 비밀번호 변경 페이지 가기 전 소셜 로그인 체크
function checkSocialLogin() {
  const code = localStorage.getItem('code');

  if (code) {
    alert("소셜 로그인은 비밀번호를 변경할 수 없습니다");
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

  if (!updateData.check_password || !updateData.new_password) {
    alert("빈칸을 입력해주세요.")
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
    alert("회원정보 수정 완료!! 다시 로그인을 진행해 주세요!")
    localStorage.removeItem("access")
    localStorage.removeItem("refresh")
    localStorage.removeItem("payload")
    location.replace(`${frontend_base_url}/index.html`)


  } else {
    alert(data["message"])
  }

}

// 작성 취소
function cancel() {
  window.location.href = `${frontend_base_url}/index.html`;
}

// 저장 전 선택한 이메일을 저장할 배열
let selectedEmails = [];

// 라디오 버튼 클릭 함수
function handleRadioClick() {
  let selectedRadio = document.querySelector('input[name="email_radio"]:checked')

  // 선택된 라디오 버튼이 있는 경우
  if (selectedRadio) {
    let selectedIndex = selectedRadio.value;
    let selected_email = document.getElementById(`email_${selectedIndex}`).value

    document.getElementById("usersearch").value = selected_email
  } else {
    alert("선택된 이메일이 없습니다.");
  }
}

// 멤버 추가
async function addMember() {
  const access_token = localStorage.getItem("access")
  const membersEmail = document.getElementById("usersearch").value

  if (!membersEmail) {
    alert("이메일을 입력해주세요!")
    return
  }

  const url = `${backend_base_url}/user/userlist?usersearch=${membersEmail}`

  axios.get(url).then(response => {
    const emails = response.data.map(item => item.email);

    var email = document.getElementById("email-ul");
    email.innerHTML = "";

    // 검색 결과 처리
    emails.forEach((useremail, index) => {
      let temp_html = `
          <li style="list-style-type: none; margin-bottom: 10px;">
            ${useremail}
            <input type="radio" id="email_${index}" name="email_radio" value="${index}" onclick="handleRadioClick()">
          </li>
        `;
      email.innerHTML += temp_html;
    });
  })
    .catch(error => {
      // 에러 처리
      alert('문제가 발생했습니다!')
    });
}

$(document).ready(function () {
  $('#makegroup').on('hide.bs.modal', function () {
    // 모달 창을 닫을 때 입력 값 다 지우기
    $('#usersearch').val("");
    $('#groupname').val("");
    $("#selected-email-list").empty();
    $('input[type=radio]').prop('checked', false);
  });
});


// 멤버 추가 버튼 클릭 시 이메일 리스트에 추가
function addMembersToGroup() {
  // 선택한 input 요소의 value 속성을 배열에 push
  const checkedInput = document.querySelector('input[name="email_radio"]:checked');

  if (checkedInput) {

    const selectedEmail = checkedInput.previousSibling.textContent.trim(); // 선택된 이메일 텍스트 가져오기

    // 이미 추가된 이메일인지 확인
    const alreadyAdded = selectedEmails.includes(selectedEmail);

    if (!alreadyAdded) {
      selectedEmails.push(selectedEmail);

      // 선택된 이메일을 ul에 추가
      const selectedEmailUl = document.getElementById("selected-email-ul");
      const newEmailLi = document.createElement("li");
      newEmailLi.style = "list-style-type: none; margin-bottom: 10px;"

      // input 태그 추가
      const newInput = document.createElement("input");
      newInput.type = "radio";
      newInput.name = "checked_email_radio";

      newEmailLi.appendChild(document.createTextNode(selectedEmail));
      selectedEmailUl.appendChild(newEmailLi);
      newEmailLi.appendChild(newInput);
    }
    else {
      alert("이미 추가된 이메일입니다.");
    }

  } else {
    alert("선택된 이메일이 없습니다.")
  }
  $('input[type=radio]').prop('checked', false);
}

// 버튼 클릭 시 선택한 이메일 리스트에서 삭제
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
      alert("선택된 이메일이 추가된 이메일 목록에 없습니다.");
    }
  } else {
    alert("선택된 이메일이 없습니다.");
  }
  $('input[type=radio]').prop('checked', false);
}

// 그룹 생성
async function addGroup() {
  const access_token = localStorage.getItem("access");
  const groupName = document.getElementById("groupname").value;
  const membersList = document.getElementById("selected-email-ul");

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

  if (!groupName) {
    alert('그룹 이름을 적어주세요')
    return;
  }

  if (response.status == 201) {
    alert("그룹이 저장되었습니다.");
    window.location.reload()
  } else {
    const data = await response.json();
    if (data.message) {
      alert("※ " + data.message);
    } else if (data["non_field_errors"]) {
      alert("※ " + data["non_field_errors"])
    } else if (data.error) {
      alert("※ " + data.error)
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
      alert("※ " + data.message);
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

  if (!email) {
    alert('이메일을 입력해주세요!')
    return
  }

  const response = await fetch(`${backend_base_url}/user/sendemail/`, {
    headers: {
      'content-type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({
      "email": email,
    })
  })
  alert("인증 코드가 발송 되었습니다! 이메일을 확인해주세요")
  findPasswordTimer()
}

// 비밀번호 분실 새 비밀번호 발급
async function ChangePassword() {

  const changeData = {
    email: document.querySelector("#sendEmail").value,
    code: document.querySelector("#confirm-code").value,
    new_password: document.querySelector("#change_password").value,
    check_password: document.querySelector("#check_change_password").value,
  }

  if (!changeData.code || !changeData.new_password) {
    alert("빈칸을 입력해주세요.")
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
    alert("비밀번호 변경 완료!")
    location.replace(`${frontend_base_url}/index.html`)
  } else {
    const data = await response.json();
    if (data.message) {
      alert("※ " + data.message);
    }
  }
}

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
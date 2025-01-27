checkLogin()

const urlParams = new URLSearchParams(window.location.search);
const orderId = urlParams.get('orderId');
const amount = urlParams.get('amount');
const paymentKey = urlParams.get('paymentKey');
// 쿠키에서 액세스 JWT 토큰 가져오기
const access_token = localStorage.getItem("access");
const note_id = localStorage.getItem("note_id");

const url = `${backend_base_url}/payments/success`;
const secretKey = "test_ck_5mBZ1gQ4YVXkllX4eX23l2KPoqNb";
const userpass = secretKey + ':';
const encodedU = window.btoa(userpass);


const headers = {
  "Authorization": "Basic " + encodedU,
  "Content-Type": "application/json",
  "Authorization-Token": `${access_token}`  // 액세스 토큰 값 설정
};



fetch(url + `?orderId=${orderId}&paymentKey=${paymentKey}&amount=${amount}&note_id=${note_id}`, {
  method: 'GET',
  headers: headers,
})
  .then(response => response.json())
  .then(data => {// 응답 결과 처리

    $('#payments-info').empty();
    const suppliedAmount = data.suppliedAmount;
    const vat = data.vat;
    const totalAmount = data.totalAmount;
    const orderName = data.orderName
    const userName = data.user;
    const startDate = new Date(data.start_subscribe_at);
    const start_subscribe_at = startDate.toISOString().split('T')[0];
    const endDate = new Date(data.end_date);
    const end_date = endDate.toISOString().split('T')[0];
    const duration = data.duration;

    let temp_html = `
                  <p class="content">주문자 : ${userName}</p>
                  <p class="content">이용권 : ${orderName} - ${duration}일</p>
                  <p class="content">결제 금액 : ${totalAmount}</p>
                  <p class="content">부가세 : ${vat}</p>
                  <p class="content">부가세 제외 결제 금액 : ${suppliedAmount}</p>
                  <p class="content">구독시작일 : ${start_subscribe_at}</p>
                  <p class="content">구독종료일 : ${end_date}</p>
                  `
    $('#payments-info').append(temp_html)

    localStorage.setItem("is_subscribe", "true")
    showToast('3초 후에 메인페이지로 이동합니다')
    setTimeout(function () {
      window.location.replace(`${frontend_base_url}/index.html`)
    }, 3000);
  })
  .catch(error => {
    // 에러 처리
    console.error(error);
    // window.location.replace(`${frontend_base_url}/fail.html`)
  });
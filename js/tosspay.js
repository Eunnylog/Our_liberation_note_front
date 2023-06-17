/* // {% comment %} ================================= API KEY 세팅 ================================== {% endcomment %} */
let clientKey = 'test_ck_5mBZ1gQ4YVXkllX4eX23l2KPoqNb'; // [TODO] https://developers.tosspayments.com 로그인 후 API Key발급 가능
let tossPayments = TossPayments(clientKey);


// {/* // {% comment %} ================================= 결제데이터 ==================================
//   //   각 파라미터별 세부 내용은 다음 링크 참고 https://docs.tosspayments.com/reference/js-sdk {% endcomment %} */}
let paymentData = ["공통", "카드", "가상계좌", "계좌이체", "휴대폰", "문화상품권", "도서상품권", "게임문화상품권", "토스페이"];
let path = "/";
let successUrl = `https://miyeong.net/success.html`;
let failUrl = `https://miyeong.net/fail.html`;


paymentData["공통"] = {
  "amount": "",
  "orderId": "",
  "orderName": "",
  "customerName": "",
  "customerEmail": null,
  "customerMobilePhone": null,
  "successUrl": successUrl,
  "failUrl": failUrl,
  "windowTarget": "iframe",
  "taxFreeAmount": null,
  "cultureExpense": false,
  "vat": "",
  "suppliedAmount": ""
}

paymentData["카드"] = {
  "cardCompany": null,
  "cardInstallmentPlan": null,
  "maxCardInstallmentPlan": null,
  "freeInstallmentPlans": null,
  "useCardPoint": false,
  "useAppCardOnly": false,
  "useInternationalCardOnly": false,
  "flowMode": "DEFAULT",
  "easyPay": null,
  "discountCode": null,
  "appScheme": null
}

paymentData["가상계좌"] = {
  "validHours": 72,
  "cashReceipt": {
    "type": "소득공제"
  },
  "useEscrow": false,
  "escrowProducts": null,
  "currency": "KRW"
}

paymentData["계좌이체"] = {
  "cashReceipt": {
    "type": "소득공제"
  },
  "useEscrow": false,
  "escrowProducts": null
}

paymentData["휴대폰"] = {
  "mobileCarrier": null // [NOTE] 테스트 환경에서 동작 X
}

// 체크박스  value값 변경
function applySubscribe(event) {
  const checkbox = event.target;
  const amount = checkbox.dataset.amount;
  const name = checkbox.dataset.name;
  const paymentAmountElement = document.querySelector("#amount");
  const SubscribeNameElement = document.querySelector("#orderName");

  if (checkbox.checked) {
    const checkbox2 = document.querySelector('.checkbox2');
    const checkbox1 = document.querySelector('.checkbox1');
    if (paymentAmountElement.value && checkbox !== checkbox2) {
      checkbox2.checked = false; // 체크박스 2 해제
    }
    if (paymentAmountElement.value && checkbox !== checkbox1) {
      checkbox1.checked = false; // 체크박스 1 해제
    }
    paymentAmountElement.value = amount;
    SubscribeNameElement.value = name;
  } else {
    paymentAmountElement.value = ""; // 체크가 해제되면 금액란을 비움
    SubscribeNameElement.value = "";
  }
}
document.querySelector("#basic").addEventListener("click", applySubscribe)
document.querySelector("#premium").addEventListener("click", applySubscribe)

// 구매자 정보로 value 값 변경
const payloadData = localStorage.getItem("payload")
const payloadObj = JSON.parse(payloadData); // JSON 문자열을 JavaScript 객체로 변환
const Objemail = payloadObj.email;

const CustomerNameElement = document.querySelector("#customerName");
CustomerNameElement.value = Objemail;


// {% comment %} ================== '결제' Btn Event ================== {% endcomment %}
document.getElementById("requestPayment").addEventListener('click', function () {
  let paymentType = document.getElementById("paymentType").value;
  let requestJson = initPaymentsData("공통", paymentType);

  tossPayments.requestPayment(paymentType, requestJson)
    .catch(function (error) {
      // 응답 처리 (https://docs.tosspayments.com/reference/js-sdk#응답-처리)
      if (error.code === 'USER_CANCEL') {
        alert("결제를 취소하였습니다");
        // 결제 고객이 결제창을 닫았을 때 에러 처리
      } else if (error.code === 'INVALID_CARD_COMPANY') {
        // 유효하지 않은 카드 코드에 대한 에러 처리
        alert("유효하지 않습니다");
      }
    })
})

// {% comment %} ================== 페이지 로딩시 실행 ================== {% endcomment %}
document.addEventListener("DOMContentLoaded", function () {
  makeOrderId("UniqueOrderID");
});

// {% comment %} ================= 주문번호(OrderID) 자동생성 ===================  {% endcomment %}
function makeOrderId(prefix) {
  let x = Math.floor(Math.random() * 100000000);
  document.getElementById("orderId").value = prefix + x;
}

// {% comment %} =============[공통] + [결제수단] JSON DATA 합치기 ================= {% endcomment %}
function initPaymentsData(general, paymentType) {
  paymentData[general].amount = document.getElementById("amount").value;
  paymentData[general].orderId = document.getElementById("orderId").value;
  paymentData[general].orderName = document.getElementById("orderName").value;
  paymentData[general].customerName = document.getElementById("customerName").value;

  return Object.assign(paymentData[general], paymentData[paymentType]);
}
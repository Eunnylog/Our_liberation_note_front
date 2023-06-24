checkLogin()
// lifephoto_page

// input에 들어간 파일을 사진 넣기 버튼을 눌렀을때 넣어주는 함수
function formFile() {
  // input으로 들어간 파일의 주소 가져오기
  let selectFile1 = document.querySelector("#formFile1").files[0];
  let selectFile2 = document.querySelector("#formFile2").files[0];
  let selectFile3 = document.querySelector("#formFile3").files[0];
  let selectFile4 = document.querySelector("#formFile4").files[0];

  console.log(selectFile1, selectFile2, selectFile3, selectFile4);

  if (selectFile1 == undefined || selectFile2 == undefined || selectFile3 == undefined || selectFile4 == undefined) {
    showToast("이미지를 네장 다 넣고 사진넣기를 눌러주세요!")
  } else {
    // 받아온 정보를 파일에 넣어주기
    const file1 = URL.createObjectURL(selectFile1);
    const file2 = URL.createObjectURL(selectFile2);
    const file3 = URL.createObjectURL(selectFile3);
    const file4 = URL.createObjectURL(selectFile4);

    // document.querySelector(".photo-frame").src.empty()

    // 정보가 담긴 파일을 지정한 장소에 넣어주기
    // 양쪽이 같은 파일을 보여주게 파일 하나를 두개 아이디에 각각 넣어줌
    // 파일1 
    document.querySelector("#image1").src = file1;
    document.querySelector("#image5").src = file1;

    // 파일2
    document.querySelector("#image2").src = file2;
    document.querySelector("#image6").src = file2;

    // 파일3
    document.querySelector("#image3").src = file3;
    document.querySelector("#image7").src = file3;

    // 파일4
    document.querySelector("#image4").src = file4;
    document.querySelector("#image8").src = file4;

    // input 값 초기화
    let formFile1 = document.querySelector("#formFile1")
    let formFile2 = document.querySelector("#formFile2")
    let formFile3 = document.querySelector("#formFile3")
    let formFile4 = document.querySelector("#formFile4")

    formFile1.value = null;
    formFile2.value = null;
    formFile3.value = null;
    formFile4.value = null;
  }
}

// 해방필름 사전 png로 저장하는 로직
function PrintDiv(div) {
  div = div[0];
  html2canvas(div).then(function (canvas) {
    let myFilm = canvas.toDataURL();
    downloadURL(myFilm, "liberation-film.png");
  });
}

function downloadURL(uri, name) {
  let link = document.createElement("a");
  link.download = name;
  link.href = uri;
  document.body.appendChild(link);
  link.click()
}

// 시간 지연 함수 사용한 파일 다운로드 함수
function saveButton(category) {
  // input으로 들어간 파일의 주소 가져오기
  if (category == 1) {
    let selectFile1 = document.querySelector("#formFile1").files[0];
    let selectFile2 = document.querySelector("#formFile2").files[0];
    let selectFile3 = document.querySelector("#formFile3").files[0];
    let selectFile4 = document.querySelector("#formFile4").files[0];
    if (selectFile1 == undefined || selectFile2 == undefined || selectFile3 == undefined || selectFile4 == undefined) {
      showToast("이미지를 네장 다 넣고 사진넣기를 눌러주세요!")
      return false
    }
  } else {
    let selectFile1_2 = document.querySelector("#inputFile1").files[0];
    let selectFile2_2 = document.querySelector("#inputFile2").files[0];
    let selectFile3_2 = document.querySelector("#inputFile3").files[0];
    let selectFile4_2 = document.querySelector("#inputFile4").files[0];

    if (selectFile1_2 == undefined || selectFile2_2 == undefined || selectFile3_2 == undefined || selectFile4_2 == undefined) {
      showToast("이미지를 네장 다 넣고 사진넣기를 눌러주세요!")
      return false
    }
  }


  let loading = document.getElementById("loading");

  // 로딩창 표시
  loading.style.display = "block";

  // 시간지연 함수로 파일 다운로드 진행
  setTimeout(function () {
    PrintDiv($('#photo-container'));

    // 파일 다운로드 완료되면 로딩참 숨김
    loading.style.display = "none"
  }, 3000);
}

// 취소 함수, 취소 버튼을 누르면 페이지를 다시 로드함
function cancle() {
  location.reload()
}

// lifephoto_page_ver2

// input에 들어간 파일을 사진 넣기 버튼을 눌렀을때 넣어주는 함수
function inputFile() {
  // input으로 들어간 파일의 주소 가져오기
  let selectFile1 = document.querySelector("#inputFile1").files[0];
  let selectFile2 = document.querySelector("#inputFile2").files[0];
  let selectFile3 = document.querySelector("#inputFile3").files[0];
  let selectFile4 = document.querySelector("#inputFile4").files[0];

  console.log(selectFile1, selectFile2, selectFile3, selectFile4);

  if (selectFile1 == undefined || selectFile2 == undefined || selectFile3 == undefined || selectFile4 == undefined) {
    showToast("이미지를 네장 다 넣고 사진넣기를 눌러주세요!")
  } else {
    // 받아온 정보를 파일에 넣어주기
    const file1 = URL.createObjectURL(selectFile1);
    const file2 = URL.createObjectURL(selectFile2);
    const file3 = URL.createObjectURL(selectFile3);
    const file4 = URL.createObjectURL(selectFile4);

    // 정보가 담긴 파일을 지정한 장소에 넣어주기
    // 파일1 
    document.querySelector("#lifephoto1").src = file1;

    // 파일2
    document.querySelector("#lifephoto2").src = file2;

    // 파일3
    document.querySelector("#lifephoto3").src = file3;

    // 파일4
    document.querySelector("#lifephoto4").src = file4;

    // input 값 초기화
    let inputFile1 = document.querySelector("#inputFile1")
    let inputFile2 = document.querySelector("#inputFile2")
    let inputFile3 = document.querySelector("#inputFile3")
    let inputFile4 = document.querySelector("#inputFile4")

    inputFile1.value = null;
    inputFile2.value = null;
    inputFile3.value = null;
    inputFile4.value = null;
  }
}

// 페이지 이동을 위한 함수
window.onload = function () {
  // 이전 페이지 처럼 되돌아 가기 위해 들어운 노트의 아이디를 불러옴
  params = new URLSearchParams(window.location.search);
  note_id = params.get("note_id");

  // 페이지 이동을 위해 각 버튼들의 필요한 id값을 불러옴
  var aiLink = document.getElementById('goAIpage');
  var photoLink = document.getElementById('goPhotopage');
  var planPage = document.getElementById('goPlanpage');
  var lifephotoPage = document.getElementById('goLifephoto')
  var lifephotoPage2 = document.getElementById('goLifephoto2')

  // 버튼을 클릭했을때 페이지 이동시켜줌
  aiLink.onclick = function () {
    location.href = '/ai.html?note_id=' + note_id;
  }
  photoLink.onclick = function () {
    location.href = '/photo_page.html?note_id=' + note_id;
  }
  planPage.onclick = function () {
    location.href = '/plan_page.html?note_id=' + note_id;
  }
  lifephotoPage.onclick = function () {
    location.href = '/lifephoto_page.html?note_id=' + note_id;
  }
  lifephotoPage2.onclick = function () {
    location.href = '/lifephoto_page_ver2.html?note_id=' + note_id;
  }
};

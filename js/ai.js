// let back_url = 'https://api.liberation-note.com'
// const front_url = "https://liberation-note.com"
let front_url = 'http://127.0.0.1:5500'
let back_url = 'http://127.0.0.1:8000'
let access_token = localStorage.getItem('access')
let ai_feed_li = [];



window.onload = function () {
  params = new URLSearchParams(window.location.search);
  note_id = params.get("note_id");

  var back = document.getElementById('back');
  var testText = document.getElementById('testText');

  if (note_id != 3) {
    checkGroup()
    checkLogin()
    back.onclick = function () {
      location.href = `/plan_page.html?note_id=${note_id}`;
    }
    testText.style.display = 'none';
  } else {
    back.innerText = '메인페이지로 이동'
    back.onclick = function () {
      location.href = `/index.html`;
    }
    setTimeout(function () {
      showToast('여행 루트 짜주는 AI 예시 입니다!')
    }, 1000);
  }
};

function aiSubscribeCheck() {
  params = new URLSearchParams(window.location.search);
  note_id = params.get("note_id");

  const is_subscribe = localStorage.getItem("is_subscribe")
  if (note_id != 3) {
    if (is_subscribe == 'true') {
      return true
    }
    else {
      var userConfirmation = confirm("구독권 결제가 필요합니다! 결제창으로 이동할까요?");

      if (!userConfirmation) {
        return false
      }
      window.location.replace(`${frontend_base_url}/window.html`)
    }
  }
}

async function showStartSelect() {
  params = new URLSearchParams(window.location.search);
  note_id = params.get("note_id");
  const response = await fetch(`${backend_base_url}/note/plan/${note_id}`, {
    headers: {
      'content-type': 'application/json',
      // "Authorization": `${access_token}`,
    },
    method: 'GET',
  })
  const response_json = await response.json()



  let startSet = new Set();

  response_json.forEach((a, index) => {
    let start = a['start']

    if (!startSet.has(start)) {  // start 값이 Set에 없는 경우에만 추가합니다.
      let temp_html = `<option value="${start}">${start}</option>`;
      $('#select_start').append(temp_html);
      startSet.add(start);  // start 값을 Set에 추가합니다.
    }

    // 첫번째 그룹 노트 리스트 보여주기
    if (index === 0) {
      document.getElementById("select_start").value = start
    }

    ai_feed_li.push(a)
  });
  showAiFeed()

  $('#checkAll').on('change', function () {
    const checkboxes = $('#ai_feed_box input[type=checkbox]').not('#checkAll2');
    if ($(this).prop('checked')) {
      if (checkboxes.length > 0) {
        checkboxes.prop('checked', true);
      } else {
        $(this).prop('checked', false); // "전체 선택" 체크 해제
        showToast('선택할 항목이 없습니다.'); // 한글 알림 메시지 표시
      }
    } else {
      checkboxes.prop('checked', false);
    }
  });

  $('#checkAll2').on('change', function () {
    const checkboxes = $('#ai_work_box input[type=checkbox]').not('#checkAll');
    if ($(this).prop('checked')) {
      if (checkboxes.length > 0) {
        checkboxes.prop('checked', true);
      } else {
        $(this).prop('checked', false); // "전체 선택" 체크 해제
        showToast('선택할 항목이 없습니다.'); // 한글 알림 메시지 표시
      }
    } else {
      checkboxes.prop('checked', false);
    }
  });
}

showStartSelect()

function showAiFeed() {
  const start_select = document.getElementById("select_start").value

  $('#ai_feed_box').empty()

  ai_feed_li.forEach(function (a) {
    if (a['location'] && a['location'] != '주소가 없으면 ai 사용이 어렵습니다!' && a['start'] == start_select) {
      if (a['category'] == '') {
        a['category'] = '기타'
      }
      let temp_html = `
                      <div>
                        <div name="${a['id']}" style="display: flex; justify-content: space-between;">
                          <div>
                            <h5 id='title' style="font-size:20px ">목적지 : ${a['title']}</h5>
                            <h5 id='category' style="font-size:18px ">카테고리 : ${a['category']}</h5>
                            <h5 name='start' value='${a['start']}' style="font-size:18px ">날짜 : ${a['start']}</h5>
                            <h5 id='location' style="font-size:17px">주소 : ${a['location']}</h5>
                            <h5 id='location_x' hidden>${a['location_x']}</h5>
                            <h5 id='location_y' hidden>${a['location_y']}</h5>
                          </div>
                          <div>
                            <input type="checkbox" value='${a['start']}' id="check${a['id']}"><label for="check${a['id']}"></label>
                          </div>
                        </div>
                        <hr>
                      </div>
                    `
      $('#ai_feed_box').append(temp_html)
    }
  })
}

function saveAiFeed() {
  const selItems = $('#ai_feed_box input[type=checkbox]:checked').not('#checkAll');
  const existItems = $('#ai_work_box').children().length;
  const availSpace = 10 - existItems;

  if (selItems.length === 0) {
    showToast('선택한 요소가 없습니다!');
    return;
  }

  if (availSpace <= 0) {
    showToast('이미 10개의 아이템이 있습니다. 더 이상 추가할 수 없습니다!');
    return;
  }

  selItems.each(function (idx) {
    // If adding this item will exceed 10 items, stop adding.
    if (idx >= availSpace) {
      showToast('최대 10개의 항목만 추가 가능합니다!');
      // Remaining items and 'Select All' checkbox should be unchecked
      selItems.slice(idx).prop('checked', false);
      $('#checkAll').prop('checked', false);
      return false; // Stop .each loop
    }

    let checkedDiv = $(this).parent().parent().parent();
    $('#ai_work_box').append(checkedDiv);

    // 체크 표시 해제
    $(this).prop('checked', false);
  });

  // 왼쪽 영역의 checkAll2 체크박스의 체크 해제
  $('#checkAll2').prop('checked', false);

  // 전체 선택 체크 여부 갱신
  updateCheckAllStatus();
}


function deleteAiFeed() {
  if ($('#ai_work_box input[type=checkbox]:checked').not('#checkAll2').length === 0) {
    showToast('선택한 요소가 없습니다!');
    return;
  }

  $('#ai_work_box input[type=checkbox]:checked').not('#checkAll2').each(function () {
    let checkedDiv = $(this).parent().parent().parent();
    const start_select = document.getElementById("select_start").value
    let start = checkedDiv.find("[name='start']").text().split(':')[1].trim();

    if (start_select == start) {
      $('#ai_feed_box').append(checkedDiv);
    } else {
      checkedDiv.remove();
    }

    // 체크 표시 해제
    $(this).prop('checked', false);
  });

  // 오른쪽 영역의 checkAll2 체크박스의 체크 해제
  $('#checkAll2').prop('checked', false);

  // 전체 선택 체크 여부 갱신
  updateCheckAllStatus();
}


function updateCheckAllStatus() {
  const btnElement = document.getElementById('ai_start_btn');
  if (btnElement.innerText == '결과보기') {
    btnElement.innerText = 'AI 일 하기';
    btnElement.setAttribute("onClick", `aiStart()`)
    btnElement.setAttribute("data-bs-toggle", ``)
    btnElement.setAttribute("data-bs-target", ``)
  }

  const totalLeft = $('#ai_feed_box input[type=checkbox]').not('#checkAll').length;
  const checkedLeft = $('#ai_feed_box input[type=checkbox]:checked').not('#checkAll').length;

  const totalRight = $('#ai_work_box input[type=checkbox]').not('#checkAll2').length;
  const checkedRight = $('#ai_work_box input[type=checkbox]:checked').not('#checkAll2').length;

  // 왼쪽 영역의 전체 선택 체크 여부 갱신
  if (totalLeft === checkedLeft && checkedLeft > 0) {
    $('#checkAll').prop('checked', true);
  } else {
    $('#checkAll').prop('checked', false);
  }

  // 오른쪽 영역의 전체 선택 체크 여부 갱신
  if (totalRight === checkedRight && checkedRight > 0) {
    $('#checkAll2').prop('checked', true);
  } else {
    $('#checkAll2').prop('checked', false);
  }
}


async function aiStart() {
  let is_subscribe = aiSubscribeCheck();
  params = new URLSearchParams(window.location.search);
  note_id = params.get("note_id");

  if (!is_subscribe && note_id != 3) {
    return false;
  }

  let total;

  let destinations = [];
  $('#ai_work_box input[type=checkbox]:checked').not('#checkAll2').each(function () {
    let checkedDiv = $(this).closest('div[name]');
    let title = checkedDiv.find('#title').text().split(':')[1].trim();
    let category = checkedDiv.find('#category').text().split(':')[1].trim();
    let location = checkedDiv.find('#location').text().split(':')[1].trim();
    let location_x = checkedDiv.find('#location_x').text();
    let location_y = checkedDiv.find('#location_y').text();
    let destination = {
      category: category,
      title: title,
      location: location,
      x: location_x,
      y: location_y
    };


    if (!location_x && !location_y) {

    } else {
      destinations.push(destination);
    }
    total += 1
  });

  if (destinations.length != total) {
    showToast('주소지가 정확하지 않은 곳은 제외 됩니다!')
  }

  if (destinations.length == 0 && total == destinations.length) {
    showToast('먹이를 추가해주세요!');
    return false;
  } else if (destinations.length == 0 && total != destinations.length) {
    showToast('주소지가 정확한 먹이를 추가해주세요!')
    return false;
  }

  try {
    // 로딩창 표시
    var loading = document.getElementById('loading');
    loading.style.display = 'block';

    const response = await fetch(`${backend_base_url}/note/search`, {
      headers: {
        'content-type': 'application/json',
        // "Authorization": `Bearer ${access_token}`,
      },
      method: 'POST',
      body: JSON.stringify({ destinations: destinations })
    });

    if (response.status == 200) {
      const response_json = await response.json();

      let formatted_titles = response_json['title_list'].join(" -> ");

      $('#info_box').empty();

      let temp_html1 = `
        <div class="carousel-item active" style="padding: 5px;">
          <h3 style="text-align:center;">결과</h3>
          <div style="margin: auto; width: 50%; height: 5px; background-color: #485d86;"></div>
          <h5 style="margin-top: 20px">${formatted_titles}</h5>
        </div>
      `;

      $('#info_box').append(temp_html1);

      let x_y_list = response_json['x_y_list'];

      response_json['title_list'].forEach((a, idx) => {
        const answer = response_json['answer'][idx];
        const crawling = response_json['crawling'][idx];
        if (answer[0] && answer[0] == '.') {
          response_json['answer'][idx] = response_json['answer'][idx].substring(1);
        }
        let temp_html2 = `
          <div class="carousel-item" style="padding: 10px; width:100%; height:100%">
            <h3 id='${idx}' style="text-align:center;">${a}</h3>
            <div style="margin: auto; width: 50%; height: 5px; background-color: #485d86;"></div>
            <h5 style="text-align:center; margin-top: 20px;">${answer}</h5>
            <div style="margin-bottom: 20px; width: 100%; height: 1px; border-bottom: 5px dotted #485d86;"></div>
            가볼만한 블로그<br>
            <a href="${crawling}" target="_blank">${crawling}</a>
          </div>
        `;
        $('#info_box').append(temp_html2);
        let temp_html3 = `<li data-bs-target="#carouselExampleIndicators" data-bs-slide-to="${idx + 1}" hidden></li>`;
        $('#control_info').append(temp_html3);
      });

      $('#carouselModal').modal('show');

      document.getElementById('AI-mapbox').style.display = 'block';
      document.getElementById('map').style.display = 'block';
      document.getElementById('reload_btn').style.display = 'inline-block';
      document.getElementById('ai_answer_btn').style.display = 'inline-block';
      document.getElementById('work_div').style.display = 'none';
      document.getElementById('feed_div').style.display = 'none';

      await loadMap(x_y_list);
    } else {
      showToast('문제가 발생했습니다!');
    }
  } catch (error) {
    console.log(error);
  } finally {
    // 로딩창 숨김
    loading.style.display = 'none';
  }
}


async function loadMap(x_y_list) {
  // 평균 위도와 경도를 구합니다.
  const avgLat = x_y_list.reduce((acc, curr) => acc + curr[0], 0) / x_y_list.length;
  const avgLng = x_y_list.reduce((acc, curr) => acc + curr[1], 0) / x_y_list.length;

  var mapContainer = document.getElementById('map');
  var mapOption = {
    center: new kakao.maps.LatLng(avgLat, avgLng),
    level: 7
  };

  var map = new kakao.maps.Map(mapContainer, mapOption);

  var positions = [];
  var linePath = []; // 선을 그리기 위한 경로를 저장할 배열

  x_y_list.forEach((a, idx) => {
    let name = document.getElementById(`${idx}`).innerHTML;
    var dic = {
      content: `<div>${name}</div>`,
      latlng: new kakao.maps.LatLng(a[0], a[1])
    };
    positions.push(dic);
    linePath.push(dic.latlng); // 선을 그리기 위한 경로에 좌표를 추가
  })

  for (var i = 0; i < positions.length; i++) {
    var marker = new kakao.maps.Marker({
      map: map,
      position: positions[i].latlng
    });

    var infowindow = new kakao.maps.InfoWindow({
      content: positions[i].content
    });

    kakao.maps.event.addListener(marker, 'mouseover', makeOverListener(map, marker, infowindow));
    kakao.maps.event.addListener(marker, 'mouseout', makeOutListener(infowindow));
  }

  // 선을 구성하는 선을 생성하고 지도에 표시합니다
  var polyline = new kakao.maps.Polyline({
    path: linePath, // 선을 구성하는 좌표 배열
    strokeWeight: 3, // 선의 두께
    strokeColor: '#db4040', // 선의 색깔
    strokeOpacity: 1, // 선의 불투명도
    strokeStyle: 'solid' // 선의 스타일
  });

  // 선을 지도에 표시합니다
  polyline.setMap(map);

  function makeOverListener(map, marker, infowindow) {
    return function () {
      infowindow.open(map, marker);
    };
  }

  function makeOutListener(infowindow) {
    return function () {
      infowindow.close();
    };
  }
}


function reload() {
  let confirm_answer = confirm('이전 결과물은 볼 수 없습니다! 그래도 괜찮으신가요?')
  if (!confirm_answer) {
    return false
  }
  document.getElementById('AI-mapbox').style.display = 'none';
  document.getElementById('map').style.display = 'none';
  document.getElementById('reload_btn').style.display = 'none';
  document.getElementById('ai_answer_btn').style.display = 'none';
  document.getElementById('work_div').style.display = 'block';
  document.getElementById('feed_div').style.display = 'block';
}

function showLoading(text) {


  document.getElementById('loading').style.display = 'block';
}
let back_url = 'https://api.miyeong.net'
// let back_url = 'http://127.0.0.1:8000'
let access_token = localStorage.getItem('access')


async function showAiFeed() {
  params = new URLSearchParams(window.location.search);
  note_id = params.get("note_id");
  const response = await fetch(`${back_url}/note/plan/${note_id}`, {
    headers: {
      'content-type': 'application/json',
      "Authorization": `${access_token}`,
    },
    method: 'GET',
  })
  const response_json = await response.json()

  $('#ai_feed_box').empty()

  response_json.forEach((a) => {
    if (a['location'] && a['location'] != '주소가 없으면 ai 사용이 어렵습니다!') {
      console.log(a)
      let temp_html = `
                        <div>
                          <div name="${a['id']}" style="display: flex; justify-content: space-between;">
                            <div>
                              <h5 id='title' style="font-size:13px ">목적지 : ${a['title']}</h5>
                              <h5 id='category' style="font-size:13px ">카테고리 : ${a['category'] ?? '카테고리없음'}</h5>
                              <h5 id='location' style="font-size:12px">주소 : ${a['location']}</h5>
                              <h5 id='location_x' hidden>${a['location_x']}</h5>
                              <h5 id='location_y' hidden>${a['location_y']}</h5>
                            </div>
                            <div>
                              <input type="checkbox" id="check${a['id']}"><label for="check${a['id']}"></label>
                            </div>
                          </div>
                          <hr>
                        </div>
                      `
      $('#ai_feed_box').append(temp_html)
    }
  });
  $('#checkAll').on('change', function () {
    const checkboxes = $('#ai_feed_box input[type=checkbox]').not('#checkAll2');
    if ($(this).prop('checked')) {
      if (checkboxes.length > 0) {
        checkboxes.prop('checked', true);
      } else {
        $(this).prop('checked', false); // "전체 선택" 체크 해제
        alert('선택할 항목이 없습니다.'); // 한글 알림 메시지 표시
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
        alert('선택할 항목이 없습니다.'); // 한글 알림 메시지 표시
      }
    } else {
      checkboxes.prop('checked', false);
    }
  });
}

showAiFeed()

function saveAiFeed() {
  const selItems = $('#ai_feed_box input[type=checkbox]:checked').not('#checkAll');
  const existItems = $('#ai_work_box').children().length;
  const availSpace = 10 - existItems;

  if (selItems.length === 0) {
    alert('선택한 요소가 없습니다!');
    return;
  }

  if (availSpace <= 0) {
    alert('이미 10개의 아이템이 있습니다. 더 이상 추가할 수 없습니다!');
    return;
  }

  selItems.each(function (idx) {
    // If adding this item will exceed 10 items, stop adding.
    if (idx >= availSpace) {
      alert('최대 10개의 항목만 추가 가능합니다!');
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
    alert('선택한 요소가 없습니다!');
    return;
  }

  $('#ai_work_box input[type=checkbox]:checked').not('#checkAll2').each(function () {
    let checkedDiv = $(this).parent().parent().parent();
    $('#ai_feed_box').append(checkedDiv);

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
  let destinations = [];
  $('#ai_work_box input[type=checkbox]:checked').not('#checkAll2').each(function () {
    let checkedDiv = $(this).closest('div[name]');
    let title = checkedDiv.find('#title').text().split(':')[1].trim();
    let category = checkedDiv.find('#category').text().split(':')[1].trim();
    let location_x = checkedDiv.find('#location_x').text();
    let location_y = checkedDiv.find('#location_y').text();
    let destination = {
      category: category,
      title: title,
      x: location_x,
      y: location_y
    };

    destinations.push(destination);

  });

  console.log(access_token)
  const response = await fetch(`${back_url}/note/search`, {
    headers: {
      'content-type': 'application/json',
      "Authorization": `${access_token}`,
    },
    method: 'POST',
    body: JSON.stringify({ destinations: destinations })
  })
  if (response.status == 200) {
    const response_json = await response.json()
    console.log(response_json)

    let formatted_titles = response_json['title_list'].join(" -> ");

    $('#info_box').empty()

    let temp_html1 = `
                      <div class="carousel-item active" style="padding: 10px;">
                          <h3>결과)</h3>
                          <h5>${formatted_titles}</h5>
                      </div>
                    `

    $('#info_box').append(temp_html1)

    let x_y_list = response_json['x_y_list'];

    response_json['title_list'].forEach((a, idx) => {
      let temp_html2 = `
                    <div class="carousel-item" style="padding: 10px; width:100%; height:100%">
                      <h3>${a}</h3>
                      <div id="map_${idx}" style="width:49%;height:00px;"></div>
                    </div>
                    `;
      $('#info_box').append(temp_html2);
      let temp_html3 = `<li data-bs-target="#carouselExampleIndicators" data-bs-slide-to="${idx + 1}" hidden>`;
      $('#control_info').append(temp_html3);

      // setTimeout function to delay the map creation
      setTimeout(function () {
        var container = document.getElementById('map_' + idx);
        var options = {
          center: new kakao.maps.LatLng(x_y_list[idx][0], x_y_list[idx][1]),
          level: 3
        };

        var map = new kakao.maps.Map(container, options);

        var markerPosition = new kakao.maps.LatLng(x_y_list[idx][0], x_y_list[idx][1]);

        var marker = new kakao.maps.Marker({
          position: markerPosition
        });

        marker.setMap(map);
      }, 10000);  // the delay time is set to 0 ms
    });



    const btnElement = document.getElementById('ai_start_btn');
    btnElement.innerText = '결과보기';
    btnElement.setAttribute("onClick", ``)
    btnElement.setAttribute("data-bs-toggle", `modal`)
    btnElement.setAttribute("data-bs-target", `#carouselModal`)

    $('#carouselModal').modal('show');

  } else {
    alert('문제가 발생했습니다!')
    console.log(response)
  }

}
let back_url = 'https://api.miyeong.net'
async function showAiFeed() {
  params = new URLSearchParams(window.location.search);
  note_id = params.get("note_id");
  const response = await fetch(`${back_url}/note/plan/${note_id}`, {
    headers: {
      'content-type': 'application/json',
      // "Authorization": `${access_token}`,
    },
    method: 'GET',
  })
  const response_json = await response.json()

  // $('#ai_feed_box').empty()

  response_json.forEach((a) => {
    if (a['location'] && a['location'] != '주소가 없으면 ai 사용이 어렵습니다!') {
      console.log(a)
      let temp_html = `
      <div id='${a['id']}'>
                        <div style="display: flex; justify-content: space-between;">
                          <div>
                            <h5 style="font-size:13px ">목적지 : ${a['title']}</h5>
                            <h5 style="font-size:13px ">카테고리 : ${a['category'] ?? '카테고리없음'}</h5>
                            <h5 style="font-size:12px">주소 : ${a['location']}</h5>
                          </div>
                          <div>
                            <input type="checkbox" id="check${a['id']}"><label for="check${a['id']}"></label>
                          </div>
                        </div>
                        <hr>
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
  if ($('#ai_feed_box input[type=checkbox]:checked').not('#checkAll').length === 0) {
    alert('선택한 요소가 없습니다!');
    return;
  }

  $('#ai_feed_box input[type=checkbox]:checked').not('#checkAll').each(function () {
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

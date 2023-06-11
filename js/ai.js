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

  $('#ai_feed_box').empty()

  response_json.forEach((a) => {
    if (a['location'] && a['location'] != '주소가 없으면 ai 사용이 어렵습니다!') {
      console.log(a)
      let temp_html = `
                        <div id='${a['id']}'>
                          <div style="display: flex; justify-content: space-between;">
                            <h5 style="font-size:15px">목적지 : ${a['title']}</h5>
                            <div>
                              <input type="checkbox" id="check${a['id']}"><label for="check${a['id']}"></label>
                            </div>
                          </div>
                          <h5 style="font-size:15px">주소 : ${a['location']}</h5>
                          <hr>
                        </div>
                      `
      $('#ai_feed_box').append(temp_html)
    }
  })
}

showAiFeed()

function saveAiFeed() {
  $('input[type=checkbox]:checked').each(function () {
    let checkedDiv = $(this).parent().parent().parent();
    $('#ai_work_box').append(checkedDiv);
  });
}

function deleteAiFeed() {
  $('input[type=checkbox]:checked').each(function () {
    let checkedDiv = $(this).parent().parent().parent();
    $('#ai_feed_box').append(checkedDiv);
  });
}
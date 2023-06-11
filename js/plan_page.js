let plan_data = []
let access_token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjg2NTQwNDExLCJpYXQiOjE2ODY0NTQwMTEsImp0aSI6IjRjZGM3NmM0ZTAzMDRkNDA5ZmI1NzY5MDA3YTQ1OTliIiwidXNlcl9pZCI6MSwibmlja25hbWUiOiJtaXllb25nIiwiZW1haWwiOiJtaXllb25nQG5hdmVyLmNvbSIsImlzX2FkbWluIjp0cnVlfQ.7fzQOTq2_j8wXthwIa_utwaoAkKIIMiKJ_tGnu_x2es'
let back_url = 'https://api.miyeong.net'

async function showPlanPage() {
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
    response_json.forEach((a) => {
        let dic = {
            id: a['id'],
            title: a['title'],
            start: a['start'],
            location: a['location'] ?? '주소가 없으면 ai 사용이 어렵습니다!',
            time: a['time'] ?? '내용없음',
            memo: a['memo'] ?? '내용없음'
        };
        plan_data.push(dic)
    })
}


document.addEventListener('DOMContentLoaded', async function () {
    await showPlanPage();
    params = new URLSearchParams(window.location.search);
    note_id = params.get("note_id");
    var calendarEl = document.getElementById('calendar');
    var calendar = new FullCalendar.Calendar(calendarEl, {
        headerToolbar: {
            left: 'myCustomButton AiButton PhotoButton',
            center: 'title',
        },
        customButtons: {
            myCustomButton: {
                text: 'Add plan ',
                click: function () {
                    $('#save_plan_modal').modal('show');
                }
            },
            AiButton: {
                text: 'AI랑 놀기',
                click: function () {
                    window.location.href = `/ai.html?note_id=${note_id}`
                }
            },
            PhotoButton: {
                text: 'Photo Book',
                click: function () {
                    window.location.href = '/photo_page.html'
                }
            }
        },
        locale: 'ko',
        initialView: 'dayGridMonth',
        editable: true,
        dayMaxEvents: 2,
        events: plan_data,
        eventClick: function (info) {
            info.jsEvent.preventDefault();
            var eventInfoDiv = document.getElementById('plan_info');
            var formattedDate = info.event.start.toLocaleDateString(); // 날짜 포멧

            var titleElement = document.getElementById('plan_modal_id');
            titleElement.innerHTML = `${info.event.id}`; // ID 추가

            eventInfoDiv.innerHTML = `
                                        <h3 id='plan_title'>Title: ${info.event.title}</h3>
                                        <h5 id='plan_date'>Date: ${formattedDate}</h5>
                                        <h5 id='plan_location'>Location: ${info.event.extendedProps.location}</h5>
                                        <h5 id='plan_time'>Time: ${info.event.extendedProps.time}</h5>
                                        <h5 id='plan_memo'>Memo: ${info.event.extendedProps.memo}</h5>
                                    `;
            $('#plan_modal').modal('show');
        },

        eventDrop: function (info) {
            var event = info.event;
            var plan_id = event.id

            // 이벤트 시작 시간을 ISO 문자열 형태로 가져옴
            var newStart = event.start.toISOString();
            let droppedDate = new Date(newStart); // 드랍된 이벤트의 시간 넣기!
            let month = (droppedDate.getMonth() + 1); // 월, 11[1을 더해야함. 유일하게 조심해야할 부분. 1월은 0이다.]
            let date = droppedDate.getDate(); // 일, 14
            let year = droppedDate.getFullYear();
            let newDate = `${year}-${month}-${date}`;

            fetch(`${back_url}/note/plan-detail/${plan_id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `${access_token}`,
                },
                body: JSON.stringify({
                    // start만 옮기기 때문!
                    start: newDate,
                })
            }).then(response => {
                if (!response.ok) {
                    // 서버 오류시 원상복귀
                    info.revert();
                }
            });
        }
    });

    calendar.render();
});


async function savePlan() {
    params = new URLSearchParams(window.location.search);
    note_id = params.get("note_id");
    const title = document.getElementById("title").value
    const location = document.getElementById("location").value
    const start = document.getElementById("start").value
    const memo = document.getElementById("memo").value
    const time = document.getElementById("time").value

    const response = await fetch(`${back_url}/note/plan/${note_id}`, {
        headers: {
            'content-type': 'application/json',
            "Authorization": `${access_token}`,
        },
        method: 'POST',
        body: JSON.stringify({
            "title": title,
            "location": location,
            "start": start,
            "memo": memo,
            "time": time,
        })
    });
    if (response.status == 200) {
        alert("새로운 계획이 생성되었습니다!")
        window.location.reload()
    } else {
        alert('문제가 발생했습니다!')
    }
}

async function deletePlan() {
    plan_id = document.getElementById('plan_modal_id').innerHTML;
    const response = await fetch(`${back_url}/note/plan-detail/${plan_id}`, {
        headers: {
            'content-type': 'application/json',
            "Authorization": `${access_token}`,
        },
        method: 'DELETE',
    });
    if (response.status == 204) {
        alert("계획이 삭제되었습니다!")
        window.location.reload()
    } else {
        alert('문제가 발생했습니다!')
    }
}

function patchBox() {
    // 수정 창으로 변경합니다.
    let planInfoDiv = document.getElementById('plan_info');
    let title = document.getElementById('plan_title').innerHTML.split(':')[1].trim();
    let location = document.getElementById('plan_location').innerHTML.split(':')[1].trim();
    let time = document.getElementById('plan_time').innerHTML.split(':')[1].trim();
    let memo = document.getElementById('plan_memo').innerHTML.split(':')[1].trim();
    // date 포멧팅
    let dateString = document.getElementById('plan_date').innerHTML.split(':')[1].trim();
    let dateParts = dateString.split('.').map(part => part.trim());
    let year = dateParts[0];
    let month = dateParts[1].length === 1 ? '0' + dateParts[1] : dateParts[1];
    let day = dateParts[2].length === 1 ? '0' + dateParts[2] : dateParts[2];
    let date = `${year}-${month}-${day}`;

    planInfoDiv.innerHTML = `
            <input name="title" id="pat_title" type="text" class="form-control" value="${title}" placeholder="장소명">
            <input name="location" id="pat_location" type="text" class="form-control" value="${location}" placeholder="주소(미작성시 AI사용이 불가합니다!)">
            <input name="start" id="pat_start" type="date" class="form-control" value="${date}">
            <input name="time" id="pat_time" type="text" class="form-control" value="${time}" placeholder="시간">
            <textarea name="memo" id="pat_memo" type="textarea" class="form-control" placeholder="memo">${memo}</textarea>
    `;

    const btnElement = document.getElementById('patch_box');
    btnElement.innerText = '저장';
    btnElement.setAttribute("onClick", `patchPlan()`)
}

async function patchPlan() {
    plan_id = document.getElementById('plan_modal_id').innerHTML;
    let title = document.getElementById('pat_title');
    let location = document.getElementById('pat_location');
    let time = document.getElementById('pat_time');
    let memo = document.getElementById('pat_memo');
    let start = document.getElementById('pat_start');

    const response = await fetch(`${back_url}/note/plan-detail/${plan_id}`, {
        headers: {
            'content-type': 'application/json',
            "Authorization": `${access_token}`,
        },
        method: 'PATCH',
        body: JSON.stringify({
            "title": title.value ?? title.placeholder,
            "location": location.value ?? location.placeholder,
            "start": start.value ?? start.placeholder,
            "memo": memo.value ?? memo.placeholder,
            "time": time.value ?? time.placeholder,
        })
    });
    if (response.status == 200) {
        alert("계획이 수정되었습니다!")
        window.location.reload()
    } else {
        alert('문제가 발생했습니다!')
    }
}
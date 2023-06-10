let plan_data = []
let access_token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjg2NDUyNDM1LCJpYXQiOjE2ODYzNjYwMzUsImp0aSI6ImVkOWE4NzU1MDcxZTQyZTY5YjVjMjQ4OTg3MTUxMzkwIiwidXNlcl9pZCI6MSwibmlja25hbWUiOiJtaXllb25nIiwiZW1haWwiOiJtaXllb25nQG5hdmVyLmNvbSIsImlzX2FkbWluIjp0cnVlfQ.UJhoL0NgWtrnjRw6oG9qg_WuW_KcZdxcyb5u6Fy74SE'
let back_url = 'https://api.miyeong.net'

async function showPlanPage() {
    const response = await fetch(`${back_url}/note/plan/1`, {
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
    console.log(plan_data)
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
                    window.location.href = '/Ai.html'
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
            // 날짜 포멧
            var formattedDate = info.event.start.toLocaleDateString();

            eventInfoDiv.innerHTML = `
                <h3>Title: ${info.event.title}</h3>
                <h5>Date: ${formattedDate}</h5>
                <h5>Location: ${info.event.extendedProps.location}</h5>
                <h5>Time: ${info.event.extendedProps.time}</h5>
                <h5>Memo: ${info.event.extendedProps.memo}</h5>
            `;
            $('#plan_modal').modal('show');
        },
        eventDrop: function (info) {
            var event = info.event;
            var plan_id = event.id

            // 이벤트 시작 시간을 ISO 문자열 형태로 가져옵니다.
            var newStart = event.start.toISOString();
            let droppedDate = new Date(newStart); // 여기에 드랍된 이벤트의 시간을 넣으세요.
            let month = (droppedDate.getMonth() + 1); // 월, 11[1을 더해야함. 유일하게 조심해야할 부분. 1월은 0이다.]
            let date = droppedDate.getDate(); // 일, 14
            let year = droppedDate.getFullYear();
            let newDate = `${year}-${month}-${date}`;

            console.log('Event dropped to ' + newStart);
            console.log(newDate);

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

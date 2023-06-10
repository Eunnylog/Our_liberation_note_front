async function calLoad() {


    document.addEventListener('DOMContentLoaded', function () {
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
            dayMaxEvents: 2, // Use dayMaxEvents instead of eventLimit
            events: [
                {
                    title: '장소명1',
                    start: '2023-06-10',
                    location: '주소지(ai 사용 위해)',
                    time: '14:00 - 16:00',
                    memo: '이것은 메모이다!',
                },
                {
                    title: '장소명2',
                    start: '2023-06-10',
                    location: '주소지(ai 사용 위해)',
                    time: '14:00 - 16:00',
                    memo: '이것은 메모이다!',
                },
                {
                    title: '장소명3',
                    start: '2023-06-10',
                    location: '주소지(ai 사용 위해)',
                    time: '14:00 - 16:00',
                    memo: '이것은 메모이다!',
                },
                {
                    title: '장소명4',
                    start: '2023-06-10',
                    location: '주소지(ai 사용 위해)',
                    time: '14:00 - 16:00',
                    memo: '이것은 메모이다!',
                },
            ],
            eventClick: function (info) {
                info.jsEvent.preventDefault();
                var eventInfoDiv = document.getElementById('plan_info');
                eventInfoDiv.innerHTML = `
                    <h3>Title: ${info.event.title}</h3>
                    <h5>Date: ${info.event.start}</h5>
                    <h5>Location: ${info.event.extendedProps.location}</h5>
                    <h5>Time: ${info.event.extendedProps.time}</h5>
                    <h5>Memo: ${info.event.extendedProps.memo}</h5>
                `;
                $('#plan_modal').modal('show');
            },
        });
        calendar.render();
    });
}

calLoad()
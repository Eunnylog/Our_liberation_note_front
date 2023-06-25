let plan_data = []
let plan_set = [];
let access_token = localStorage.getItem('access')
let back_url = 'https://api.liberation-note.com'

checkGroup()
checkLogin()


window.onload = function () {
    params = new URLSearchParams(window.location.search);
    note_id = params.get("note_id");

    var aiLink = document.getElementById('goAI');
    var photoLink = document.getElementById('goPhoto');
    var lifePhoto = document.getElementById('lifePhoto');
    var back = document.getElementById('back');

    aiLink.onclick = function () {
        location.href = '/ai.html?note_id=' + note_id;
    }
    photoLink.onclick = function () {
        location.href = '/photo_page.html?note_id=' + note_id;
    }
    lifePhoto.onclick = function () {
        location.href = '/lifephoto_page.html?note_id=' + note_id;
    }
    back.onclick = function () {
        location.href = '/my_diary.html';
    }
};



async function showPlanPage() {
    params = new URLSearchParams(window.location.search);
    note_id = params.get("note_id");
    let note_name = localStorage.getItem('noteName')

    $('#note_title').text(note_name);

    const response = await fetch(`${back_url}/note/plan/${note_id}`, {
        headers: {
            'content-type': 'application/json',
            // "Authorization": `Bearer ${access_token}`,
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
            memo: a['memo'] ?? '내용없음',
            place_category: a['category'] ?? '없음',
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
            center: 'title',
            left: 'prevYear,nextYear'
        },
        locale: 'ko',
        initialView: 'dayGridMonth',
        editable: true,
        dayMaxEvents: 2,
        events: plan_data,
        fixedWeekCount: false,
        eventClick: function (info) {
            info.jsEvent.preventDefault();
            var eventInfoDiv = document.getElementById('plan_info');
            var formattedDate = info.event.start.toLocaleDateString();

            var titleElement = document.getElementById('plan_modal_id');
            titleElement.innerHTML = `${info.event.id}`;

            eventInfoDiv.innerHTML = `
                <h3 id='plan_title'>${info.event.title}</h3>
                <h5 id='plan_category'>카테고리:${info.event.extendedProps.place_category}</h5>
                <h5 id='plan_date'>Date: ${formattedDate}</h5>
                <h5 id='plan_location'>Location: ${info.event.extendedProps.location}</h5>
                <h5 id='plan_time'>Time: ${info.event.extendedProps.time}</h5>
                <h5 id='plan_memo'>Memo: ${info.event.extendedProps.memo}</h5>
            `;
            $('#plan_modal').modal('show');

            const btnElement = document.getElementById('patch_box');
            btnElement.innerText = '수정';
            btnElement.setAttribute("onClick", `patchBox()`)
        },
        eventDrop: function (info) {
            var event = info.event;
            var plan_id = event.id
            var newStart = event.start.toISOString();
            let droppedDate = new Date(newStart);
            let month = (droppedDate.getMonth() + 1);
            let date = droppedDate.getDate();
            let year = droppedDate.getFullYear();
            let newDate = `${year}-${month}-${date}`;

            fetch(`${back_url}/note/plan-detail/${plan_id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    // "Authorization": `Bearer ${access_token}`,
                },
                body: JSON.stringify({
                    start: newDate,
                })
            }).then(response => {
                if (!response.ok) {
                    info.revert();
                }
                console.log(response)
            });
        }
    });

    calendar.render();

});


async function savePlan() {
    params = new URLSearchParams(window.location.search);
    note_id = params.get("note_id");

    if (plan_set.length == 0) {
        showToast('일정을 추가해주세요!')
        return false
    }


    const response = await fetch(`${back_url}/note/plan/${note_id}`, {
        headers: {
            'content-type': 'application/json',
            // "Authorization": `Bearer ${access_token}`,
        },
        method: 'POST',
        body: JSON.stringify({ "plan_set": plan_set })
    });
    if (response.status == 200) {
        showToast("새로운 계획이 생성되었습니다!")
        setTimeout(function () {
            window.location.reload();
        }, 1000);
    } else {
        showToast('문제가 발생했습니다!')
        console.log(response.error)
    }
}

async function deletePlan() {
    var userConfirmation = confirm("정말 삭제하시겠습니까?");

    // 만약 사용자가 'OK'를 클릭하면, plan을 삭제하고 버튼을 제거합니다.
    if (!userConfirmation) {
        return false
    }

    plan_id = document.getElementById('plan_modal_id').innerHTML;
    const response = await fetch(`${back_url}/note/plan-detail/${plan_id}`, {
        headers: {
            'content-type': 'application/json',
            "Authorization": `Bearer ${access_token}`,
        },
        method: 'DELETE',
    });
    if (response.status == 204) {
        showToast("계획이 삭제되었습니다!")
        setTimeout(function () {
            window.location.reload();
        }, 1000);
    } else {
        showToast('문제가 발생했습니다!')
    }
}

function patchBox() {
    // 수정 창으로 변경합니다.
    let planInfoDiv = document.getElementById('plan_info');
    let title = document.getElementById('plan_title').innerHTML;
    let location = document.getElementById('plan_location').innerHTML.split(':')[1].trim();
    let time = document.getElementById('plan_time').innerHTML.split(':')[1].trim();
    let memo = document.getElementById('plan_memo').innerHTML.split(':')[1].trim();
    let category = document.getElementById('plan_category').innerHTML.split(':')[1].trim();
    // date 포멧팅
    let dateString = document.getElementById('plan_date').innerHTML.split(':')[1].trim();
    let dateParts = dateString.split('.').map(part => part.trim());
    let year = dateParts[0];
    let month = dateParts[1].length === 1 ? '0' + dateParts[1] : dateParts[1];
    let day = dateParts[2].length === 1 ? '0' + dateParts[2] : dateParts[2];
    let date = `${year}-${month}-${day}`;

    planInfoDiv.innerHTML = `
                            <div class="input-group" style="flex-wrap: nowrap;">
                                <input name="title" id="title" type="text" value='${title}' class="form-control" placeholder="장소명(지역명+상호명)"
                                style="width: 60%; height:40px;">
                                <div class="input-group-append" style="width: 10%;">
                                    <button type="button" onclick="searchLocation()" class="btn btn-primary"
                                    style="margin-top:0px;height:40px; font-size:15px">검색</button>
                                </div>
                                <input name="category" id="category" value='${category}' type="text" class="form-control" placeholder="category"
                                    style="width: 29%; height:40px;">
                            </div>
                            <div id="search_box" style="width: 100%;  overflow: auto;"></div>
                            <input name="location" id="location" value='${location}' type="text" class="form-control"
                                placeholder="주소(미작성시 AI사용이 불가합니다!)">
                            <input name="start" id="start" value='${date}' type="date" class="form-control">
                            <input name="time" id="time" value='${time}' type="text" class="form-control" placeholder="시간">
                            <textarea name="memo" id="memo" value='${memo}'  type="textarea" class="form-control" placeholder="memo"
                                style="height:200px; min-height:200px; max-height:200px"></textarea>
    `;

    const btnElement = document.getElementById('patch_box');
    btnElement.innerText = '저장';
    btnElement.setAttribute("onClick", `patchPlan()`)

}

async function patchPlan() {
    plan_id = document.getElementById('plan_modal_id').innerHTML;
    let title = document.getElementById('title').value;
    let location = document.getElementById('location').value;
    let time = document.getElementById('time').value;
    let memo = document.getElementById('memo').value;
    let start = document.getElementById('start').value;
    let category = document.getElementById('category').value;
    let location_x = document.getElementById("location_x").value
    let location_y = document.getElementById("location_y").value

    let titleBox = document.getElementById("title")
    let startBox = document.getElementById("start")

    if (title == '' || start == '') {
        showToast('장소명과 날짜는 필수입니다!')
        titleBox.classList.add("custom-class");
        startBox.classList.add("custom-class");
        return false
    } else {
        titleBox.classList.remove("custom-class");
        startBox.classList.remove("custom-class");
    }


    const response = await fetch(`${back_url}/note/plan-detail/${plan_id}`, {
        headers: {
            'content-type': 'application/json',
            "Authorization": `Bearer ${access_token}`,
        },
        method: 'PATCH',
        body: JSON.stringify({
            "title": title,
            "location": location,
            "start": start,
            "memo": memo,
            "time": time,
            "category": category,
            "location_x": location_x,
            "location_y": location_y,
        })
    });
    if (response.status == 200) {
        showToast("계획이 수정되었습니다!");
        setTimeout(function () {
            window.location.reload();
        }, 1000);
    } else {
        showToast('문제가 발생했습니다!')
    }
}


let title_li = [];

function addPlanList() {
    const title = document.getElementById("title").value
    const location = document.getElementById("location").value
    const start = document.getElementById("start").value
    const memo = document.getElementById("memo").value
    const time = document.getElementById("time").value
    const category = document.getElementById("category").value
    const location_x = document.getElementById("location_x").value
    const location_y = document.getElementById("location_y").value

    let titleBox = document.getElementById("title")
    let startBox = document.getElementById("start")

    if (title == '' || start == '') {
        showToast('장소명과 날짜는 필수입니다!')
        titleBox.classList.add("custom-class");
        startBox.classList.add("custom-class");
        return false
    } else {
        titleBox.classList.remove("custom-class");
        startBox.classList.remove("custom-class");
    }

    let plan = {
        "title": title,
        "location": location,
        "start": start,
        "memo": memo,
        "time": time,
        "category": category,
        "location_x": location_x,
        "location_y": location_y,
    };

    // 해당 조건을 만족하는 요소가 있으면 true를 반환
    let checkPlanList = plan_set.some(function (existingPlan) {
        // 문자열로 비교
        return JSON.stringify(existingPlan) === JSON.stringify(plan);
    });

    if (checkPlanList) {
        showToast('이미 추가한 일정입니다!')
        return false;
    }

    plan_set.push(plan);

    let temp_html = `
                        <button onclick="deletePlanList('${plan}', event)" style="width:150px; border-radius:20px;">${title}<br>(${start})</button>
                    `
    $('#plan_list').append(temp_html)

    document.getElementById("title").value = ''
    document.getElementById("location").value = ''
    document.getElementById("start").value = ''
    document.getElementById("memo").value = ''
    document.getElementById("time").value = ''
    document.getElementById("category").value = ''
    document.getElementById("location_x").value = ''
    document.getElementById("location_y").value = ''
}


$(document).ready(function () {
    $(".delete_search").click(function () {
        if ($('#search_box').length) {
            $('#search_box').empty();
            var searchBox = document.getElementById('search_box');
            searchBox.style.height = '0px';
            searchBox.style.padding = '0px';
            searchBox.style.margin = '0px';

            document.getElementById("location").value = ''
            document.getElementById("title").value = ''
            document.getElementById("category").value = ''
            document.getElementById("location_x").value = ''
            document.getElementById("location_y").value = ''
        }
        let titleBox = document.getElementById("title")
        let startBox = document.getElementById("start")

        titleBox.classList.remove("custom-class");
        startBox.classList.remove("custom-class");
    });
});


function deletePlanList(plan, event) {
    // 버튼 누를시 페이지 이동 멈춤
    event.preventDefault();

    var userConfirmation = confirm("정말 삭제하시겠습니까?");

    // 만약 사용자가 'OK'를 클릭하면, plan을 삭제하고 버튼을 제거합니다.
    if (userConfirmation) {
        deletePlanFromSet(plan, plan_set);

        // 클릭된 버튼 삭제
        event.target.remove();
    }

}

function deletePlanFromSet(plan, plan_set) {
    //  판별 함수를 만족하는 첫 번째 요소의 인덱스를 반환
    const index = plan_set.findIndex(p => p.id === plan.id);

    // 만약 plan이 plan_set에 존재한다면, 해당 plan을 삭제합니다.
    if (index !== -1) {
        plan_set.splice(index, 1);
    }
}

async function sendEmail() {
    params = new URLSearchParams(window.location.search);
    note_id = params.get("note_id");

    let checkedEmails = [];
    $('input[type="checkbox"]:checked').each(function () {
        checkedEmails.push($(this).attr('id'));
    });

    if (checkedEmails.length == 0) {
        showToast('이메일을 선택해주세요!')
        return false
    }

    var loading = document.getElementById('loading');

    try {
        // 로딩창 표시
        loading.style.display = 'block';

        const response = await fetch(`${back_url}/note/email/${note_id}`, {
            headers: {
                'content-type': 'application/json',
                // "Authorization": `Bearer ${access_token}`,
            },
            method: 'POST',
            body: JSON.stringify({
                "members": checkedEmails,
            })
        });

        if (response.status == 200) {
            showToast("이메일 전송이 완료되었습니다!")
            setTimeout(function () {
                window.location.reload();
            }, 1000);
        } else {
            showToast('문제가 발생했습니다!')
        }
    } catch (error) {
        showToast('오류가 발생했습니다!');
    } finally {
        // 로딩창 숨김
        loading.style.display = 'none';
    }
}

async function selectEmailMember() {
    params = new URLSearchParams(window.location.search);
    note_id = params.get("note_id");
    const response = await fetch(`${back_url}/note/note-detail/${note_id}`, {
        headers: {
            'content-type': 'application/json',
            "Authorization": `Bearer ${access_token}`,
        },
        method: 'GET',
    });
    const response_json = await response.json()
    $('#member_list').empty()
    if (response.status == 200) {
        console.log(response_json)
        emails = response_json['group_set']['members'].split(", ")
        emails.forEach((email) => {
            console.log(email);
            let temp_html = `
                            <div>
                                <h5 style="display: inline-block; vertical-align: middle;">${email}</h5>
                                <input type="checkbox" id="${email}">
                                <label for="${email}" style="margin-left: 10px; vertical-align: middle;"></label>
                            </div>
                            `;
            $('#member_list').append(temp_html);
        });
        $('#select_email_member').modal('show');
    } else {
        showToast('문제가 발생했습니다!')
    }
}


async function savePayIsSubscribe() {
    params = new URLSearchParams(window.location.search);
    note_id = params.get("note_id");
    const response = await fetch(`${back_url}/payments/subscription/${note_id}`, {
        headers: {
            'content-type': 'application/json',
            "Authorization": `Bearer ${access_token}`,
        },
        method: 'GET',
    });
    if (response.status == 200) {
        localStorage.setItem("is_subscribe", true);
    } else {
        localStorage.setItem("is_subscribe", false);
    }

}

savePayIsSubscribe()

async function deleteNoteModal() {
    params = new URLSearchParams(window.location.search);
    const selected_id = params.get("note_id");
    const selected_name = localStorage.getItem('noteName')
    const selected_group = localStorage.getItem('groupId');
    console.log("selected_group", selected_group)


    $('#modal-body').empty()
    $('#modal-footer').empty()

    let temp_html = `<p>[${selected_name}] 노트를 삭제하시겠습니까?</p>`

    $('#modal-body').append(temp_html)

    let temp_html2 = `<button type="button" class="btn" data-bs-dismiss="modal"
                        style="background-color: #7689b1; border-color: #7689b1; color:white;">Close</button>
                      <button type="button" class="btn"
                        style="background-color: #485d86; border-color: #485d86; color:white; margin: 0px 10px;"
                        onclick="handleNotetrash('${selected_id}','${selected_group}','${selected_name}')">Delete</button>`

    $('#modal-footer').append(temp_html2)
}



function saveNoteID() {
    params = new URLSearchParams(window.location.search);
    const note_id = params.get("note_id");
    localStorage.setItem('note_id', note_id)
}
saveNoteID()

let access_token = localStorage.getItem('access')
let back_url = 'https://api.liberation-note.com'

let group_data = [] // 그룹 정보 저장

checkLogin()

const userPayload = localStorage.getItem('payload')
const userPayloadJson = JSON.parse(userPayload)
const userEmail = userPayloadJson.email

function loadNoteCategory() {

}
window.onload = function () {
    $('#note_category').empty()
    for (let i = 1; i < 13; i++) {
        let temp_html = `
                        <div
                            style="width: 100px; height: 170px; text-align:center; display:inline-block; margin: auto 20px 20px auto;">
                            <img src="/css/note_img/note_${i}.png" style="width: 100px; height: 150px;"><br>
                            <input type="radio" name="note_category" value="${i}" style="width:10px">
                        </div>
                    `
        $('#note_category').append(temp_html)
    }
};

async function getGroup() {
    const response = await fetch(`${back_url}/user/group/`, {
        headers: {
            'content-type': 'application/json',
            'Authorization': `Bearer ${access_token}`,
        },
        method: 'GET',
    })
    const response_json = await response.json()

    console.log(response_json)
    $('#select_group').empty()
    // if (response_json.length == 0) {
    //     alert('그룹을 먼저 생성해 주세요!')
    //     window.location.href = '/index.html'
    // }
    if (response_json.length == 0) {
        alert('그룹을 먼저 생성해 주세요!')
        setTimeout(function () {
            window.location.href = '/index.html'
        }, 1500);
    }
    response_json.forEach((a, index) => {
        let id = a['id']
        let name = a['name']
        let master = a['master']
        let members = a['members']
        let temp_html = `<option value="${id}">${name}</option>`
        // 페이지 그룹 샐랙트
        $('#select_group').append(temp_html)
        // 모달 그룹 샐랙트
        $('#group_name').append(temp_html)

        // 첫번째 그룹 노트 리스트 보여주기
        if (index === 0) {
            document.getElementById("select_group").value = id
            showNoteList();
            // showMasterButton();
        }
        // 변수들을 딕셔너리로 묶기
        let groupDict = {
            "id": id,
            "name": name,
            "master": master,
            "members": members
        }

        group_data.push(groupDict)
    })
    return response_json
}

getGroup().then(() => {
    showNoteList()
    // showMasterButton();
});

// 마스터만 그룹 수정&삭제 버튼 display
async function showMasterButton() {
    let updateButton = document.getElementById("group-update-btn")
    let deleteButton = document.getElementById("group-delete-btn")

    const selectedGroup = group_data.find(group => group.id == $('#select_group').val());

    if (selectedGroup && selectedGroup.master === userEmail) {
        updateButton.style.display = "block";
        deleteButton.style.display = "block";
    } else {
        updateButton.style.display = "none";
        deleteButton.style.display = "none";
    }
}

async function showNoteList() {
    localStorage.removeItem("is_subscribe")
    const group_id = document.getElementById("select_group").value
    if (group_id) {
        const response = await fetch(`${back_url}/note/${group_id}`, {
            headers: {
                'content-type': 'application/json',
                "Authorization": `Bearer ${access_token}`,
            },
            method: 'GET',
        })
        const response_json = await response.json()
        $('#note_list').empty()
        let temp_html2 = `
                            <a href="/" data-bs-toggle="modal" data-bs-target="#create_note">
                                <section class="cp-card content" style="background-color: #d9e2f6; text-align:center;">
                                <img src="/css/assets/plus.png" style="justify-content: center; width:60%; height:100%; margin-top:5%;">
                                </section>
                            </a>
                        `
        $('#note_list').append(temp_html2);
        response_json.forEach((a) => {
            const category = a['category']
            const name = a['name']
            const note_id = a['id']

            let temp_html = `
                                <a href="/plan_page.html?note_id=${note_id}" onclick="saveLocalNoteName('${name}','${group_id}')" style='text-decoration:none; color:black;'>
                                    <section class="cp-card content" style="background-image: url('/css/note_img/note_${category}.png');">
                                    <div class="thumb">
                                    </div>
                                    </section>
                                    <div style="text-align: center;">${name}</div>
                                </a>
                            `
            $('#note_list').append(temp_html);
        })
        showMasterButton(); // showMasterButton 함수 호출
    }
}


async function saveNote() {
    let radios = Array.from(document.getElementsByName('note_category'));
    let selected = radios.find(radio => radio.checked);
    const group_name = document.getElementById("group_name").value

    if (group_name == '-1') {
        showToast('그룹을 선택해주세요!')
        return false
    }

    const note_name = document.getElementById("note_name").value

    let category_value;
    if (selected) {
        category_value = selected.value;

        const response = await fetch(`${back_url}/note/`, {

            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${access_token}`
            },
            method: "POST",
            body: JSON.stringify({
                "group": group_name,
                "category": category_value,
                "name": note_name
            })
        });

        let response_json = await response.json()

        if (response.status == 201) {
            localStorage.setItem('noteName', note_name);
            showToast("새로운 노트가 생성되었습니다!")
            window.location.href = `/plan_page.html?note_id=${response_json['id']}`

        } else if (!note_name) {
            showToast('노트 이름을 입력해주세요!!')
        }
        else {
            showToast(response_json['non_field_errors'])
        }

    } else {
        showToast('표지를 선택해 주세요!')
    }

}

function saveLocalNoteName(note_name, group_id) {
    localStorage.setItem('noteName', note_name);
    localStorage.setItem('groupId', group_id);
}

let updatingGroupId;

function updateHandleRadioClick() {
    const selectedRadio = document.querySelector('input[name="email_radio"]:checked');

    if (selectedRadio) {
        const selectedEmail = selectedRadio.previousSibling.textContent.trim();
        document.getElementById("update-usersearch").value = selectedEmail;
    }
}

// 기존 이메일을 저장할 배열
let existingEmails = [];

// 그룹 수정 모달창
async function groupUpdateModal() {
    $('#updateGroup').modal('show')
    const access_token = localStorage.getItem('access')

    selectedEmails = [];


    // 저장된 그룹 정보 서버로부터 가져오기
    const response = await fetch(`${back_url}/user/group/`, {
        headers: {
            'content-type': 'application/json',
            'Authorization': `Bearer ${access_token}`,
        },
        method: 'GET',
    })
    const response_json = await response.json()

    $('#update-usersearch').val("")

    const selectedIndex = document.getElementById('select_group').value

    $('#update-selected-email-ul').empty()

    response_json.forEach((group, index) => {
        let id = group['id']
        let name = group['name']
        let members = group['members']

        // 선택한 그룹 id와 일치하는 경우
        if (parseInt(selectedIndex) === parseInt(id)) {
            updatingGroupId = id;
            let groupName = document.getElementById('update-groupname')
            let groupMembers = document.getElementById('update-selected-email-ul')

            groupName.value = name

            const membersArray = members.split(',')

            membersArray.forEach((member, index) => {
                let temp_html = `
                        <li class="selected_email" style="list-style-type: none; margin-bottom: 10px;">
                        ${member}
                        <input type="radio" id="selected_update_email_${index}" name="checked_email_radio" value="${index}" onclick="updateHandleRadioClick()">
                        </li>
                    `;
                groupMembers.innerHTML += temp_html;
                // 기존 이메일을 배열에 추가
                existingEmails.push(member.trim());
            })

        }
    })
}

// 그룹 수정창이 닫힐 때
$(document).ready(function () {
    $('#updateGroup').on('hidden.bs.modal', function () {
        // 모달이 닫힐 때 입력 필드 초기화
        $('#update-usersearch').val("");
        $('#update-groupname').val("");
        $('.selected-email').empty();
        $('#email-list').empty();
        $("#update-selected-email-ul").empty(); // 선택된 그룹 멤버도 초기화
        existingEmails = []; // 기존 이메일 배열 초기화

        // 라디오 버튼 체크 해제
        $('input[type=radio]').prop('checked', false);
        $('.custom-class').removeClass('custom-class');
    });
});


// 멤버 이메일 검색
async function updateAddMember() {
    const access_token = localStorage.getItem("access")
    const membersEmail = document.getElementById("update-usersearch").value
    const membersEmailInput = document.getElementById("update-usersearch")

    membersEmailInput.classList.remove("custom-class");

    // 이메일이 입력되지 않은 경우
    if (!membersEmail) {
        showToast('이메일을 입력해주세요!')
        membersEmailInput.classList.add("custom-class")
        return
    }
    const url = `${backend_base_url}/user/userlist?usersearch=${membersEmail}`

    axios.get(url).then(response => {
        const emails = response.data.map(item => item.email);


        var email = document.getElementById("update-email-ul");
        email.innerHTML = "";

        // 검색 결과 처리
        emails.forEach((useremail, index) => {
            let temp_html = `
            <li style="list-style-type: none; margin-bottom: 10px;">
                ${useremail}
                <input type="radio" id="update_email_${index}" name="email_radio" value="${index}">
              
            </li>
          `;
            email.innerHTML += temp_html;
        });
    })
        .catch(error => {
            // 에러 처리
            showToast('문제가 발생했습니다!')
        });
}

// 멤버 추가 버튼 클릭 시 이메일 리스트에 추가
function updateAddMembersToGroup() {
    const checkedInput = document.querySelector('input[name="email_radio"]:checked');

    // 선택된 이메일이 없을 경우
    if (!checkedInput) {
        showToast('선택한 이메일이 없습니다!')
        return
    }

    if (checkedInput) {

        const selectedEmail = checkedInput.previousSibling.textContent.trim(); // 선택된 이메일 텍스트 가져오기

        // 이미 추가된 이메일인지 확인
        const alreadyAdded = selectedEmails.includes(selectedEmail);

        // 기존 이메일인지 확인
        const existingEmail = existingEmails.includes(selectedEmail);

        // 추가되지 않았거나 기존 이메일이 아닌 경우
        if (!alreadyAdded && !existingEmail) {
            Array.prototype.push.apply(selectedEmails, existingEmails);

            if (!selectedEmails.includes(selectedEmail)) {
                selectedEmails.push(selectedEmail);
            }

            // 선택된 이메일을 ul에 추가
            const selectedEmailUl = document.getElementById("update-selected-email-ul");
            const newEmailLi = document.createElement("li")
            newEmailLi.className = "selected_email"
            newEmailLi.style = "list-style-type: none; margin-bottom: 10px;"

            // input 태그 추가
            const newInput = document.createElement("input");
            newInput.type = "radio"
            newInput.name = "checked_email_radio"


            // 이메일 추가
            const textNode = document.createTextNode(" ")
            const emailText = document.createTextNode(selectedEmail)
            newEmailLi.appendChild(textNode)
            newEmailLi.appendChild(emailText)
            newEmailLi.appendChild(newInput)
            selectedEmailUl.appendChild(newEmailLi)

        } else {
            showToast("이미 추가된 이메일입니다.");
        }

    }
    $('input[type=radio]').prop('checked', false);
}

// 그룹 저장 전 선택한 이메일 리스트에서 제거하는 함수
async function updateDeleteMembers() {
    const checkedInput = document.querySelector('input[name="checked_email_radio"]:checked');
    if (checkedInput) {
        const selectedEmail = checkedInput.previousSibling.textContent.trim(); // 선택된 이메일 텍스트 가져오기

        const selectedEmailIndex = selectedEmails.indexOf(selectedEmail);

        selectedEmails.splice(selectedEmailIndex, 1); // 선택된 이메일 삭제

        checkedInput.parentElement.remove(); // 선택된 이메일 리스트에서 삭제
    }
    else {
        showToast("선택된 이메일이 없습니다.");
    }
    $('input[type=radio]').prop('checked', false);
}

// 그룹 수정 등록
async function updateGroup() {
    const access_token = localStorage.getItem("access")
    const groupName = document.getElementById("update-groupname").value
    const groupNameInput = document.getElementById("update-groupname")

    const membersList = document.getElementsByClassName("selected_email") // \n이 포함되어서 정규표현식을 사용해야함

    const membersEmails = [];

    for (const element of membersList) {
        // `tagName` 속성을 사용해 "li" 태그만 선택
        if (element.tagName.toLowerCase() === "li") {
            const emailContent = element.textContent.trim(); // 공백제거 추가
            const regex = /[\w._%+-]+@[\w.-]+\.[A-Za-z]{2,}/g
            const email = emailContent.match(regex)
            if (email) {
                membersEmails.push(email[0])
            }
        }
    }
    // 멤버 id 저장용 빈 배열 준비
    const memberIdList = [];

    // 멤버 이메일을 반복하면서 각각 서버로 전송하여 멤버 객체를 받아옴
    for (const memberEmail of membersEmails) {
        // 특수문자가 올바르게 전송되도록 보장하기 위해 인코딩한 후 쿼리 매개변수로 전달한다
        const membersResponse = await fetch(`${backend_base_url}/user/userlist?usersearch=${encodeURIComponent(memberEmail)}`);
        const membersData = await membersResponse.json();
        // 해당 멤버의 id를 리스트에 추가
        const memberId = membersData[0].id;
        memberIdList.push(memberId);
    }

    const requestData = {
        name: groupName,
        members: memberIdList
    };

    // members 배열 요소를 문자열로 바꾸고 콤마로 구분
    const dataToServer = {
        name: requestData.name,
        members: requestData.members
    };

    const response = await fetch(`${backend_base_url}/user/group/${updatingGroupId}/`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + access_token,
        },
        method: 'PATCH',
        body: JSON.stringify(dataToServer)
    });

    if (!groupName) {

        showToast('그룹 이름을 적어주세요')
        groupNameInput.classList.add("custom-class");
        return;
    }

    if (response.status == 200) {
        showToast("그룹이 수정되었습니다.")
        window.location.reload()
    } else {
        const data = await response.json();
        if (data.message) {
            showToast("※ " + data.message);
        } else if (data["non_field_errors"]) {
            showToast("※ " + data["non_field_errors"])
        }
    }
}
async function deleteGroupModal() {
    const selected_id = document.getElementById('select_group').value
    const selectedOption = document.getElementById('select_group').options[document.getElementById('select_group').selectedIndex];
    const selected_name = selectedOption.text;

    $('#modal-body').empty()
    $('#modal-footer').empty()

    let temp_html = `<p>[${selected_name}] 그룹을 삭제하시겠습니까?</p>`

    $('#modal-body').append(temp_html)

    let temp_html2 = `<button type="button" class="btn" data-bs-dismiss="modal"
                        style="background-color: #7689b1; border-color: #7689b1; color:white;">Close</button>
                      <button type="button" class="btn"
                        style="background-color: #485D86; border-color: #485D86; color:white; margin: 0px 10px;"
                        onclick="handleGrouptrash('${selected_id}','${selected_name}')">Delete</button>`

    $('#modal-footer').append(temp_html2)
}

async function loadGroupMembers() {

    const selectedGroup = group_data.find(group => group.id == $('#select_group').val());
    const membersArray = selectedGroup.members.split(',');
    const filteredMembers = membersArray.filter(member => member.trim() !== selectedGroup.master);

    $('#members-list').empty()


    let temp_html = `<li class="dropdown-item">${selectedGroup.master}</li>
                        <hr class="dropdown-divider"/>`;

    filteredMembers.forEach(member => {
        temp_html += `<li class="dropdown-item">${member}</li>`;
    });

    $('#members-list').append(temp_html);
}

let access_token = localStorage.getItem('access')
let back_url = 'https://api.miyeong.net'
// let back_url = 'http://127.0.0.1:8000'

const userPayload = localStorage.getItem('payload')
const userPayloadJson = JSON.parse(userPayload)
const userEmail = userPayloadJson['email']

async function getGroup() {
    const response = await fetch(`${back_url}/user/group/`, {
        headers: {
            'content-type': 'application/json',
            'Authorization': `Bearer ${access_token}`,
        },
        method: 'GET',
    })
    const response_json = await response.json()
    // $('#select_group').empty()
    response_json.forEach((a, index) => {
        let id = a['id']
        let name = a['name']
        let temp_html = `<option value="${id}">${name}</option>`
        // 페이지 그룹 샐랙트
        $('#select_group').append(temp_html)
        // 모달 그룹 샐랙트
        $('#group_name').append(temp_html)

        // 첫번째 그룹 노트 리스트 보여주기
        if (index === 0) {
            $('#select_group').val(id);
            showNoteList();
        }
    })
    return response_json
}
getGroup()


async function showNoteList() {
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
                                <section class="cp-card content" style="background-color: #d9e2f6;">
                                </section>
                            </a>
                        `
        $('#note_list').append(temp_html2);
        response_json.forEach((a) => {
            console.log(a)
            const category = a['category']
            const name = a['name']
            const note_id = a['id']

            let temp_html = `
                                <a href="/plan_page.html?note_id=${note_id}" onclick="saveLocalNoteName('${name}')" style='text-decoration:none; color:black;'>
                                    <section class="cp-card content" style="background-image: url('/css/note_img/note_${category}.png');">
                                    <div class="thumb">
                                    </div>
                                    </section>
                                    <div style="text-align: center;">${name}</div>
                                </a>
                            `
            $('#note_list').append(temp_html);
        })
    }
}

showNoteList()
// handleGroups()

async function saveNote() {
    let radios = Array.from(document.getElementsByName('note_category'));
    let selected = radios.find(radio => radio.checked);
    const group_name = document.getElementById("group_name").value

    if (group_name == '-1') {
        alert('그룹을 선택해주세요!')
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
            alert("새로운 노트가 생성되었습니다!")
            window.location.href = `/plan_page.html?note_id=${response_json['id']}`

        }
        else {
            alert(response_json)

            const regex = /string='([^']+)'/;
            const match = JSON.stringify(response_json).match(regex)

            if (match && match.length > 1) {
                const cleanedString = match[1].replace("string=", "");
                alert("※ " + cleanedString);

            }
        }

    } else {
        alert('표지를 선택해 주세요!')
    }

}

function saveLocalNoteName(note_name) {
    localStorage.setItem('noteName', note_name);
}

let updatingGroupId;

function updateHandleRadioClick() {
    const selectedRadio = document.querySelector('input[name="email_radio"]:checked');

    if (selectedRadio) {
        const selectedEmail = selectedRadio.nextSibling.textContent.trim();
        document.getElementById("update-usersearch").value = selectedEmail;

        // updateAddMembersToGroup();
    } else {
        alert("선택된 이메일이 없습니다.");
    }
}

// 기존 이메일을 저장할 배열
let existingEmails = [];

// 그룹 수정 모달창
async function groupUpdateModal() {
    $('#updateGroup').modal('show')
    const access_token = localStorage.getItem('access')

    selectedEmails = [];

    const response = await fetch(`${back_url}/user/group/`, {
        headers: {
            'content-type': 'application/json',
            'Authorization': `Bearer ${access_token}`,
        },
        method: 'GET',
    })
    const response_json = await response.json()

    const selectedIndex = document.getElementById('select_group').value
    console.log("selectedIndex", selectedIndex)

    response_json.forEach((group, index) => {
        let id = group['id']
        let name = group['name']
        let members = group['members']

        if (parseInt(selectedIndex) === parseInt(id)) {
            console.log(id, name, members)
            updatingGroupId = id;
            console.log(updatingGroupId)
            let groupName = document.getElementById('update-groupname')
            let groupMembers = document.getElementById('update-selected-email-ul')

            groupName.value = name

            const membersArray = members.split(',')

            membersArray.forEach((member, index) => {
                console.log("멤버", members)
                let temp_html = `
                        <li class="selected_email">
                        <input type="radio" id="selected_update_email_${index}" name="email_radio" value="${index}" onclick="updateHandleRadioClick()">
                        ${member}
                        </li>
                    `;
                groupMembers.innerHTML += temp_html;
                // 기존 이메일을 배열에 추가
                existingEmails.push(member.trim());
            })

        }
    })
}


// 멤버 검색
async function updateAddMember() {
    console.log("addmember")
    const access_token = localStorage.getItem("access")
    const membersEmail = document.getElementById("update-usersearch").value
    console.log("emailinput", membersEmail)

    const url = `${backend_base_url}/user/userlist?usersearch=${membersEmail}`

    axios.get(url).then(response => {
        console.log(response.data);

        const emails = response.data.map(item => item.email);


        var email = document.getElementById("update-email-ul");
        email.innerHTML = "";

        // 검색 결과 처리
        emails.forEach((useremail, index) => {
            let temp_html = `
            <li>
              <input type="radio" id="update_email_${index}" name="email_radio" value="${index}" onclick="updateHandleRadioClick()">
              ${useremail}
            </li>
          `;
            email.innerHTML += temp_html;
        });
    })
        .catch(error => {
            // 에러 처리
            alert('문제가 발생했습니다!')
        });
}

// 멤버 추가 버튼 클릭 시 선택된 이메일 리스트를 서버로 전송
function updateAddMembersToGroup() {
    // 선택한 input 요소의 value 속성을 배열에 push
    const checkedInput = document.querySelector('input[name="email_radio"]:checked');

    if (checkedInput) {

        const selectedEmail = checkedInput.nextSibling.textContent.trim(); // 선택된 이메일 텍스트 가져오기

        // 이미 추가된 이메일인지 확인
        const alreadyAdded = selectedEmail.includes(selectedEmail);

        // 기존 이메일인지 확인
        const existingEmail = existingEmails.includes(selectedEmail);

        if (!alreadyAdded && !existingEmail) {
            selectedEmail.push(selectedEmail); console.log(selectedEmail);
            console.log('selectedEmails', selectedEmail)

            // 선택된 이메일을 ul에 추가
            const selectedEmailUl = document.getElementById("update-selected-email-ul");
            const newEmailLi = document.createElement("li");
            newEmailLi.className = "selected_email"

            // input 태그 추가
            const newInput = document.createElement("input");
            newInput.type = "radio";
            // newInput.id = `selected_update_email_${index}`;
            newInput.name = "checked_email_radio";
            // newInput.onclick = () => updateHandleRadioClick();
            newEmailLi.appendChild(newInput);

            // 이메일 추가
            const textNode = document.createTextNode(" ");
            const emailText = document.createTextNode(selectedEmail);
            newEmailLi.appendChild(textNode);
            newEmailLi.appendChild(emailText);

            selectedEmailUl.appendChild(newEmailLi);
        } else {
            alert("이미 추가된 이메일입니다.");
        }

    } else {
        alert("선택된 이메일이 없습니다.")
    }
}

// 그룹 수정 등록
async function updateGroup() {
    console.log("updatingGroupId:", updatingGroupId)
    const access_token = localStorage.getItem("access")
    const groupName = document.getElementById("update-groupname").value
    console.log('groupName', groupName)

    const membersList = document.getElementsByClassName("selected_email")
    console.log('membersList', membersList) // \n이 포함되어서 정규표현식을 사용해야함

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
    // const membersEmails = Array.from(membersList.getElementsByTagName("li")).map(li => li.textContent);
    console.log(membersEmails)
    // 멤버 id 저장용 빈 배열 준비 manytomany 필드는 id값이 리스트 일력해야 값이 들어감
    const memberIdList = [];

    // 멤버 이메일을 반복하면서 각각 서버로 전송하여 멤버 객체를 받아옴
    for (const memberEmail of membersEmails) {
        // 특수문자가 올바르게 전송되도록 보장하기 위해 인코딩한 후 쿼리 매개변수로 전달한다
        const membersResponse = await fetch(`${backend_base_url}/user/userlist?usersearch=${encodeURIComponent(memberEmail)}`);
        const membersData = await membersResponse.json();
        console.log('membersData', membersData)
        // 해당 멤버의 id를 리스트에 추가
        const memberId = membersData[0].id;
        console.log('memberId', memberId)
        memberIdList.push(memberId);
        console.log("멤버아이디리스트", memberIdList)
    }

    const requestData = {
        name: groupName,
        members: memberIdList
    };
    console.log("requestData", requestData)

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

    if (response.status == 200) {
        alert("그룹이 수정되었습니다.")
        window.location.reload()
    } else {
        alert(response.error)
    }
}

// 그룹 삭제 모달
async function groupDeleteModal() {
    $('#deleteGroup').modal('show')
    console.log("Deleting group ID:", updatingGroupId);
}

// 그룹 삭제
async function deleteGroupConfirm() {
    const access_token = localStorage.getItem('access')
    const response = await fetch(`${back_url}/user/group/`, {
        headers: {
            'content-type': 'application/json',
            'Authorization': `Bearer ${access_token}`,
        },
        method: 'GET',
    })
    const response_json = await response.json()

    const selectedIndex = document.getElementById('select_group').value
    console.log("selectedIndex", selectedIndex)

    response_json.forEach((group, index) => {
        let id = group['id']
        let name = group['name']
        let members = group['members']
        let master = group['master']
        console.log("마스터", master)

        if (parseInt(selectedIndex) === parseInt(id)) {
            console.log(id, name, members)
            updatingGroupId = id;
            console.log(updatingGroupId)
        }
    })

    const deleteResponse = await fetch(`${backend_base_url}/user/group/${updatingGroupId}/`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + access_token,
        },
        method: 'DELETE',
    })

    if (deleteResponse.ok) {
        alert("삭제되었습니다!");
        window.location.replace(`${frontend_base_url}/index.html`)
    } else {
        const response_json = await deleteResponse.json()
        alert(`오류가 발생했습니다: ${response_json}`)
    }
}
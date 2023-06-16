let access_token = localStorage.getItem('access')
let back_url = "http://127.0.0.1:8000"

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
                                <section class="cp-card content" style="background-color: #dff2f9;">
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
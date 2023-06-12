let access_token = localStorage.getItem('access')
let back_url = 'https://api.miyeong.net'


async function getGroup() {
    const response = await fetch(`${back_url}/user/group/`, {
        headers: {
            'content-type': 'application/json',
            'Authorization': `Bearer ${access_token}`,
        },
        method: 'GET',
    })
    const response_json = await response.json()
    response_json.forEach((a) => {
        let id = a['id']
        let name = a['name']
        let temp_html = `<option value="${id}">${name}</option>`
        $('#select_group').append(temp_html)
    })
    console.log(response_json)
}
getGroup()


async function showNoteList() {
    const group_id = document.getElementById("select_group").value
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
                            <a href="/plan_page.html?note_id=${note_id}" style='text-decoration:none; color:black;'>
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

showNoteList()


async function saveNote() {
    let radios = Array.from(document.getElementsByName('note_category'));
    let selected = radios.find(radio => radio.checked);
    const group_name = document.getElementById("group_name").value
    const note_name = document.getElementById("note_name").value
    let category_value;
    if (selected) {
        category_value = selected.value;

        const response = await fetch(`${back_url}/note/`, {

            headers: {
                "Content-Type": "application/json",
                "Authorization": `${access_token}`
            },
            method: "POST",
            body: JSON.stringify({
                "group": group_name,
                "category": category_value,
                "name": note_name
            })
        });
        if (response.status == 201) {
            alert("새로운 노트가 생성되었습니다!")
            window.location.reload()
        }
        else {
            const response_json = await response.json()
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
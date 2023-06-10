let access_token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjg2NDUyNDM1LCJpYXQiOjE2ODYzNjYwMzUsImp0aSI6ImVkOWE4NzU1MDcxZTQyZTY5YjVjMjQ4OTg3MTUxMzkwIiwidXNlcl9pZCI6MSwibmlja25hbWUiOiJtaXllb25nIiwiZW1haWwiOiJtaXllb25nQG5hdmVyLmNvbSIsImlzX2FkbWluIjp0cnVlfQ.UJhoL0NgWtrnjRw6oG9qg_WuW_KcZdxcyb5u6Fy74SE'
let back_url = 'https://api.miyeong.net'
async function showNoteList() {
    const response = await fetch(`${back_url}/note/1`, {
        headers: {
            'content-type': 'application/json',
            "Authorization": `${access_token}`,
        },
        method: 'GET',
    })
    const response_json = await response.json()
    // $('#note_list').empty()
    response_json.forEach((a) => {
        console.log(a)
        const category = a['category']
        const group = a['group']
        const name = a['name']
        const note_id = a['id']

        let temp_html = `
                            <a href="/plan_page.html?note_id=${note_id}" style='text-decoration:none; color:black;'>
                                <section class="cp-card content" style="background-image: url('/css/note_img/note_${category}.png');">
                                <div class="thumb">
                                </div>
                                </section>
                                <div style="text-align: center;">${name}</div>
                                <div style="text-align: center;">${group}</div>
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
async function getTrash() {
    let token = localStorage.getItem("access")

    const response = await fetch(`${backend_base_url}/note/trash`, {
        headers: {
            'content-type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        method: 'GET',
    })

    if (response.status == 200) {
        const response_json = await response.json()
        return response_json
    } else {
        alert("불러오는데 실패했습니다")
    }
}

async function loadTrash(contentType) {
    const response = await getTrash()
    console.log(response)

    const groups = response.group
    const notes = response.note
    const photos = response.photo

    $('#trash-content').empty()
    $('#modal-footer').empty()

    if (contentType === 'group') {
        groups.forEach((group) => {
            const group_id = group.id
            const group_name = group.name
            const group_created_at = group.created_at

            let temp_html = `<div style="margin-top:15px;">
                                <input type="radio" name="photo-trash" value="1" style="width:10px">
                                ${group_name} | ${group_created_at}
                            </div>`

            $('#trash-content').append(temp_html)
        });
        let temp_html2 = `<button type="button" class="btn btn-primary" onclick="handleGrouptrash('${group_id}','${group_name}')"
                            style="background-color:  #60749d;">복원</button>
                          <button type="button" class="btn btn-primary" onclick=""
                            style="background-color: #1F489A;">삭제</button>`

        $('#modal-footer').append(temp_html2)

    } else if (contentType === 'note') {
        notes.forEach((note) => {
            const note_id = note.id
            const note_name = note.name
            const group = note.group
            const note_created_at = note.created_at
            const category = note.category

            let temp_html = `<div style="display: inline-flex; flex-direction: column; align-items: center; padding-left:20px">
                                <img src="/css/note_img/note_${category}.png" alt="Image description" style="width: 130px; height: 160px; margin-top:15px">
                                ${note_name}
                                <input type="radio" name="photo-trash" value="1" style="width:10px">
                            </div>`

            $('#trash-content').append(temp_html)
        });
        let temp_html2 = `<button type="button" class="btn btn-primary" onclick="handleNotetrash('${note_id}','${note_name}','${group}')"
                            style="background-color:  #60749d;">복원</button>
                          <button type="button" class="btn btn-primary" onclick=""
                            style="background-color: #1F489A;">삭제</button>`

        $('#modal-footer').append(temp_html2)

    } else if (contentType === 'photo') {
        photos.forEach((photo) => {
            const photo_id = photo.id
            const photo_name = photo.name
            const photo_created_at = photo.created_at
            const photo_location = photo.location
            const image = backend_base_url + '/note' + photo.image

            let temp_html = `<div style="display: inline-flex; flex-direction: column; align-items: center; padding-left:7px">
                                <img src="${image}" alt="Image description" style="width: 142px; height: 142px; margin-top:15px">
                                ${photo_name}
                                <input type="radio" name="photo-trash" value="1" style="width:10px">
                             </div>`

            $('#trash-content').append(temp_html)
        });
        let temp_html2 = `<button type="button" class="btn btn-primary" onclick="handlePhototrash('${photo_id}','${photo_location}')"
                            style="background-color:  #60749d;">복원</button>
                          <button type="button" class="btn btn-primary" onclick=""
                            style="background-color: #1F489A;">삭제</button>`

        $('#modal-footer').append(temp_html2)
    }
}


async function handlePhototrash(photo_id, location) {
    let token = localStorage.getItem("access")

    const response = await fetch(`${backend_base_url}/note/trash/${photo_id}`, {
        headers: {
            'content-type': 'application/json',
            "Authorization": `Bearer ${token}`
        },
        method: 'POST',
        body: JSON.stringify({
            "location": location,
        })
    })

    if (response.status == 200) {
        const response_json = await response.json()
        window.location.reload()
        return response_json
    }
    else {
        alert("※실패")
        console.log(photo_id)
    }
}

async function handleNotetrash(note_id, name, group) {
    let token = localStorage.getItem("access")

    const response = await fetch(`${backend_base_url}/note/trash/${note_id}`, {
        headers: {
            'content-type': 'application/json',
            "Authorization": `Bearer ${token}`
        },
        method: 'POST',
        body: JSON.stringify({
            "name": name,
            "group": group,
        })
    })

    if (response.status == 200) {
        const response_json = await response.json()
        window.location.reload()
        return response_json
    }
    else {
        alert("※실패")
        console.log(photo_id)
    }
}

async function handleGrouptrash(group_id, name) {
    let token = localStorage.getItem("access")

    const response = await fetch(`${backend_base_url}/note/trash/${group_id}`, {
        headers: {
            'content-type': 'application/json',
            "Authorization": `Bearer ${token}`
        },
        method: 'POST',
        body: JSON.stringify({
            "name": name,
        })
    })

    if (response.status == 200) {
        const response_json = await response.json()
        window.location.reload()
        return response_json
    }
    else {
        alert("※실패")
        console.log(photo_id)
    }
}

function handleTrashRadio(id) {
    var selectedRadio = document.querySelector('input[name="photo-trash"]:checked');
    if (selectedRadio) {
        let selectedIndex = selectedRadio.value;
        let selected_address = document.getElementById(`address_${selectedIndex}`).innerText;
        let selected_name = document.getElementById(`name_${selectedIndex}`).innerText;
        let location_x = document.getElementById(`x_${selectedIndex}`).value;
        let location_y = document.getElementById(`y_${selectedIndex}`).value;
        let name = selected_name.split('/')[0].trim();
        let splitName = selected_name.split('/');
        let category = splitName[splitName.length - 1].trim();
        // 선택한 요소에 대한 처리
        document.getElementById("location").value = selected_address;
        document.getElementById("title").value = name;
        document.getElementById("location_x").value = location_x;
        document.getElementById("location_y").value = location_y;
        document.getElementById("category").value = category;
    }
}
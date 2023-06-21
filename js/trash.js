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
        groups.forEach((group, index) => {
            const group_id = group.id
            const group_name = group.name
            const group_created_at = group.created_at

            let temp_html = `<div style="margin-top:15px;">
                                <input type="radio" name="trash-radio" value="${index}" style="width:10px" onclick="handleTrashRadio('group')">
                                <a id='name_${index}'>${group_name} | ${group_created_at}</a>
                                <input id='id_${index}' value="${group_id}" hidden>
                            </div>`

            $('#trash-content').append(temp_html)
        });
        let temp_html2 = `<button type="button" class="btn btn-primary" onclick="handleTrashRestore()"
                            style="background-color:  #60749d;">복원</button>
                          <button type="button" class="btn btn-primary" onclick=""
                            style="background-color: #1F489A;">삭제</button>`

        $('#modal-footer').append(temp_html2)

    } else if (contentType === 'note') {
        notes.forEach((note, index) => {
            const note_id = note.id
            const note_name = note.name
            const group = note.group
            const note_created_at = note.created_at
            const category = note.category

            let temp_html = `<div style="display: inline-flex; flex-direction: column; align-items: center; padding-left:20px">
                                <img src="/css/note_img/note_${category}.png" alt="Image description" style="width: 130px; height: 170px; margin-top:15px">
                                <a id='name_${index}'>${note_name}</a>
                                <input id='id_${index}' value="${note_id}" hidden>
                                <input id='group_${index}' value="${group}" hidden>
                                <input type="radio" name="trash-radio" value="${index}" style="width:10px" onclick="handleTrashRadio('note')">
                            </div>`

            $('#trash-content').append(temp_html)
        });
        let temp_html2 = `<button type="button" class="btn btn-primary" onclick="handleTrashRestore()"
                            style="background-color:  #60749d;">복원</button>
                          <button type="button" class="btn btn-primary" onclick=""
                            style="background-color: #1F489A;">삭제</button>`

        $('#modal-footer').append(temp_html2)

    } else if (contentType === 'photo') {
        photos.forEach((photo, index) => {
            const photo_id = photo.id
            const photo_name = photo.name
            const photo_created_at = photo.created_at
            const photo_location = photo.location
            const image = backend_base_url + '/note' + photo.image

            let temp_html = `<div style="display: inline-flex; flex-direction: column; align-items: center; padding-left:7px">
                                <img src="${image}" alt="Image description" style="width: 142px; height: 142px; margin-top:15px">
                                <a id='name_${index}'>${photo_name}</a>
                                <input type="radio" name="trash-radio" value="${index}" style="width:10px" onclick="handleTrashRadio('photo')">
                                <input id='id_${index}' value="${photo_id}" hidden>
                                <input id='location_${index}' value="${photo_location}" hidden>
                             </div>`

            $('#trash-content').append(temp_html)
        });
        let temp_html2 = `<button type="button" class="btn btn-primary" onclick="handleTrashRestore()"
                            style="background-color:  #60749d;">복원</button>
                          <button type="button" class="btn btn-primary" onclick=""
                            style="background-color: #1F489A;">삭제</button>`

        $('#modal-footer').append(temp_html2)
    }
}


async function handlePhototrash(photo_id,name, location) {
    let token = localStorage.getItem("access")

    const response = await fetch(`${backend_base_url}/note/trash/${photo_id}`, {
        headers: {
            'content-type': 'application/json',
            "Authorization": `Bearer ${token}`
        },
        method: 'POST',
        body: JSON.stringify({
            "location": location,
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

let selectedGroupIndex = null;
let selectedNoteIndex = null;
let selectedPhotoIndex = null;

function handleTrashRadio(contentType) {
    var selectedRadio = document.querySelector('input[name="trash-radio"]:checked');
    let selectedIndex = selectedRadio.value;

    if (contentType === 'group') {
        selectedGroupIndex = selectedIndex;
    }

    if (contentType === 'note') {
        selectedNoteIndex = selectedIndex;
    }

    if (contentType === 'photo') {
        selectedPhotoIndex = selectedIndex;
    }
}

function handleTrashRestore() {
    var selectedRadio = document.querySelector('input[name="trash-radio"]:checked');
    let selectedIndex = selectedRadio.value;
    let selected_id = document.getElementById(`id_${selectedIndex}`).value;
    let selected_name = document.getElementById(`name_${selectedIndex}`).innerText;
    let name = selected_name.split('|')[0].trim();

    if (selectedGroupIndex !== null) {
        handleGrouptrash(selected_id, name);}

    if (selectedNoteIndex !== null) {
        const selected_group = document.getElementById(`group_${selectedIndex}`).value;
        handleNotetrash(selected_id, selected_name, selected_group)
    }

    if (selectedPhotoIndex !== null) {
        const selected_location = document.getElementById(`location_${selectedIndex}`).value;
        handlePhototrash(selected_id,selected_name, selected_location)
    }

}
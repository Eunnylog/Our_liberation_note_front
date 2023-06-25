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
        console.log(response_json)
        return response_json
    } else {
        showToast("불러오는데 실패했습니다")
    }
}

if (localStorage.getItem("payload")) {
    getTrash().then(response => {
        const groups = response.group;
        const notes = response.note;
        const photos = response.photo;

        const trashCount = groups.length + notes.length + photos.length;

        localStorage.setItem('trashCount', trashCount.toString());

        const trashCountElement = document.getElementById('trash-count');
        trashCountElement.innerText = trashCount.toString();
    });
}

async function loadTrash(contentType) {
    const response = await getTrash()

    const groups = response.group
    const notes = response.note
    const photos = response.photo

    $('#trash-content').empty()
    $('#trash-modal-footer').empty()


    if (contentType === 'group') {
        if (groups.length === 0) {
            let trashImage = `<div style="display: flex; justify-content: center; align-items: center; height: 100%;">
            <img src="/css/assets/trash.png" alt="Empty Group Image" style="width:150px; height:150px; margin-top:50px;">
            </div>`;
            $('#trash-content').append(trashImage);

            let temp_html2 = `<button type="button" class="btn btn-primary" 
                            style="background-color:  #7689b1; border-color: #7689b1;">복원</button>
                          <button type="button" class="btn btn-primary" 
                            style="background-color: #485d86; border-color: #485d86;">삭제</button>`

            $('#trash-modal-footer').append(temp_html2)

        } else {
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
                            style="background-color:  #7689b1; border-color: #7689b1;">복원</button>
                          <button type="button" class="btn btn-primary" onclick="handleTrashDelete()"
                            style="background-color: #485d86; border-color: #485d86;">삭제</button>`

            $('#trash-modal-footer').append(temp_html2)
        }
    }
    else if (contentType === 'note') {
        if (notes.length === 0) {
            let trashImage = `<div style="display: flex; justify-content: center; align-items: center; height: 100%;">
            <img src="/css/assets/trash.png" alt="Empty Group Image" style="width:150px; height:150px; margin-top:50px;">
            </div>`;
            $('#trash-content').append(trashImage);

            let temp_html2 = `<button type="button" class="btn btn-primary" 
                            style="background-color:  #7689b1; border-color: #7689b1;">복원</button>
                          <button type="button" class="btn btn-primary" 
                            style="background-color: #485d86; border-color: #485d86;">삭제</button>`

            $('#trash-modal-footer').append(temp_html2)

        } else {
            notes.forEach((note, index) => {
                const note_id = note.id
                const note_name = note.name
                const group = note.group
                const note_created_at = note.created_at
                const category = note.category

                let temp_html = `<div style="display: inline-flex; flex-direction: column; align-items: center; padding-left:20px">
                                <img src="/css/note_img/note_${category}.png" alt="Image description" style="width: 130px; height: 170px; margin-top:15px;">
                                <a id='name_${index}'>${note_name}</a>
                                <input id='id_${index}' value="${note_id}" hidden>
                                <input id='group_${index}' value="${group}" hidden>
                                <input type="radio" name="trash-radio" value="${index}" style="width:10px" onclick="handleTrashRadio('note')">
                            </div>`

                $('#trash-content').append(temp_html)
            });
            let temp_html2 = `<button type="button" class="btn btn-primary" onclick="handleTrashRestore()"
                            style="background-color:  #7689b1; border-color: #7689b1;">복원</button>
                          <button type="button" class="btn btn-primary" onclick="handleTrashDelete()"
                            style="background-color: #485d86; border-color: #485d86;">삭제</button>`

            $('#trash-modal-footer').append(temp_html2)
        }
    }
    else if (contentType === 'photo') {
        if (photos.length === 0) {
            let trashImage = `<div style="display: flex; justify-content: center; align-items: center; height: 100%;">
            <img src="/css/assets/trash.png" alt="Empty Group Image" style="width:150px; height:150px; margin-top:50px;">
            </div>`;
            $('#trash-content').append(trashImage);

            let temp_html2 = `<button type="button" class="btn btn-primary" 
                            style="background-color:  #7689b1; border-color: #7689b1;">복원</button>
                          <button type="button" class="btn btn-primary" 
                            style="background-color: #485d86; border-color: #485d86;">삭제</button>`

            $('#trash-modal-footer').append(temp_html2)

        } else {
            photos.forEach((photo, index) => {
                const photo_id = photo.id
                const photo_title = photo.title
                const photo_name = photo.name
                const photo_created_at = photo.created_at
                const photo_location = photo.location
                const image = backend_base_url + '/note' + photo.image

                let temp_html = `<div style="display: inline-flex; flex-direction: column; align-items: center; padding-left:10px;">
                                    <img src="${image}" alt="Image description" style="width: 135px; height: 135px; margin-top:15px;">
                                    <a id='name_${index}'>${photo_name}</a>
                                    <input type="radio" name="trash-radio" value="${index}" style="width:10px" onclick="handleTrashRadio('photo')">
                                    <input id='id_${index}' value="${photo_id}" hidden>
                                    <input id='location_${index}' value="${photo_location}" hidden>
                                    <input id='title_${index}' value="${photo_title}" hidden>
                                </div>`

                $('#trash-content').append(temp_html)
            });
            let temp_html2 = `<button type="button" class="btn btn-primary" onclick="handleTrashRestore()"
                            style="background-color:  #7689b1; border-color: #7689b1;">복원</button>
                          <button type="button" class="btn btn-primary" onclick="handleTrashDelete()"
                            style="background-color: #485d86; border-color: #485d86;">삭제</button>`

            $('#trash-modal-footer').append(temp_html2)
        }
    }

    // 모든 버튼 요소 가져오기
    const buttons = document.querySelectorAll(".trash-toggle button");

    // 모든 버튼의 색상 초기화
    buttons.forEach(button => {
        button.classList.remove("active");
    });

    // 선택한 버튼의 색상 변경
    const selectedButton = document.getElementById(contentType + "Button");
    selectedButton.classList.add("active");
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

    if (response.status == 202) {
        const response_json = await response.json()
        showToast(`※ [${name}] 그룹이 정상적으로 삭제되었습니다.`)
        setTimeout(function () {
            window.location.reload();
        }, 1000);
        return response_json

    } else if (response.status == 200) {
        const response_json = await response.json()
        showToast(`※ [${name}] 그룹이 정상적으로 복원되었습니다.`)
        setTimeout(function () {
            window.location.reload();
        }, 1000);
        return response_json

    } else {
        showToast("※실패하였습니다.")
        console.log(photo_id)
    }

}

async function handleNotetrash(note_id, group, name) {
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

    if (response.status == 202) {
        const response_json = await response.json()
        showToast(`※ [${name}] 노트가 정상적으로 삭제되었습니다.`)
        window.location.replace(`${frontend_base_url}/my_diary.html`)
        return response_json

    } else if (response.status == 200) {
        const response_json = await response.json()
        showToast(`※ [${name}] 노트가 정상적으로 복원되었습니다.`)
        setTimeout(function () {
            window.location.reload();
        }, 1000);
        return response_json

    } else {
        showToast("※실패하였습니다.")
        console.log(photo_id)
    }
}

async function handlePhototrash(photo_id, location, title, name) {
    let token = localStorage.getItem("access")

    const response = await fetch(`${backend_base_url}/note/trash/${photo_id}`, {
        headers: {
            'content-type': 'application/json',
            "Authorization": `Bearer ${token}`
        },
        method: 'POST',
        body: JSON.stringify({
            "location": location,
            "title": title,
        })
    })
    if (response.status == 202) {
        const response_json = await response.json()
        showToast(`※ [${name}] 사진이 정상적으로 삭제되었습니다.`)
        setTimeout(function () {
            window.location.reload();
        }, 1000);
        return response_json

    } else if (response.status == 200) {
        const response_json = await response.json()
        showToast(`※ [${name}] 사진이 정상적으로 복원되었습니다.`)
        setTimeout(function () {
            window.location.reload();
        }, 1000);
        return response_json

    } else {
        showToast("※실패하였습니다.")
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

    if (!selectedRadio) {
        showToast("※ 항목을 선택해주세요!");
        return;
    }

    let selectedIndex = selectedRadio.value;
    let selected_id = document.getElementById(`id_${selectedIndex}`).value;
    let selected_name = document.getElementById(`name_${selectedIndex}`).innerText;
    let name = selected_name.split('|')[0].trim();

    if (selectedGroupIndex !== null) {
        handleGrouptrash(selected_id, name);
    }

    if (selectedNoteIndex !== null) {
        const selected_group = document.getElementById(`group_${selectedIndex}`).value;
        handleNotetrash(selected_id, selected_group, selected_name)
    }

    if (selectedPhotoIndex !== null) {
        const selected_location = document.getElementById(`location_${selectedIndex}`).value;
        const selected_title = document.getElementById(`title_${selectedIndex}`).value;
        handlePhototrash(selected_id, selected_location, selected_title, selected_name)
    }

}

async function deleteGroup(group_id) {
    const token = localStorage.getItem('access')
    var userConfirmation = confirm("※ 확인을 누르시면 해당 그룹이 영구삭제됩니다. 삭제하시겠습니까?");

    if (!userConfirmation) {
        return false
    }

    const response = await fetch(`${backend_base_url}/user/group/${group_id}/`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + token,
        },
        method: 'DELETE',
    })

    if (response.status == 204) {
        showToast('※ 삭제되었습니다.')
        setTimeout(function () {
            window.location.reload();
        }, 1000);
    } else {
        showToast('※ 문제가 발생했습니다!')
    }
}

async function deleteNote(note_id) {
    let token = localStorage.getItem("access")
    var userConfirmation = confirm("※ 확인을 누르시면 해당 노트가 영구삭제됩니다. 삭제하시겠습니까?");

    if (!userConfirmation) {
        return false
    }

    const response = await fetch(`${backend_base_url}/note/note-detail/${note_id}`, {
        headers: {
            'content-type': 'application/json',
            "Authorization": `Bearer ${token}`,
        },
        method: 'DELETE',
    });

    if (response.status == 204) {
        showToast('※ 삭제되었습니다.')
        setTimeout(function () {
            window.location.reload();
        }, 1000);
    } else {
        showToast('※ 문제가 발생했습니다!')
    }
}

async function deletePhoto(photo_id) {
    let token = localStorage.getItem("access")
    var userConfirmation = confirm("※ 확인을 누르시면 해당 사진이 영구삭제됩니다. 삭제하시겠습니까?");

    if (!userConfirmation) {
        return false
    }

    const response = await fetch(`${backend_base_url}/note/photo-detail/${photo_id}`, {
        headers: {
            'content-type': 'application/json',
            "Authorization": `Bearer ${token}`,
        },
        method: 'DELETE',
    });

    if (response.status == 204) {
        showToast('※ 삭제되었습니다.')
        setTimeout(function () {
            window.location.reload();
        }, 1000);
    } else {
        showToast('※ 문제가 발생했습니다!')
    }
}

function handleTrashDelete() {
    var selectedRadio = document.querySelector('input[name="trash-radio"]:checked');

    if (!selectedRadio) {
        showToast("※ 항목을 선택해주세요!");
        return;
    }

    let selectedIndex = selectedRadio.value;
    let selected_id = document.getElementById(`id_${selectedIndex}`).value;

    if (selectedGroupIndex !== null) {
        deleteGroup(selected_id);
    }

    if (selectedNoteIndex !== null) {
        deleteNote(selected_id)
    }

    if (selectedPhotoIndex !== null) {
        deletePhoto(selected_id)
    }

}
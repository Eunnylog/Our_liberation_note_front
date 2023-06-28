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
                                style="background-color: #7689b1; border-color: #7689b1;">삭제</button>
                              <button type="button" class="btn btn-primary" 
                                style="background-color: #485d86; border-color: #485d86;">복원</button>`

            $('#trash-modal-footer').append(temp_html2)

        } else {
            groups.forEach((group, index) => {
                const group_id = group.id
                const group_name = group.name
                const group_created_at = group.created_at.slice(0, 13)

                let temp_html = `<div style="margin-top:15px;">
                                <input type="checkbox" name="trash-checkbox" id="trash-checkbox${group_id}" value="${index}" style="width:20px; height: 20px;" onclick="handleTrashCheckbox('group')">
                                <label for="trash-checkbox${group_id}"></label>
                                <span id='name_${index}'>${group_name} | ${group_created_at}</span>
                                <input id='id_${index}' value="${group_id}" hidden>
                                </div>`

                $('#trash-content').append(temp_html)
            });
            let temp_html2 = `<button type="button" class="btn btn-primary" onclick="handleTrashDelete()"
                                style="background-color: #7689b1; border-color: #7689b1;">삭제</button>
                              <button type="button" class="btn btn-primary" onclick="handleTrashRestore()"
                               style="background-color: #485d86; border-color: #485d86;">복원</button>`

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
                                style="background-color: #7689b1; border-color: #7689b1;">삭제</button>
                              <button type="button" class="btn btn-primary" 
                               style="background-color: #485d86; border-color: #485d86;">복원</button>`

            $('#trash-modal-footer').append(temp_html2)

        } else {
            notes.forEach((note, index) => {
                const note_id = note.id
                const note_name = note.name
                const group = note.group
                const note_created_at = note.created_at
                const category = note.category

                let temp_html = `<div style="display: inline-flex; flex-direction: column; align-items: center; padding-left:15px;">
                                <img src="/css/note_img/note_${category}.png" alt="Image description" style="width: 130px; height: 170px; margin-top:15px;">
                                <span id='name_${index}' class="shortname2">${note_name}</span>
                                <input id='id_${index}' value="${note_id}" hidden>
                                <input id='group_${index}' value="${group}" hidden>
                                <input type="checkbox" name="trash-checkbox${note_id}" value="${index}" style="width:10px" onclick="handleTrashCheckbox('note')">
                                <label for="trash-checkbox${note_id}"></label>
                            </div>`

                $('#trash-content').append(temp_html)
            });
            let temp_html2 = `<button type="button" class="btn btn-primary" onclick="handleTrashDelete()"
                                style="background-color: #7689b1; border-color: #7689b1;">삭제</button>
                              <button type="button" class="btn btn-primary" onclick="handleTrashRestore()"
                               style="background-color: #485d86; border-color: #485d86;">복원</button>`

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
                                style="background-color: #7689b1; border-color: #7689b1;">삭제</button>
                              <button type="button" class="btn btn-primary" 
                               style="background-color: #485d86; border-color: #485d86;">복원</button>`

            $('#trash-modal-footer').append(temp_html2)

        } else {
            photos.forEach((photo, index) => {
                const photo_id = photo.id
                const photo_title = photo.title
                const photo_name = photo.name
                const photo_created_at = photo.created_at
                const photo_location = photo.location
                const image = photo.image

                let temp_html = `<div style="display: inline-flex; flex-direction: column; align-items: center; padding-left:10px;">
                                    <img src="${image}" alt="Image description" style="width: 135px; height: 135px; margin-top:15px;">
                                    <span id='name_${index}' class="shortname">${photo_name}</span>
                                    <input type="checkbox" name="trash-checkbox${photo_id}" value="${index}" style="width:10px" onclick="handleTrashCheckbox('photo')">
                                    <label for="trash-checkbox${photo_id}"></label>
                                    <input id='id_${index}' value="${photo_id}" hidden>
                                    <input id='location_${index}' value="${photo_location}" hidden>
                                    <input id='title_${index}' value="${photo_title}" hidden>
                                </div>`

                $('#trash-content').append(temp_html)
            });
            let temp_html2 = `<button type="button" class="btn btn-primary" onclick="handleTrashDelete()"
                                style="background-color: #7689b1; border-color: #7689b1;">삭제</button>
                              <button type="button" class="btn btn-primary" onclick="handleTrashRestore()"
                               style="background-color: #485d86; border-color: #485d86;">복원</button>`

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

    const response = await fetch(`${backend_base_url}/note/trash`, {
        headers: {
            'content-type': 'application/json',
            "Authorization": `Bearer ${token}`
        },
        method: 'POST',
        body: JSON.stringify({
            "group_set" : [
                {
                    "id": group_id,
                    "name": name
                }
            ]
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
    }

}

async function handleGrouptrashMultiple(selectedGroups) {
    let token = localStorage.getItem("access")

    const response = await fetch(`${backend_base_url}/note/trash`, {
        headers: {
            'content-type': 'application/json',
            "Authorization": `Bearer ${token}`
        },
        method: 'POST',
        body: JSON.stringify({
            "group_set": selectedGroups
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
    }

}

async function handleNotetrash(note_id, group, name) {
    let token = localStorage.getItem("access")

    const response = await fetch(`${backend_base_url}/note/trash`, {
        headers: {
            'content-type': 'application/json',
            "Authorization": `Bearer ${token}`
        },
        method: 'POST',
        body: JSON.stringify({
            "note_set" : [
                {
                    "id": note_id,
                    "name": name,
                    "group": group,
                }
            ]
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
    }
}

async function handleNotetrashMultiple(selectedNotes) {
    let token = localStorage.getItem("access")

    const response = await fetch(`${backend_base_url}/note/trash`, {
        headers: {
            'content-type': 'application/json',
            "Authorization": `Bearer ${token}`
        },
        method: 'POST',
        body: JSON.stringify({
            "note_set": selectedNotes
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

async function handlePhototrash(selectedPhotos) {
    let token = localStorage.getItem("access")

    const response = await fetch(`${backend_base_url}/note/trash`, {
        headers: {
            'content-type': 'application/json',
            "Authorization": `Bearer ${token}`
        },
        method: 'POST',
        body: JSON.stringify({
            "photo_set": selectedPhotos
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

function handleTrashCheckbox(contentType) {
    var selectedcheckbox = document.querySelector('input[name="trash-checkbox"]:checked');
    let selectedIndex = selectedcheckbox.value;

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
    var selectedcheckboxes = document.querySelectorAll('input[name="trash-checkbox"]:checked');

    if (selectedcheckboxes.length === 0) {
        showToast("※ 항목을 선택해주세요!");
        return;
    }

    const selectedGroups = [];
    const selectedNotes = [];
    const selectedPhotos = [];

    selectedcheckboxes.forEach(selectedcheckbox => {
        let selectedIndex = selectedcheckbox.value;
        let selected_id = document.getElementById(`id_${selectedIndex}`).value;
        let selected_name = document.getElementById(`name_${selectedIndex}`).innerText;
        let name = selected_name.split('|')[0].trim();

        if (selectedGroupIndex !== null) {
            selectedGroups.push({
                id: selected_id,
                name: name
            });
            if(selectedGroups!== null){
                handleGrouptrash(selectedGroups);
            }
        }

        if (selectedNoteIndex !== null) {
            const selected_group = document.getElementById(`group_${selectedIndex}`).value;
            selectedNotes.push({
                id: selected_id,
                group: selected_group,
                name: selected_name
            });
            if(selectedNotes!== null){
                handleNotetrashMultiple(selectedNotes);
            }
        }

        if (selectedPhotoIndex !== null) {
            const selected_location = document.getElementById(`location_${selectedIndex}`).value;
            const selected_title = document.getElementById(`title_${selectedIndex}`).value;
            selectedPhotos.push({
                id: selected_id,
                location: selected_location,
                title: selected_title,
                name: selected_name
            });
            if(selectedPhotos!== null){
                handlePhototrash(selectedPhotos);
            }
        }
    })
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
    var selectedcheckbox = document.querySelector('input[name="trash-checkbox"]:checked');

    if (!selectedcheckbox) {
        showToast("※ 항목을 선택해주세요!");
        return;
    }

    let selectedIndex = selectedcheckbox.value;
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
// 일단 사진
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

async function loadGrouptrash() {
    const response = await getTrash()
    console.log(response)

    const groups = response.group
    const notes = response.note
    const photos = response.photo

    $('#trash-content').empty()

    groups.forEach((group) => {
        const group_id = group.id
        const group_name = group.name
        const group_created_at = group.created_at

        let temp_html = `                               
                        `
        $('#trash-content').append(temp_html)
    });

//     notes.forEach((note) => {
//         const note_id = note.id
//         const note_name = note.name
//         const note_created_at = note.created_at
//         const category = note.category
//         // const note_cover = url('/css/note_img/note_${category}.png')

//         let temp_html = `                               
//                         `
//         $('#trash-modal-body').append(temp_html)
//     });

//     photos.forEach((photo) => {
//         const photo_id = photo.id
//         const photo_name = photo.name
//         const photo_created_at = photo.created_at
//         const image = backend_base_url + '/note' + photo.image

//         let temp_html = `                               
//                         `
//         $('#trash-modal-body').append(temp_html)
//     });
}

async function loadNotetrash() {
    const response = await getTrash()
    console.log(response)

    const notes = response.note

    $('#trash-content').empty()

    notes.forEach((note) => {
        const note_id = note.id
        const note_name = note.name
        const note_created_at = note.created_at
        const category = note.category

        let temp_html = `<div style="display: inline-flex; flex-direction: column; align-items: center; padding-left:20px">
                            <img src="/css/note_img/note_${category}.png" alt="Image description" style="width: 130px; height: 160px; margin-top:15px">
                            ${note_name}
                            <input type="radio" name="photo-trash" value="1" style="width:10px">
                        </div>`                              
                        
        $('#trash-content').append(temp_html)
    });
}

async function loadPhototrash() {
    const response = await getTrash()
    console.log(response)

    const photos = response.photo

    $('#trash-content').empty()

    photos.forEach((photo) => {
        const photo_id = photo.id
        const photo_name = photo.name
        const photo_created_at = photo.created_at
        const photo_location = photo.location
        const image = backend_base_url + '/note' + photo.image

        let temp_html = `<div style="display: inline-flex; flex-direction: column; align-items: center;">
                            <img src="${image}" alt="Image description" style="width: 142px; height: 142px;">
                            ${photo_name}
                            <input type="radio" name="photo-trash" value="1" style="width:10px">
                         </div>`
                         
        $('#trash-content').append(temp_html)
    });
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

// async function handleNotetrash(note_id,name,group_id) {
//     let token = localStorage.getItem("access")

//     const response = await fetch(`${backend_base_url}/note/trash/${note_id}`, {
//         headers: {
//             'content-type': 'application/json',
//             "Authorization": `Bearer ${token}`
//         },
//         method: 'POST',
//         body: JSON.stringify({
//             "name": name,
//             "group": group_id

//         })
//     })

//     if (response.status == 200) {
//         const response_json = await response.json()
//         window.location.reload()
//         return response_json
//     }
//     else {
//         alert("※실패")
//         console.log(photo_id)
//     }
// }

// const noteToggle = document.getElementById("note-toggle");
// const photoToggle = document.getElementById("photo-toggle");
// const groupToggle = document.getElementById("group-toggle");

// const noteButton = document.getElementById("noteButton");
// const photoButton = document.getElementById("photoButton");
// const groupButton = document.getElementById("groupButton");

// noteToggle.addEventListener("change", function() {
//   if (noteToggle.checked) {
//     noteButton.classList.add("active");
//     // 선택된 날짜에 대한 동작 수행
//   } else {
//     noteButton.classList.remove("active");
//   }
// });

// photoToggle.addEventListener("change", function() {
//   if (photoToggle.checked) {
//     photoButton.classList.add("active");
//     // 선택된 이름에 대한 동작 수행
//   } else {
//     photoButton.classList.remove("active");}
// })

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
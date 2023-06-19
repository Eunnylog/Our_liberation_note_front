// 일단 사진
async function getTrash(note_id) {
    let token = localStorage.getItem("access")

    const response = await fetch(`${backend_base_url}/note/photo/${note_id}`, {
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

async function loadTrashPhoto(note_id) {
    const response = await getTrash(note_id)

    $('#trash-content').empty()

    response.forEach((stamp) => {
        const diary_id = stamp.photo.diary_id
        const diary_name = stamp.photo.diary_name
        const image = backend_base_url + '/note' + stamp.photo.image

        if (!addedDiaryNames.includes(diary_name)) {
            let temp_html = ` <a href='/photo_page.html?note_id=${diary_id}' onclick="" style="text-decoration: none; color: black;">
                                        <div class="diary-link-text" style="margin-top:10px;">${diary_name} ></div></a>
                                    <img src="${image}" alt="Image description" style="width: 142px; height: 142px; margin-left:2px;">                                      
                                  `
            $('#trash-modal-body').append(temp_html)
            addedDiaryNames.push(diary_name)

        } else {
            let diary_temp_html = `<img src=${image} alt="Image description" class="stamp-photo">`
            $('#stamp-modal-body').append(diary_temp_html)
        }
    });
}


// async function loadTrashNote() {

//     const response = await getTrash()

//     $('#trash-content').empty()

//     response.forEach((stamp) => {
//         const diary_id = stamp.photo.diary_id
//         const diary_name = stamp.photo.diary_name
//         const image = backend_base_url + '/note' + stamp.photo.image

//         if (!addedDiaryNames.includes(diary_name)) {
//             let temp_html = ` <a href='/photo_page.html?note_id=${diary_id}' onclick="" style="text-decoration: none; color: black;">
//                                         <div class="diary-link-text" style="margin-top:10px;">${diary_name} ></div></a>
//                                     <img src="${image}" alt="Image description" style="width: 142px; height: 142px; margin-left:2px;">                                      
//                                   `
//             $('#trash-modal-body').append(temp_html)
//             addedDiaryNames.push(diary_name)

//         } else {
//             let diary_temp_html = `<img src=${image} alt="Image description" class="stamp-photo">`
//             $('#stamp-modal-body').append(diary_temp_html)
//         }
//     });
// }


async function handlePhototrash(photo_id,location) {
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

const noteToggle = document.getElementById("note-toggle");
const photoToggle = document.getElementById("photo-toggle");
const groupToggle = document.getElementById("group-toggle");

const noteButton = document.getElementById("noteButton");
const photoButton = document.getElementById("photoButton");
const groupButton = document.getElementById("groupButton");

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
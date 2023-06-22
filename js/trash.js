async function getTrash() {
    let token = localStorage.getItem("access")
    const payload = localStorage.getItem("payload");

    const response = await fetch(`${backend_base_url}/note/photo-detail/${photo_id}`, {
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

async function trashPhoto(photo_id) {
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
    if (response.status == 201) {
        const response_json = await response.json()
        window.location.reload()
        return response_json
    }
    else {
        alert("※실패")
        console.log(photo_id)
    }
}

const noteToggle = document.getElementById("note-toggle");
const photoToggle = document.getElementById("photo-toggle");

const noteButton = document.getElementById("noteButton");
const photoButton = document.getElementById("photoButton");

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
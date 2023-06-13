const backend_base_url = "https://api.miyeong.net"
const frontend_base_url = "http://127.0.0.1:5500"

// 백엔드 연결하기


// 사진 추가하기
async function addPhoto() {
    const image = document.getElementById("image");
    const title = document.getElementById("title").value;
    const location = document.getElementById("location").value;
    const memo = document.getElementById("memo").value;


    const formData = new FormData();
    formData.append("image", image.files[0]);
    formData.append("title", title);
    formData.append("location", location);
    formData.append("memo", memo);

    console.log(formData)

    try {
        const urlParams = new URLSearchParams(window.location.search);
        const note_id = urlParams.get('note_id');

        const response = await fetch(`${backend_base_url}/note/photo/${note_id}`, {
            // headers: {
            //     // "Authorization": `Bearer ${access_token}`,
            // },
            method: 'POST',

            body: formData
        });

        if (response.ok) {
            const data = await response.json();
            console.log('image 업로드 성공')
        } else {
            throw new Error("서버가 응답하지 않습니다.");
        }
    } catch (error) {
        alert("에러가 발생했습니다.");
        console.error(error);
    }
}


async function album() {
    const urlParams = new URLSearchParams(window.location.search);
    const note_id = urlParams.get('note_id');
    const response = await fetch(`${backend_base_url}/note/photo/${note_id}`, {
        headers: {
            'content-type': 'application/json',
            // 'Authorization': `Bearer ${accessToken}`
        },
        method: 'GET',
    })

    const response_json = await response.json()

    response_json.forEach((a) => {
        const image = backend_base_url + a["image"];
        const title = a['title']
        const location = a['location']
        const memo = a['memo']
        const photo_id = a['id']
        console.log(image)

        let temp_html = `
            <div class="gallery-item">
                <img class="gallery-image" src="${image}" alt="${title}">
            </div>
            `
        $('#photo_info').append(temp_html)
    });
}
// 페이지 로드 시 앨범 표시
window.addEventListener('DOMContentLoaded', album);



// const saveButton = document.getElementById("save-button");
// saveButton.addEventListener("click", addPhoto)

//이미지 URL 가져오기 1
// async function fetchImageUrls() {
//     try {
//         const urlParams = new URLSearchParams(window.location.search);
//         const note_id = urlParams.get('note_id');

//         const response = await fetch(`${backend_base_url}/note/photo/1`, {
//             method: 'GET'
//         });
//         if (response.ok) {
//             const data = await response.json();
//             displayImages(data);
//         } else {
//             throw new Error("서버가 응답하지 않습니다.");
//         }
//     } catch (error) {
//         alert("에러가 발생했습니다.");
//         console.error(error);
//     }
// }

// function displayImages(images) {
//     const gallery = document.querySelector(".gallery");

//     images.forEach((image) => {
//         const galleryItem = document.createElement("div");
//         galleryItem.classList.add("gallery-item");

//         const img = document.createElement("img");
//         img.classList.add("gallery-image");
//         img.src = image.url;
//         img.alt = image.title;

//         galleryItem.appendChild(img);
//         gallery.appendChild(galleryItem);
//     });
// }

// // 페이지 로드 후 이미지 URL 가져오기
// window.addEventListener('load', fetchImageUrls);
// 포토 아이디 볼때 씀
/* <th>${a.id}</th> */
const backend_base_url = "https://api.miyeong.net"
const frontend_base_url = "http://127.0.0.1:5500"

// let note_id = "1";
// let photo_total = 0
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
            <a class="photo" href="" onclick="photo_detail('${photo_id}')" data-bs-toggle="modal" data-bs-target="#photo-detail"><img class="gallery-image" src="${image}" alt="${title}"></a>
            </div>
            `
        $('#photo_info').append(temp_html)
    });
}
// 페이지 로드 시 앨범 표시
window.addEventListener('DOMContentLoaded', album);

// 상세페이지 모달
async function photo_detail(photo_id) {
    //각 사진마다 photo_id를 갖고 있기에 그에 맞는 정보를 갖고올 수 있도록 받아온다.
    $('#photo-d').empty();
    const response = await fetch(`${backend_base_url}/note/photo-detail/${photo_id}`, {
        headers: {
            'content-type': 'application/json',
            // 'Authorization': `Bearer ${accessToken}`
        },
        method: 'GET',
    })
    //해당 url에 저장된 값을 수정
    const response_json = await response.json()
    // json 형태의 데이터를 가져오고 해당 데이터를 patch로 수정
    console.log(response_json)

    const image = backend_base_url + response_json["image"];


    let temp_html = `
                    <img class="gallery-image" src="${image}">
                    <input id="image" name="files" multiple accept=".jpg, .png, .jpeg" type="file"
                        class="form-control" placeholder="사진">
                    <input name="title" id="title" type="text" class="form-control" placeholder="제목">
                    <input name="location" id="location" type="text" class="form-control" placeholder="주소">
                    <input id="memo" type="text" class="form-control" placeholder="메모">
                    `
    $('#photo-d').append(temp_html)

}

function patchBox() {
    // 수정 창으로 변경합니다.
    let image = document.getElementById("image");
    let title = document.getElementById('photo_title').innerHTML;
    let location = document.getElementById('photo_location').innerHTML;
    let memo = document.getElementById('photo_memo').innerHTML;


    planInfoDiv.innerHTML = `
                            <div class="input-group" style="flex-wrap: nowrap;">
                                <input name="title" id="title" type="text" value='${title}' class="form-control" placeholder="사진 타이틀"
                                style="width: 60%; height:40px;">
                                <img class="gallery-image" src="${image}">
                                <input id="image" name="files" multiple accept=".jpg, .png, .jpeg" type="file"
                                class="form-control" placeholder="사진">
                                <div class="input-group-append" style="width: 10%;">
                                    <button type="button" onclick="searchLocation()" class="btn btn-primary"
                                    style="margin-top:0px;height:40px; font-size:15px">검색</button>
                                </div>
                            </div>
                            <div id="search_box" style="width: 100%;  overflow: auto;"></div>
                            <input name="location" id="location" value='${location}' type="text" class="form-control"
                                placeholder="주소(미작성시 AI사용이 불가합니다!)">
                            <input name="start" id="start" value='${date}' type="date" class="form-control">
                            <input name="time" id="time" value='${time}' type="text" class="form-control" placeholder="시간">
                            <textarea name="memo" id="memo" value='${memo}'  type="textarea" class="form-control" placeholder="memo"
                                style="height:200px; min-height:200px; max-height:200px"></textarea>
    `;

    const btnElement = document.getElementById('patch_box');
    btnElement.innerText = '저장';
    btnElement.setAttribute("onClick", `patchPhoto()`)
}

async function patchPhoto() {
    photo_id = document.getElementById('photo_modal_id').innerHTML;
    let title = document.getElementById('title');
    let location = document.getElementById('location');
    let memo = document.getElementById('memo');
    let location_x = document.getElementById("location_x").value
    let location_y = document.getElementById("location_y").value


    const response = await fetch(`${back_url}/note/photo-detail/${photo_id}`, {
        headers: {
            'content-type': 'application/json',
            "Authorization": `Bearer ${access_token}`,
        },
        method: 'PATCH',
        body: JSON.stringify({
            "title": title.value ?? title.placeholder,
            "location": location.value ?? location.placeholder,
            "memo": memo.value ?? memo.placeholder,
            "location_x": location_x,
            "location_y": location_y,
        })
    });
    if (response.status == 200) {
        alert("계획이 수정되었습니다!")
        window.location.reload()
    } else {
        alert('문제가 발생했습니다!')
    }
}

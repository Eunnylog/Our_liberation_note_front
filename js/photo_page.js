// const backend_base_url = "https://api.miyeong.net"
const backend_base_url = "http://127.0.0.1:8000"
const frontend_base_url = "http://127.0.0.1:5500"

// let note_id = "1";
// let photo_total = 0
// 백엔드 연결하기


// 사진 추가하기
async function addPhoto() {
    const image = document.getElementById("image");
    const name = document.getElementById("name").value;
    const title = document.getElementById("title").value;
    const start = document.getElementById("start").value;
    const location = document.getElementById("location").value;
    const memo = document.getElementById("memo").value;
    let location_x = document.getElementById("location_x").value
    let location_y = document.getElementById("location_y").value

    // const location_x = document.getElementById("location_x").value
    // const location_y = document.getElementById("location_y").value

    const formData = new FormData();
    formData.append("image", image.files[0]);
    formData.append("name", name);
    formData.append("title", title);
    formData.append("start", start);
    formData.append("location", location);
    formData.append("memo", memo);
    formData.append("location_x", location_x);
    formData.append("location_y", location_y);

    console.log(formData)
    // console.log(location_x, location_y)

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
        const image = backend_base_url + '/note' + a["image"];
        const name = a["name"]
        const title = a['title']
        const location = a['location']
        const memo = a['memo']
        const photo_id = a['id']
        console.log(image)
        console.log(response_json)
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


    console.log(response_json)

    const image = backend_base_url + '/note' + response_json["image"];
    const name = response_json["name"]
    const start = response_json["start"]
    const location = response_json["location"]
    const memo = response_json["memo"]



    let temp_html = `
                    <img class="gallery-image" src="${image}">
                    <div>${name}</div>
                    <div>${start}</div>
                    <div>${location}</div>
                    <div>${memo}</div>
                    `
    $('#photo-d').append(temp_html)

}

function patchPhotoBox() {
    // 수정 창으로 변경합니다.
    let image = document.getElementById("image");
    let name = document.getElementById('photo_title').innerHTML;
    let title = document.getElementById('location_title').innerHTML;
    let location = document.getElementById('photo_location').innerHTML;
    let memo = document.getElementById('photo_memo').innerHTML;


    planInfoDiv.innerHTML = `
                            <div class="filebox">
                                <input class="upload-name" value="첨부파일" src="${image}" placeholder="첨부파일" multiple
                                    accept=".jpg, .png, .jpeg" style="width: 85.3%">
                                <label for="image">사진추가</label>
                                <input type="file" id="image" style="display: none" />
                            </div>
                            <div class="input-group-append" style="width: 100%;">
                                <input name="name" id="name" type="text" value='${title}' class="form-control"
                                    placeholder="사진 타이틀" style="width: 100%; height:40px;">
                            </div>
                            <div class="input-group-append" style="width: 100%;">
                                <input name="title" id="title" value='${location}' type="text" class="form-control"
                                    placeholder="주소 검색" style="width: 100%; height:40px;">
                            </div>
                            <div class="input-group"  style="flex-wrap: nowrap;">
                                <div class="input-group-append" style="width: 100%;">
                                    <input name="location" id="location" type="text" class="form-control"
                                    placeholder="장소" style="width: 99%; height:40px;" placeholder="주소(미작성시 AI사용이 불가합니다!)">
                                </div>
                                <div class="input-group-append" style="width: 10%;">
                                    <button type="button" onclick="searchLocation()" class="btn btn-primary"
                                    style="margin-top:0px;height:40px; font-size:15px">검색</button>
                                </div>
                            <textarea name="memo" id="memo" value='${memo}'  type="textarea" class="form-control" placeholder="memo"
                                style="height:200px; min-height:200px; max-height:200px"></textarea>
    `;

    const btnElement = document.getElementById('patch_photo_box');
    btnElement.innerText = '저장';
    btnElement.setAttribute("onClick", `patchPhoto()`)
}

async function patchPhoto() {
    photo_id = document.getElementById('photo_modal_id').innerHTML;
    let name = document.getElementById('name');
    let title = document.getElementById('title');
    let location = document.getElementById('location');
    let memo = document.getElementById('memo');
    let location_x = document.getElementById("location_x").value
    let location_y = document.getElementById("location_y").value


    const response = await fetch(`${back_url}/note/photo-detail/${photo_id}`, {
        headers: {
            'content-type': 'application/json',
            // "Authorization": `Bearer ${access_token}`,
        },
        method: 'PATCH',
        body: JSON.stringify({
            "name": name.value ?? name.placeholder,
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

//photo_page.html > 사진추가 버튼 옆 업로드 이름 
$("#image").on('change', function () {
    var fileName = $("#image").val();
    $(".upload-name").val(fileName);
});


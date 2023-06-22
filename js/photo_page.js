// const backend_base_url = "https://api.miyeong.net"
// const backend_base_url = "http://127.0.0.1:8000"
// const frontend_base_url = "http://127.0.0.1:5500"
let access_token = localStorage.getItem('access')

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
    console.log(location_x, location_y)

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
            window.location.reload()
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

    let menu_html = `<a class="btn-close" href="/plan_page.html?note_id=${note_id}" ><button
                    type="button" class="btn btn-primary">뒤로가기</button></a>`
    $('#menu_box').append(menu_html)

    const response = await fetch(`${backend_base_url}/note/photo/${note_id}`, {
        headers: {
            'content-type': 'application/json',
            // 'Authorization': `Bearer ${accessToken}`
        },
        method: 'GET',
    })

    const response_json = await response.json()

    const stampsresponse = await getUserprofile()
    const stamps = stampsresponse.stamps
    const existPhoto = []

    stamps.forEach((stamp) => {
        const status = stamp.status
        const photo = stamp.photo.id

        if (status === "0") {
            existPhoto.push(photo);
        }
    });

    response_json.forEach((a) => {
        console.log(a)
        const image = backend_base_url + '/note' + a["image"];
        const title = a['title'];
        const photo_id = a['id'];

        let temp_html = `<div class="gallery-item">
                            <a class="photo" href="" onclick="photo_detail('${photo_id}')" data-bs-toggle="modal" data-bs-target="#photo-detail">
                                <img class="gallery-image" src="${image}" alt="${title}">
                            </a> `

        if (existPhoto.includes(photo_id)) {
            temp_html += `<img class="exist-stamp" id="exist-stamp" src="/css/assets/stamp.png" alt="Stamp Image" onclick="handleStamp('${photo_id}');">`
        } else {
            temp_html += `<img class="stamp" id="stamp" src="/css/assets/stamp.png" alt="Stamp Image" onclick="handleStamp('${photo_id}');">`
        }

        temp_html += `</div>`;

        $('#photo_info').append(temp_html);
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

    const image = backend_base_url + '/note' + response_json["image"];
    const name = response_json["name"]
    const start = response_json["start"]
    const title = response_json["title"]
    const location = response_json["location"]
    const memo = response_json["memo"]
    const comments = response_json["comment_set"]
    // const photo_id = response_json["photo_id"]

    console.log(response_json)
    let temp_html = `
                    <img class="gallery-image" src="${image}"id='photo_image'>
                    <div id='photo_name'>${name}</div>
                    <div id='photo_start'>${start}</div>
                    <div id='photo_title'>${title}</div> 
                    <div id='photo_location'>${location}</div>
                    <div id='photo_memo'>${memo}</div>
                    
                    <div>
                    <input name="comment" id="comment" type="textarea" class="form-control" placeholder="comment">
                        <button type="button" id="commentBtn" value="${photo_id}" onclick="addComment()" class="btn btn-secondary" data-bs-dismiss="modal">게시</button>
                    <ul class="comment_set">
                        ${comments.map(comment => `<li id="comment-$comment-${comment.id}">${comment.comment}
                        <input name="comment_edit" id="comment_edit${comment.id}" type="text" class="form-control" placeholder="comment">
                        <button type="button" id="commentEditBtn${comment.id}" value="${photo_id}/${comment.id}" onclick="editComment(event)" class="btn btn-secondary" data-bs-dismiss="modal">수정</button>
                        <button type="button" id="commentDeleteBtn${comment.id}" value="${photo_id}/${comment.id}" onclick="deleteComment(event)" class="btn btn-secondary" data-bs-dismiss="modal">삭제</button>
                        </li>`).join('')}
                    </ul>
                    </div>
                    
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">취소하기
                        </button>
                        <button id="patch_photo_box" type="button" class="btn btn-primary"
                            onclick="patchPhotoBox('${photo_id}')">수정</button>
                        <button id="photo-trash" type="button" class="btn btn-primary"
                            onclick="trashPhoto('${photo_id}')">휴지통</button>
                    </div>
                    `
    $('#photo-d').append(temp_html)
}


function patchPhotoBox(photo_id) {
    console.log(photo_id)
    // // 수정 창으로 변경합니다.
    // let photo_detail = document.getElementById('photo-d');
    let image = document.getElementById('photo_image');
    let name = document.getElementById('photo_name').innerHTML;
    let start = document.getElementById('photo_start').innerHTML;
    let title = document.getElementById('photo_title').innerHTML;
    let location = document.getElementById('photo_location').innerHTML;
    let memo = document.getElementById('photo_memo').innerHTML;

    $('#photo-d').empty();
    temp_html = `           
                            <div class="filebox">
                                <input class="upload-name" value="첨부파일" src="${image}" placeholder="첨부파일" multiple
                                    accept=".jpg, .png, .jpeg" style="width: 85.3%">
                                <label for="image">사진추가</label>
                                <input type="file" id="image" style="display: none" />
                            </div>
                            <div class="input-group-append" style="width: 100%;">
                                <input name="name" id="p_name" type="text" value='${name}' class="form-control"
                                    placeholder="사진 타이틀" style="width: 100%; height:40px;">
                                <input name="start" id="p_start" type="date" value='${start}' class="form-control">
                            </div>
                            <div class="input-group-append" style="width: 100%;">
                                <input name="title" id="p_title" value='${title}' type="text" class="form-control"
                                    placeholder="주소 검색" style="width: 100%; height:40px;">
                            </div>
                            <div class="input-group"  style="flex-wrap: nowrap;">
                                <div class="input-group-append" style="width: 90%;">
                                    <input name="location" id="p_location" value='${location}' type="text" class="form-control"
                                    placeholder="장소" style="width: 90%; height:40px;" placeholder="주소(미작성시 AI사용이 불가합니다!)">
                                </div>
                                <div class="input-group-append" style="width: 10%;">
                                    <button type="button" onclick="searchLocation(2)" class="btn btn-primary"
                                    style="margin-top:0px;height:40px; font-size:15px">검색</button>
                                </div>
                            </div>
                            <div id="search_box2" style="width: 100%;  overflow: auto; height= 30px;"></div>
                            <div class="input-group" style="flex-wrap: nowrap;">
                                <textarea name="memo" id="p_memo" type="textarea" class="form-control" placeholder="memo"
                                style="height:50px; min-height:50px; max-height:200px; width:100%" >${memo}</textarea>
                            </div>
                            <input name="p_location_x" id="p_location_x" type="text" class="form-control" hidden>
                                <input name="p_location_y" id="p_location_y" type="text" class="form-control" hidden>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary delete_serarch" data-bs-dismiss="modal">취소하기
                                </button>
                                <button id="patch_photo" value='${photo_id}' type="button" class="btn btn-primary"
                                    onclick="patchPhoto()">저장</button>
                            </div> `;
    $('#photo-d').append(temp_html)
}

async function patchPhoto() {
    const photo_id = document.getElementById("patch_photo").value;
    const image = document.getElementById("image");
    const name = document.getElementById('p_name').value;
    const title = document.getElementById('p_title').value;
    const start = document.getElementById('p_start').value;
    const location = document.getElementById('p_location').value;
    const memo = document.getElementById('p_memo').value;
    const location_x = document.getElementById("p_location_x").value
    const location_y = document.getElementById("p_location_y").value



    const formData = new FormData();

    // 기존 이미지를 삭제하기 위해 'delete_image' 파라미터를 추가하여 서버에 전달
    formData.append("delete_image", true);
    // 새로운 이미지가 선택되었을 경우에만 새로운 이미지를 추가합니다.
    if (image.files.length > 0) {
        formData.append("image", image.files[0]);
    }
    formData.append("name", name);
    formData.append("title", title);
    formData.append("start", start);
    formData.append("location", location);
    formData.append("memo", memo);
    formData.append("location_x", location_x);
    formData.append("location_y", location_y);

    console.log(name)
    for (const pair of formData.entries()) {
        console.log(pair[0] + ':', pair[1]);
    }
    try {
        const urlParams = new URLSearchParams(window.location.search);
        // const photo_id = urlParams.get('photo_id');

        const response = await fetch(`${backend_base_url}/note/photo-detail/${photo_id}`, {
            // headers: {
            //     // "Authorization": `Bearer ${access_token}`,
            // },
            method: 'PATCH',
            body: formData
        });

        if (response.ok) {
            const data = await response.json();
            console.log('image 업로드 성공')
            window.location.reload()
        } else {
            throw new Error("서버가 응답하지 않습니다.");
        }
    } catch (error) {
        alert("에러가 발생했습니다.");
        console.error(error);
        // window.location.reload()
    }
}
//photo_page.html > 사진추가 버튼 옆 업로드 이름 
$("#image").on('change', function () {
    var fileName = $("#image").val();
    $(".upload-name").val(fileName);
});


// 코멘트 추가 back과 연결
async function addComment() {
    const photo_id = document.getElementById("commentBtn").value;
    const commentText = document.getElementById("comment").value;

    try {
        const response = await fetch(`${backend_base_url}/note/photo-detail/${photo_id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${access_token}`,
            },
            body: JSON.stringify({ comment: commentText })
        });

        if (response.ok) {
            console.log('코멘트 추가 성공');
        } else {
            throw new Error('서버가 응답하지 않습니다.');
        }
    }
    catch (error) {
        alert('에러가 발생했습니다.');
        console.error(error);
    }
}
//comment_id를 받아와라ㅏㅏㅏㅏㅏㅏㅏ 어딘지는 아는데 어떻게 바다오냐ㅏㅏㅏㅏㅏㅏ

async function editComment(event) {

    var button = event.target;
    var buttonValue = button.value;
    console.log("Button Value:", buttonValue);


    const photo_comment_id = button.value;
    const photo_id = photo_comment_id.split("/")[0];
    const comment_id = photo_comment_id.split("/")[1];



    // const comment_id = document.getElementById("commentEditBtn").value
    const updatedComment = document.getElementById(`comment_edit${comment_id}`).value;
    console.log(updatedComment)


    fetch(`${backend_base_url}/note/comment/${photo_id}/${comment_id}`, {
        headers: {
            'content-type': 'application/json',
            "Authorization": `Bearer ${access_token}`,
        },
        method: 'PUT',
        body: JSON.stringify({ comment: updatedComment })
    })
        .then(response => response.json())
        .then(data => {
            console.log(data)
        })
        .catch(error => {
            console.error('Error', error)
        })
}

async function deleteComment(event) {

    var button = event.target;
    var buttonValue = button.value;
    console.log("Button Value:", buttonValue);

    const photo_comment_id = button.value;
    const photo_id = photo_comment_id.split("/")[0];
    const comment_id = photo_comment_id.split("/")[1];

    // const comment_id = document.getElementById("commentEditBtn").value


    fetch(`${backend_base_url}/note/comment/${photo_id}/${comment_id}`, {
        headers: {
            'content-type': 'application/json',
            "Authorization": `Bearer ${access_token}`,
        },
        method: 'DELETE',
    })
        .then(response => {
            if (response.status == 204) {
                alert("댓글이 삭제되었습니다");
                window.location.reload();
            } else {
                alert('');
            }
        })
        .catch(error => {
            console.error("댓글 삭제 중 오류 발생", error);
            alert("댓글 삭제 중 오류 발생")
        });

}


async function handleStamp(photo_id) {
    let token = localStorage.getItem("access")
    const payload = localStorage.getItem("payload");
    const payload_parse = JSON.parse(payload)
    const user = payload_parse.user_id

    const response = await fetch(`${backend_base_url}/note/stamp/${photo_id}`, {
        headers: {
            'content-type': 'application/json',
            "Authorization": `Bearer ${token}`
        },
        method: 'POST',
        body: JSON.stringify({
            "user": user,
            "photo": photo_id,
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

checkLogin()

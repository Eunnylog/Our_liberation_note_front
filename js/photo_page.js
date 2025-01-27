let access_token = localStorage.getItem('access')
checkGroup()
checkLogin()


window.addEventListener('load', function () {
    const noteName = localStorage.getItem('noteName');
    const photopageTitle = document.getElementById("photopage_title");
    photopageTitle.innerHTML = noteName + " | Photo gallery";
});


// 사진 추가하기
async function addPhoto() {
    const image = document.getElementById("image");
    const name = checkCode(document.getElementById("name").value)
    const title = checkCode(document.getElementById("title").value)
    const start = document.getElementById("start").value;
    const location = checkCode(document.getElementById("location").value)
    const memo = document.getElementById("memo").value.trim() || '';
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

    let nameBox = document.getElementById("name")
    let titleBox = document.getElementById("title")
    let imgBox = document.getElementById("imgbox")


    if (name == '' || title == '' || imgBox.value == '') {
        showToast('필수요소를 모두 입력해주세요!')
        nameBox.classList.add("custom-class");
        titleBox.classList.add("custom-class");
        imgBox.classList.add("custom-class");

        return false
    } else {
        nameBox.classList.remove("custom-class");
        titleBox.classList.remove("custom-class");
        imgBox.classList.remove("custom-class");
    }

    if (image.files[0].size > 10 * 1024 * 1024) {
        alert("첨부파일 사이즈는 10MB 이내로 등록이 가능합니다.");
        return false;
    }

    try {
        const urlParams = new URLSearchParams(window.location.search);
        const note_id = urlParams.get('note_id');

        const response = await fetch(`${backend_base_url}/note/photo/${note_id}`, {
            headers: {
                "Authorization": `Bearer ${access_token}`,
            },
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            const data = await response.json();
            showToast('새로운 이미지가 추가되었습니다!')
            window.location.reload()
        } else {
            throw new Error("서버가 응답하지 않습니다.");
        }
    } catch (error) {
        showToast('이미지를 선택해주세요!');
        console.error(error);
    }

}

// 사진 추가 모달의 닫기 버튼을 누르면 addPhoto에 쓰던 도중인 내용 초기화
async function addClose() {
    document.getElementById("name").value = "";
    document.getElementById("title").value = "";
    document.getElementById("imgbox").value = null;
    document.getElementById("imgbox").classList.remove("custom-class");
    document.getElementById("location").value = "";
    document.getElementById("memo").value = "";
    document.getElementById("location_x").value = "";
    document.getElementById("location_y").value = "";
}

async function album() {
    try {
        params = new URLSearchParams(window.location.search);
        page = params.get("page");

        if (!page) {
            page = 0
        }

        const urlParams = new URLSearchParams(window.location.search);
        const note_id = urlParams.get('note_id');

        let menu_html = `<a class="btn group-btn" href="/plan_page.html?note_id=${note_id}"
                        style="background-color: #7689b1; color:white; margin: 0px 1px; 
                        text-decoration: none;">뒤로가기
                    </a>`
        $('#menu_box').append(menu_html)

        const response = await fetch(`${backend_base_url}/note/photo/${note_id}/${page}`, {
            // const response = await fetch(`${backend_base_url}/note/photo/${note_id}`, {
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${access_token}`
            },
            method: 'GET',
        })

        const response_json = await response.json()
        console.log("사진리스트", response_json)

        if (response_json.length == 0) {
            if (page != 0) {
                showToast('마지막페이지 입니다!')
                page = page - page
                window.location.href = window.location.href.split('&')[0] + '&page=' + page
            }
        }


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
        $('#basic-photo').empty()
        if (response_json.length === 0) {
            let temp_html = `<div style="all: unset; display: flex; justify-content: center; align-items: center; height: 100%; margin-top:50px;">
                                <img class="empty-img" src="/css/assets/basicphoto.png" alt="Empty Group Image" onclick="removeRedLine()" data-bs-toggle="modal" data-bs-target="#photo"
                                style="width:150px; height:150px; margin-top:50px; cursor:pointer;">
                            </div>`

            $('#basic-photo').append(temp_html);

        } else {
            response_json.forEach((a) => {
                const image = a["image"];
                const title = a['title'];
                const photo_id = a['id'];

                let temp_html = `<div class="gallery-item">
                            <a class="gallery-image" href="" onclick="photo_detail('${photo_id}')" data-bs-toggle="modal" data-bs-target="#photo-detail">
                                <img class="gallery-image" src="${backend_base_url}${image}" alt="${title}">
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
    } catch (error) {
        console.log(error)
    }
}


// 페이지 로드 시 앨범 표시
window.addEventListener('DOMContentLoaded', album);


function p_page() {
    params = new URLSearchParams(window.location.search);
    page = params.get("page");

    if (!page) {
        page = 0
    }
    page = page * 1 + 6
    window.location.href = window.location.href.split('&')[0] + '&page=' + page
}

function m_page() {
    params = new URLSearchParams(window.location.search);
    page = params.get("page");

    if (!page) {
        page = 0
    }
    page = page * 1 - 6

    if (page < 0) {
        showToast('첫페이지 입니다!')
        return fals
    }
    window.location.href = window.location.href.split('&')[0] + '&page=' + page
}


// 상세페이지 모달
async function photo_detail(photo_id) {
    //각 사진마다 photo_id를 갖고 있기에 그에 맞는 정보를 갖고올 수 있도록 받아온다.

    $('#photo-edit').empty();
    let temp_html0 = `<div class="row">
                            <div class="col-md-7">
                                <!-- 사진 왼쪽 부분 -->
                                <div id="photo-deta">
                                </div>
                            </div>
                            <div class="col-md-5">
                                <!--오른쪽에 정보와 댓글 부분 -->
                                <div id="photo-info"></div>
                                <!-- 정보 내용 추가 -->
                            </div>
                        </div>`
    $('#photo-edit').append(temp_html0)
    $('#photo-deta').empty();
    $('#photo-info').empty();
    const response = await fetch(`${backend_base_url}/note/photo-detail/${photo_id}`, {
        headers: {
            'content-type': 'application/json',
            'Authorization': `Bearer ${access_token}`,
        },
        method: 'GET',
    })
    //해당 url에 저장된 값을 수정
    const response_json = await response.json()

    const image = response_json["image"];
    const name = response_json["name"]
    const start = response_json["start"]
    const title = response_json["title"]
    const location = response_json["location"]
    const memo = response_json["memo"] || '' //메모는 입력값이 없을때 공백으로 취급
    const comments = response_json["comment_set"]


    const modalTitle = document.getElementById("modal-title")
    modalTitle.innerText = `${name}`


    let temp_html1 = `
                    <img class="detail-image" src="${backend_base_url}${image}"id='photo_image' style="height:500px;">
                    `;
    $('#photo-deta').append(temp_html1)

    let temp_html2 = `
    <div id='photo_start' style="float: right; margin-bottom:5px; ">${start}</div>
    <div style="display: flex; flex-direction: column;">
        <div id='photo_memo' style="font-size:22px;margin-bottom: 10px;">${memo}</div>
        <div id='photo_title' style="margin-bottom:5px;">${title}</div> 
        <div style="display: flex; align-items: center;">
            <img src="/css/assets/marker.png" alt="Image" style="width: 15px; height: 20px; margin-right: 5px; margin-bottom: 10px;">
            <div id='photo_location' style="font-size:20px; margin-bottom: 10px;">${location}</div>
        </div>
    </div>
    
    <div style="display: flex; align-items: center;">
        <img src="/css/assets/comment.png" alt="Image" style="width: 30px; height: 30px; margin-right: 5px;">
        <input name="comment" id="comment" type="textarea" class="form-control" placeholder="comment">
        <button type="button" id="commentBtn" value="${photo_id}" onclick="addComment()" class="btn btn-secondary" 
        style="background-color:  #7689b1; font-size: 20px; border-color: #7689b1; height: 37px;  display: flex; justify-content: center; align-items: center;">등록</button>
    </div>
    <hr/>
    <div>
    <style>
        .comment_set div:hover {
            background-color: #f5f5f5;
        }
    </style>
    <div class="comment_set">
    ${comments.map(comment => `<b>${comment.user}</b>
                                <p style="float: right; color: gray;">${comment.created_at.split("T")[0]}</p>
                                <div id="comment-$comment-${comment.id}" value="${comment.user}" style="width: 100%; margin-bottom: 10px;" onclick="toggleCommentEdit(event)" >
                                    ${comment.comment}
                                    <div style="display: none;">
                                        <input name="comment_edit" id="comment_edit${comment.id}" type="text" class="form-control" style="padding: 10px;"
                                        onclick="event.stopPropagation()" placeholder="수정할 댓글 내용을 입력해주세요.">
                                        <button type="button" id="commentEditBtn${comment.id}" value="${comment.id}" 
                                        onclick="editComment(event)" class="btn btn-primary" style="background-color:  #7689b1; border-color: #7689b1;">수정</button>
                                        <button type="button" id="commentDeleteBtn${comment.id}" value="${photo_id}/${comment.id}" 
                                        onclick="deleteComment(event)" class="btn btn-secondary" style="background-color: #485d86; border-color: #485d86;">삭제</button>
                                    </div>
                                </div>`).join('')}
    </div>
    `;
    $('#photo-info').append(temp_html2)

    $('#photo-detail-modal-footer').empty()

    let temp_html3 = `<button id="patch_photo_box" type="button" class="btn btn-primary"
                            onclick="patchPhotoBox('${photo_id}')" style=" width: 10%; font-size:20px; background-color:  #7689b1; border-color: #7689b1;">수정</button>
                      <button id="photo-trash" type="button" class="btn btn-primary"
                            onclick="handlePhototrash('${photo_id}', '${name}')" style="width: 10%; font-size:20px; background-color: #485d86; border-color: #485d86;">삭제</button>`

    $('#photo-detail-modal-footer').append(temp_html3)
}


function toggleCommentEdit(event) {
    const comments_set = event.target.closest('div');
    const div = comments_set.querySelector('div');
    const user_email = comments_set.getAttribute("value")
    // payload를 모두 문자열로 가져오기
    let storage = localStorage.getItem('payload');
    // 가져온 paylad(JSON 문자열)를 객체, 배열로 변환
    const personObj = JSON.parse(storage);
    let email;
    // user_id 키의 값만 가져오기
    if (personObj) {
        email = personObj['email'];
    }
    if (user_email == email) {
        div.style.display = div.style.display === 'none' ? 'flex' : 'none';
    } else if (user_email != null) {
        showToast("작성자만이 댓글을 수정할 수 있습니다.")

    }
}

let commentItems = document.querySelectorAll('.comment_set div'); // 변수 선언을 밖으로 이동
// 클릭시 이벤트 발생
commentItems.forEach(item => {
    item.addEventListener('click', toggleCommentEdit);
});



function patchPhotoBox(photo_id) {
    // // 수정 창으로 변경합니다.
    // let photo_detail = document.getElementById('photo-d');
    let image = document.getElementById('photo_image');
    let name = checkCode(document.getElementById('modal-title').innerHTML)
    let start = document.getElementById('photo_start').innerHTML;
    let title = checkCode(document.getElementById('photo_title').innerHTML)
    let location = checkCode(document.getElementById('photo_location').innerHTML)
    let memo = checkCode(document.getElementById('photo_memo').innerHTML)
    let imageUrl = image.src;
    var path = imageUrl.split('media/')[1];
    var decodedPath = decodeURIComponent(path);
    let modalContainer = document.getElementById('photo-detail');

    // CSS 클래스 추가/제거
    if (!modalContainer.classList.contains('modal-tall')) {
        modalContainer.classList.add('modal-tall');
    } else {
        modalContainer.classList.remove('modal-tall');
    }

    $('#photo-deta').empty();
    $('#photo-info').empty();
    let temp_html = `<div class="input-group" style="flex-wrap: nowrap; ">
                        <input class="upload-name" id="p_imgbox" src="${backend_base_url}${image}" placeholder="${decodedPath}" multiple
                            accept=".jpg, .png, .jpeg" style="width: 80%; border-radius: 5px 0 0 5px; margin-bottom: 15px;">
                        <label for="image" style="margin-top:0px; height:40px; font-size:20px;  width: 20%; border-radius: 0 5px 5px 0; background-color:  #485D86; display: flex; justify-content: center; align-items: center;">업로드</label>
                        <input type="file" id="image" style="display: none">
                    </div>
                    <div class="input-group-append" style="width: 100%;">
                        <input name="name" id="p_name" type="text" value='${name}' class="form-control"
                            placeholder="사진 타이틀" style="font-size:20px; width: 100%; height:40px; margin-bottom: 15px;">
                        <input name="start" id="p_start" type="date" value='${start}' class="form-control" style="margin-bottom: 15px; font-size:20px;">
                    </div>
                    <div class="input-group" style="flex-wrap: nowrap; margin-bottom: 15px;">
                        <input name="title" id="p_title" value='${title}' type="text" class="form-control"
                            placeholder="목적지(지역명+상호명, 지역명+카테고리)" style="font-size:20px; width: 80%; height:40px;">
                        <button type="button" onclick="searchLocation('2')" class="btn btn-primary"
                            style="margin-top:0px;height:40px; font-size:20px; width: 20%; border-color: #485D86; background-color:  #485D86;">찾기</button>
                    </div>
                    <div class="input-group-append" style="width: 100%; margin-bottom: 15px;">
                        <input name="location" id="p_location" value='${location}' type="text" class="form-control"
                        placeholder="주소" style="font-size:20px; height:40px;" placeholder="주소(검색기능 미사용시 스탬프 기능의 사용이 제한됩니다.)">
                    </div>
                    
                    <div id="search_box2" style="width: 100%;  overflow: auto; height= 30px;"></div>
                    <div class="input-group" style="flex-wrap: nowrap;">
                        <textarea name="memo" id="p_memo" type="textarea" class="form-control" placeholder="memo"
                        style="height:50px; min-height:100px; max-height:200px; width:100%; font-size:20px;" >${memo}</textarea>
                    </div>
                    <input name="p_location_x" id="p_location_x" type="text" class="form-control" hidden>
                        <input name="p_location_y" id="p_location_y" type="text" class="form-control" hidden> `;
    $('#photo-edit').append(temp_html)


    $('#photo-detail-modal-footer').empty()

    let temp_html2 = `<button id="delete_serarch" type="button" class="btn btn-secondary delete_serarch" data-bs-dismiss="modal" style="width: 10%; font-size:20px; background-color:  #7689b1; border-color: #7689b1;">닫기</button>
                      <button id="patch_photo" value='${photo_id}' type="button" class="btn btn-primary"onclick="patchPhoto()" style="width: 10%; font-size:20px; background-color:  #485D86; border-color: #485D86;">저장</button>`

    $('#photo-detail-modal-footer').append(temp_html2)
}



async function patchPhoto() {
    const photo_id = document.getElementById("patch_photo").value;
    const image = document.getElementById("image")
    const name = checkCode(document.getElementById('p_name').value)
    const title = checkCode(document.getElementById('p_title').value)
    const start = document.getElementById('p_start').value;
    const location = checkCode(document.getElementById('p_location').value)
    const memo = checkCode(document.getElementById('p_memo').value)
    const location_x = document.getElementById("p_location_x").value
    const location_y = document.getElementById("p_location_y").value
    let nameBox = document.getElementById("p_name")
    let titleBox = document.getElementById("p_title")

    const formData = new FormData();

    // 기존 이미지를 삭제하기 위해 'delete_image' 파라미터를 추가하여 서버에 전달
    formData.append("delete_image", true);
    // 새로운 이미지가 선택되었을 경우에만 새로운 이미지를 추가합니다.
    if (image.files.length > 0) {
        formData.append("image", image.files[0]);

        if (image.files[0].size > 10 * 1024 * 1024) {
            alert("첨부파일 사이즈는 10MB 이내로 등록이 가능합니다.");
            return false;
        }
    }
    formData.append("name", name);
    formData.append("title", title);
    formData.append("start", start);
    formData.append("location", location);
    formData.append("memo", memo);
    formData.append("location_x", location_x);
    formData.append("location_y", location_y);


    if (name == '' || title == '') {
        showToast('필수요소를 모두 입력해주세요!')
        nameBox.classList.add("custom-class");
        titleBox.classList.add("custom-class");

        return false
    } else {
        nameBox.classList.remove("custom-class");
        titleBox.classList.remove("custom-class");
    }

    try {
        const urlParams = new URLSearchParams(window.location.search);
        // const photo_id = urlParams.get('photo_id');

        const response = await fetch(`${backend_base_url}/note/photo-detail/${photo_id}`, {
            headers: {
                "Authorization": `Bearer ${access_token}`,
            },
            method: 'PATCH',
            body: formData
        });

        if (response.ok) {
            const data = await response.json();
            showToast('이미지가 수정되었습니다!')
            window.location.reload()
        } else {
            throw new Error("서버가 응답하지 않습니다.");
        }
    } catch (error) {
        showToast("에러가 발생했습니다.");
        console.error(error);
        // window.location.reload()
    }
}

//photo_page.html > 사진추가 버튼 옆 업로드 이름 
$(document).ready(function () {
    $("#image").on('change', function () {
        var fileName = $(this).val();
        $(".upload-name").val(fileName);
    });
});


// 코멘트 추가 back과 연결
async function addComment() {
    const photo_id = document.getElementById("commentBtn").value;
    const commentText = checkCode(document.getElementById("comment").value)
    const commentbox = document.getElementById("comment");

    if (!commentText) {
        showToast('댓글을 입력해주세요!')
        commentbox.classList.add("custom-class");
        return false
    }

    if (commentText.trim() === "") {
        showToast("댓글을 입력해주세요.");
        return;
    }

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
            showToast('새로운 댓글이 작성되었습니다!');
            commentText.value = '';
            setTimeout(function () {
                photo_detail(photo_id)
            }, 1500);
            // setTimeout(function () {
            //     window.location.reload();
            // }, 1000);

        } else {
            let response_json = await response.json()
            showToast(response_json['non_field_errors']);
        }

    }
    catch (error) {
        showToast('에러가 발생했습니다.');
        console.error(error);
    }
}


async function editComment(event) {
    var button = event.target;
    const comment_id = button.value;

    const updatedComment = checkCode(document.getElementById(`comment_edit${comment_id}`).value)
    const updatedCommentBox = document.getElementById(`comment_edit${comment_id}`)

    if (!updatedComment) {
        showToast('수정할 댓글을 작성해주세요!')
        updatedCommentBox.classList.add("custom-class");
        return false
    }

    if (updatedComment.trim() === "") {
        showToast("수정할 댓글을 입력해주세요.");
        return;
    }

    try {
        const response = await fetch(`${backend_base_url}/note/comment/${comment_id}`, {
            headers: {
                'content-type': 'application/json',
                "Authorization": `Bearer ${access_token}`,
            },
            method: 'PATCH',
            body: JSON.stringify({ comment: updatedComment })
        });

        if (response.ok) {
            const response_json = await response.json();
            let photo_id = response_json["photo"]
            showToast('댓글이 수정되었습니다!');
            setTimeout(function () {
                photo_detail(photo_id);
            }, 1500);
        } else {
            showToast('댓글이 수정에 실패했습니다!');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}


async function deleteComment(event) {
    var button = event.target;
    const photo_comment_id = button.value;
    const photo_id = photo_comment_id.split("/")[0];
    const comment_id = photo_comment_id.split("/")[1];

    test = confirm("삭제 하시겠습니까?")
    if (!test) {
        return
    }
    try {
        const response = await fetch(`${backend_base_url}/note/comment/${comment_id}`, {
            headers: {
                'content-type': 'application/json',
                "Authorization": `Bearer ${access_token}`,
            },
            method: 'DELETE',
        })
        if (response.ok) {
            showToast('댓글이 삭제되었습니다.');

            photo_detail(photo_id);
            setTimeout(function () {
                photo_detail(photo_id);
            }, 1500);


        } else {
            showToast('댓글이 삭제에 실패했습니다.');
        }
    } catch (error) {
        console.error("댓글 삭제 중 오류 발생", error);
        showToast("댓글 삭제 중 오류 발생")
    }

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
        showToast("※실패")
        console.log(response)
    }
}

checkLogin()


function removeRedLine() {
    let nameBox = document.getElementById("name")
    let titleBox = document.getElementById("title")
    let imgBox = document.getElementById("imgbox")
    nameBox.classList.remove("custom-class");
    titleBox.classList.remove("custom-class");
    imgBox.classList.remove("custom-class");
}

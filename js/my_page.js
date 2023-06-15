checkLogin()

async function loadUserprofile() {

    const response = await getUserprofile();

    console.log(response)

    const email = document.getElementById("email")
    email.innerText = `${response.profile.email}님`

    const groups = response.groups
    const profile = response.profile

    $('#my_groups').empty()
    groups.forEach((group) => {
        const name = group.name

        let temp_html = `<li>${name}`

        if (group.master == profile.email) {
            temp_html += ' <span style="color: red">(master)</span>';
        }

        temp_html += '</li>'
        $('#my_groups').append(temp_html)

    })
}

async function loadStampmap() {
    var container = document.getElementById('stamp-map');
    var options = {
        center: new kakao.maps.LatLng(35.9424, 127.661),
        level: 13
    };
    var map = new kakao.maps.Map(container, options);

    var imageSrc = "/css/assets/stamp-marker3.png",
        imageSize = new kakao.maps.Size(64, 69),
        imageOption = { offset: new kakao.maps.Point(27, 69) };

    const response = await getUserprofile();

    const stamps = response.stamps

    var markerGroups = []

    stamps.forEach((stamp) => {
        const location = stamp.photo.location
        const location_x = stamp.photo.location_x
        const location_y = stamp.photo.location_y
        const photo_status = stamp.photo.status
        const status = stamp.status

        if (photo_status == 0 && status == 0) {

            if (markerGroups[location]) {
                return
            }

            var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption)
            var markerPosition = new kakao.maps.LatLng(location_x, location_y)
            var iwContent = '<div style="padding:5px;">' + location + '</div>'

            var marker = new kakao.maps.Marker({
                position: markerPosition,
                image: markerImage,
                clickable: true
            });

            var infowindow = new kakao.maps.InfoWindow({
                content: iwContent
            });

            marker.setMap(map);

            kakao.maps.event.addListener(marker, 'mouseover', function () {
                infowindow.open(map, marker);
            });

            kakao.maps.event.addListener(marker, 'mouseout', function () {
                infowindow.close();
            });

            kakao.maps.event.addListener(marker, 'click', function () {
                $('#stamp-modal').modal('show');
                loadStampPhotopage(location)
            });

            markerGroups[location] = marker
        }
    })
}

async function getMarkerStamps(photo_location) {
    let token = localStorage.getItem("access")

    const response = await fetch(`${backend_base_url}/note/markerstamps/${photo_location}`, {
        headers: {
            "Authorization": `Bearer ${token}`
        },
        method: 'GET'
    })

    if (response.status == 200) {
        const response_json = await response.json()
        return response_json
    } else {
        alert("불러오는데 실패했습니다")
    }
}

// async function loadStampPhotopage(location) {

//     const response = await getMarkerStamps(location);

//     const title = document.getElementById("stamp-modal-title")
//     title.innerText = response[0].photo.location

//     console.log(response)


//     $('#stamp-modal-body').empty()

//     const addedDiaryNames = []

//     response.forEach((stamp) => {
//         const diary_id = stamp.photo.diary_id
//         const diary_name = stamp.photo.diary_name
//         const image = backend_base_url + '/note' + stamp.photo.image
        
//         if (!addedDiaryNames.includes(diary_name)) {
//             let diary_temp_html = ` <br>
//                                     <a href='/photo_page.html?=note_id=${diary_id}' style="text-decoration: none; color: black;">
//                                         <span class="diary-link-text">${diary_name} ></span>
//                                     </a>
//                                     <br>
//                                     <img src="${image}" alt="Image description" style="max-width: 100%; max-height: 100%;">                                      
//                                     `

//             $('#stamp-modal-body').append(diary_temp_html)
//             addedDiaryNames.push(diary_name)

//         } else {
//             let diary_temp_html = `<img src=${image} alt="Image description" style="max-width: 100%; max-height: 100%;">`
//             $('#stamp-modal-body').append(diary_temp_html)
//         }
//     });
// }

async function loadStampPhotopage(location) {
    const response = await getMarkerStamps(location);

    const title = document.getElementById("stamp-modal-title");
    title.innerText = response[0].photo.location;

    console.log(response);

    $('#stamp-modal-body').empty();

    const addedDiaryNames = [];
    let photoRowHtml = '';  // 한 줄에 대한 HTML 문자열
    let photoCount = 0;  // 사진 개수를 세는 변수

    response.forEach((stamp) => {
        const diary_id = stamp.photo.diary_id;
        const diary_name = stamp.photo.diary_name;
        const image = backend_base_url + '/note' + stamp.photo.image;

        if (!addedDiaryNames.includes(diary_name)) {
            if (photoCount % 3 === 0 && photoCount !== 0) {
                // 한 줄에 3개의 사진을 배치한 경우, 이전 줄을 추가하고 새로운 줄을 시작합니다.
                let rowHtmlWrapper = `<div class="photo-row">${photoRowHtml}</div>`;
                $('#stamp-modal-body').append(rowHtmlWrapper);
                photoRowHtml = '';
            }

            // 새로운 사진을 추가합니다.
            const photoHtml = `<div class="photo">
                                    <a href='/photo_page.html?=note_id=${diary_id}' style="text-decoration: none; color: black;">
                                        <span class="diary-link-text">${diary_name} ></span>
                                    </a>
                                    <br>
                                    <img src="${image}" alt="Image description" style="max-width: 100%; max-height: 100%;">
                                </div>`;
            photoRowHtml += photoHtml;
            addedDiaryNames.push(diary_name);
            photoCount++;
        }
    });

    // 마지막 줄에 대한 HTML을 추가합니다.
    if (photoRowHtml !== '') {
        let rowHtmlWrapper = `<div class="photo-row">${photoRowHtml}</div>`;
        $('#stamp-modal-body').append(rowHtmlWrapper);
    }
}
    
loadUserprofile()
loadStampmap()

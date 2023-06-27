async function loadUserprofile() {

    const response = await getUserprofile();

    const email = document.getElementById("email")
    email.innerText = `${response.profile.email}님`

    const groups = response.groups
    const profile = response.profile

    let id = [];

    $('#my_groups').empty()
    groups.forEach((group) => {
        const name = group.name
        const group_id = group.id

        if (!id.includes(group_id)) {

            let temp_html = `<li onclick="loadGroupStampmap('${name}')" style="cursor: pointer;">${name}`

            if (group.master == profile.email) {
                temp_html += ' <span style="color: red">(captain)</span>';
            }

            temp_html += '</li>'
            $('#my_groups').append(temp_html)

            id.push(group_id)
        }
    })
}

async function loadStampmap() {
    var container = document.getElementById('stamp-map');
    var options = {
        center: new kakao.maps.LatLng(35.9424, 127.661),
        level: 13
    };
    var map = new kakao.maps.Map(container, options);

    var imageSrc = "/css/assets/stamp-marker.png",
        imageSize = new kakao.maps.Size(64, 69),
        imageOption = { offset: new kakao.maps.Point(27, 69) };

    const response = await getUserprofile();

    const stamps = response.stamps

    var markerGroups = []

    stamps.forEach((stamp) => {
        const location = stamp.photo.location
        const location_x = stamp.photo.location_y
        const location_y = stamp.photo.location_x
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
        console.log(response_json)
        return response_json
    } else {
        showToast("불러오는데 실패했습니다")
    }
}

async function loadStampPhotopage(location) {

    const response = await getMarkerStamps(location);

    const title = document.getElementById("stamp-modal-title")
    title.innerText = response[0].photo.location

    $('#stamp-modal-body').empty()

    const addedDiaryNames = []

    response.forEach((stamp) => {
        const diary_id = stamp.photo.diary_id
        const diary_name = stamp.photo.diary_name
        const image = backend_base_url + '/note' + stamp.photo.image

        if (!addedDiaryNames.includes(diary_name)) {
            let diary_temp_html = ` <a href='/photo_page.html?note_id=${diary_id}' onclick="" style="text-decoration: none; color: black;">
                                        <div class="diary-link-text" style="margin-top:10px;">${diary_name} ></div></a>
                                    <img src="${image}" alt="Image description" style="width: 142px; height: 142px; margin-left:2px;">                                      
                                  `
            $('#stamp-modal-body').append(diary_temp_html)
            addedDiaryNames.push(diary_name)

        } else {
            let diary_temp_html = `<img src=${image} alt="Image description" class="stamp-photo">`
            $('#stamp-modal-body').append(diary_temp_html)
        }
    });
}

async function loadGroupStampmap(group_name) {
    var container = document.getElementById('stamp-map');
    var options = {
        center: new kakao.maps.LatLng(35.9424, 127.661),
        level: 13
    };
    var map = new kakao.maps.Map(container, options);

    var imageSrc = "/css/assets/stamp-marker.png",
        imageSize = new kakao.maps.Size(64, 69),
        imageOption = { offset: new kakao.maps.Point(27, 69) };

    const response = await getUserprofile();

    const stamps = response.stamps

    var markerGroups = []

    stamps.forEach((stamp) => {
        const location = stamp.photo.location
        const location_x = stamp.photo.location_y
        const location_y = stamp.photo.location_x
        const photo_status = stamp.photo.status
        const status = stamp.status
        const group = stamp.photo.group_name

        if (group == group_name && photo_status == 0 && status == 0) {

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

checkLogin()
loadUserprofile()
loadStampmap()

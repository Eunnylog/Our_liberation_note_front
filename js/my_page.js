checkLogin()

async function loadUserprofile() {

    const response = await getUserprofile();

    const email = document.getElementById("email")
    email.innerText = `${response.profile.email}님`

    const groups = response.groups
    const profile = response.profile

    console.log(response)

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

loadUserprofile();

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

    stamps.forEach((stamp) => {
        const location_x = stamp.photo.location_x
        const location_y = stamp.photo.location_y
        const memo = stamp.photo.memo
        const diary = stamp.photo.diary

        console.log(diary)

        var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption)
        var markerPosition = new kakao.maps.LatLng(location_x, location_y)
        var iwContent = '<div style="padding:5px;">' + memo + '</div>'

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
            window.location.href = `/photo_page.html?=note_id=${diary}`
        });

    })
}

loadStampmap()

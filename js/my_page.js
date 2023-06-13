checkLogin()

async function loadUserprofile() {

    const response = await getUserprofile();

    console.log(response)
    console.log(response.groups)

    const nickname = document.getElementById("nickname")
    nickname.innerText = `${response.profile.nickname}님`

    const groups = response.groups
    const profile = response.profile

    $('#my_groups').empty()
    groups.forEach((group) => {
        const name = group.name
        console.log(name)

        let temp_html = `<li>${name}`

        if (group.master == profile.nickname) {
            temp_html += ' <span style="color: red">(master)</span>';
        }

        temp_html += '</li>'
        $('#my_groups').append(temp_html)

    })
}

loadUserprofile();

var container = document.getElementById('stamp-map'); //지도를 담을 영역의 DOM 레퍼런스
var options = { //지도를 생성할 때 필요한 기본 옵션
	center: new kakao.maps.LatLng(35.9424,127.661), //지도의 중심좌표.
	level: 13 //지도의 레벨(확대, 축소 정도)
};

var map = new kakao.maps.Map(container, options); //지도 생성 및 객체 리턴

var imageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png', // 마커이미지의 주소입니다    
    imageSize = new kakao.maps.Size(64, 69), // 마커이미지의 크기입니다
    imageOption = {offset: new kakao.maps.Point(27, 69)}; // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.
      
// 마커의 이미지정보를 가지고 있는 마커이미지를 생성합니다
var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption),
    markerPosition = new kakao.maps.LatLng(37.54699, 127.09598); // 마커가 표시될 위치입니다

// 마커를 생성합니다
var marker = new kakao.maps.Marker({
    position: markerPosition, 
    image: markerImage // 마커이미지 설정 
});

// 마커가 지도 위에 표시되도록 설정합니다
marker.setMap(map);  
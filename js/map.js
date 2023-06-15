async function searchLocation() {
    const REST_API_KEY = api_key.KAKAO;
    const query = document.getElementById('title').value;

    const url = `https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent(query)}`;
    const headers = {
        'Authorization': `KakaoAK ${REST_API_KEY}`
    };

    axios.get(url, { headers })
        .then(response => {
            const places = response.data.documents;
            var searchBox = document.getElementById('search_box');
            searchBox.style.height = '200px';
            searchBox.style.padding = '20px';
            searchBox.style.margin = '20px auto 20px auto';
            // 검색 결과 처리
            $('#search_box').empty();
            places.forEach((place, index) => {
                const address_name = place.address_name
                const place_name = place.place_name
                const place_url = place.place_url
                const place_category = place.category_group_name
                const location_x = place.x
                const location_y = place.y


                let temp_html = `
                                <div style="display: flex; align-items: center; justify-content: space-between; margin: 20px auto;">
                                    <div>
                                        <h3 style="font-size: 15px; margin-bottom: 5px;" id='name_${index}' >${place_name} / ${place_category}</h3>
                                        <a href="${place_url}" id='address_${index}' target="_blank" style="font-size: 15px; color: black;">${address_name}</a>
                                    </div>
                                    <div style="display: flex; align-items: center;">
                                    <input type="radio" name="address_radio" value="${index}" style="width: 10px; margin-right: 10px;" onclick="handleRadio()">
                                        <label for="${index}" style="font-size: 15px;">선택</label>
                                    <input id='x_${index}' value="${location_x}" hidden>
                                    <input id='y_${index}' value="${location_y}" hidden>
                                    </div>
                                </div>
                                <hr>
                                <br>
                            `
                $('#search_box').append(temp_html);
            });
        })
        .catch(error => {
            // 에러 처리
            console.error(error);
            alert('문제가 발생했습니다!')
        });
        
}

function handleRadio() {
    var selectedRadio = document.querySelector('input[name="address_radio"]:checked');
    if (selectedRadio) {
        let selectedIndex = selectedRadio.value;
        let selected_address = document.getElementById(`address_${selectedIndex}`).innerText;
        let selected_name = document.getElementById(`name_${selectedIndex}`).innerText;
        let location_x = document.getElementById(`x_${selectedIndex}`).value;
        let location_y = document.getElementById(`y_${selectedIndex}`).value;
        let name = selected_name.split('/')[0].trim();
        let splitName = selected_name.split('/');
        let category = splitName[splitName.length - 1].trim();
        // 선택한 요소에 대한 처리
        document.getElementById("location").value = selected_address;
        document.getElementById("title").value = name;
        document.getElementById("category").value = category;
        document.getElementById("location_x").value = location_x;
        document.getElementById("location_y").value = location_y;
    }
}

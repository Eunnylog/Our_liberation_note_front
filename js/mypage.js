let back_url = 'https://api.miyeong.net'
// Access Token 값 불러오기
const access_token = localStorage.getItem("access");

// payload 값 가져오기 -> name, user_id 가능!
const payload = localStorage.getItem('payload')
const payload_parse = JSON.parse(payload)
const user = JSON.parse(payload)['nickname']
console.log(payload_parse)

// 사용자의 ID 값을 추출하여 변수에 할당
const username = user

console.log(payload, user)
function userBox() {
    const usernickname = document.getElementById("mypage-nickname")
    usernickname.innerText = `${user} 님 안녕하세요!`

}

async function getGroups() {
    const response = await fetch(`${back_url}/user/group/`, {
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("access")
        },
        method: "GET"
    })
    if (response.status == 200) {
        const response_json = await response.json()
        console.log(response_json)
        response_json.forEach(a => {
        //     const group_id = a['id']
            const group_name = a['name']
        //     const product = a['product']
        //     const total_quantity = a['total_quantity']
        //     const writer = a['writer']
            console.log(group_name)

            let groupList = document.getElementById("group-list")
            let newLi = document.createElement("li")
            newLi.innerText = group_name

            groupList.appendChild(newLi)


        //     let temp_html2 = `    
        //                     <div class="col w-75 mx-auto">
        //                         <div class="card h-100">
        //                             <img src="${backend_base_url}${image}" class="card-img-top w-25 h-50" alt="...">
        //                             <div class="card-body">
        //                                 <h5 class="card-title">${product}</h5>
        //                                 <p class="card-text">${price}원</p>
        //                                 <p class="card-text">남은 수량: ${total_quantity}개</p>
        //                             </div>
        //                         </div>
        //                     </div>
        //                 `;
        //     $('#product-list').append(temp_html2);

        })
    } else {
        alert("제품리스트를 불러오는데 실패했습니다")
    }

}

userBox()
getGroups()
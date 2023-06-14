let back_url = 'https://api.miyeong.net'
// Access Token 값 불러오기
const access_token = localStorage.getItem("access");

// payload 값 가져오기 -> name, user_id 가능!
const payload = localStorage.getItem('payload')
const payload_parse = JSON.parse(payload)
const user = JSON.parse(payload)['email']
console.log(payload_parse)

// 사용자의 ID 값을 추출하여 변수에 할당
const username = user

console.log(payload, user)
function userBox() {
    const usernickname = document.getElementById("mypage-nickname")
    usernickname.innerText = `${user}`

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
            const group_name = a['name']
            console.log(group_name)

            let groupList = document.getElementById("group-list")
            let newLi = document.createElement("li")
            newLi.innerText = group_name

            groupList.appendChild(newLi)

        })
    } else {
        alert("제품리스트를 불러오는데 실패했습니다")
    }

}

userBox()
getGroups()
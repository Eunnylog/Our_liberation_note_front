// // 백엔드 연결하기
// // 사진 추가하기
// async function addPhoto() {
//     const img = document.getElementById("img");
//     const title = documentl.getElementById("title").value;
//     const location = document.getElementById("location").value;
//     const status = document.getElementById("status").value;
//     const memo = document.getElementById("memo").value;


//     const formData = new FormData();
//     formData.append("image", img.files[0]);
//     formData.append("title", title);
//     formData.append("location", location);
//     formData.append("status", status);
//     formData.append("memo", memo);



//     response = await fetch(`http://127.0.0.1:8000/photo/`, {
//         headers: {
//             // 'Authorization': `Bearer ${accessToken}`
//         },
//         method: 'POST',
//         body: formData
//     })

//         .then(response => response.json())

//         .then(data => {
            
//         })

//         .catch(error => {
//             alert("에러가 발생했습니다.");
//         });
// }

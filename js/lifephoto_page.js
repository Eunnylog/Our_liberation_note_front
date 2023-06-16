// input에 들어간 파일을 사진 넣기 버튼을 눌렀을때 넣어주는 함수
document.querySelector("#input-button").addEventListener('click',()=>{
    // input으로 들어간 파일의 주소 가져오기
    let selectFile1 = document.querySelector("#formFile1").files[0];
    let selectFile2 = document.querySelector("#formFile2").files[0];
    let selectFile3 = document.querySelector("#formFile3").files[0];
    let selectFile4 = document.querySelector("#formFile4").files[0];

    console.log(selectFile1,selectFile2,selectFile3,selectFile4);

    // 받아온 정보를 파일에 넣어주기
    const file1 = URL.createObjectURL(selectFile1);
    const file2 = URL.createObjectURL(selectFile2);
    const file3 = URL.createObjectURL(selectFile3);
    const file4 = URL.createObjectURL(selectFile4);
    
    // document.querySelector(".photo-frame").src.empty()

    // 정보가 담긴 파일을 지정한 장소에 넣어주기
    // 양쪽이 같은 파일을 보여주게 파일 하나를 두개 아이디에 각각 넣어줌
    // 파일1 
    document.querySelector("#image1").src = file1;
    document.querySelector("#image5").src = file1;

    // 파일2
    document.querySelector("#image2").src = file2;
    document.querySelector("#image6").src = file2;

    // 파일3
    document.querySelector("#image3").src = file3;
    document.querySelector("#image7").src = file3;

    // 파일4
    document.querySelector("#image4").src = file4;
    document.querySelector("#image8").src = file4;
    
    // input 값 초기화
    let formFile1 = document.querySelector("#formFile1")
    let formFile2 = document.querySelector("#formFile2")
    let formFile3 = document.querySelector("#formFile3")
    let formFile4 = document.querySelector("#formFile4")
    
    formFile1.value = null;
    formFile2.value = null;
    formFile3.value = null;
    formFile4.value = null;
  })
// 해방필름 사전 png로 저장하는 로직
  function PrintDiv(div){
    div = div[0];
    html2canvas(div).then(function(canvas){
        let myFilm = canvas.toDataURL();
        downloadURL(myFilm, "liberation-film.png");
    });
  }

  function downloadURL(uri, name){
    let link = document.createElement("a");
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click()
  }

  $('#save-button').click(function(){
    PrintDiv($('#photo-container'));
  })
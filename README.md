![footer](https://capsule-render.vercel.app/api?section=footer&height=350&text=Our%20liberation%20note!&color=6FC7E1&desc=우리들의%20해방%20일지&)

## 목차 🎊
- 🏝 프로젝트 소개
- 💡 프로젝트 기획 의도
- ℹ️ 웹사이트 정보
- 🛠 기능 설명
- 🚀 Stacks
- 🧰 Stack 선택한 이유
- 🔗 Link
<br>
<br>


## 🏝 프로젝트 소개 
  - 친구들과의 여행 계획 및 사진첩 공유와 여행 루트를 짜주는 AI기능을 제공하는 시크릿 사이트!

<br>
<br>

## 💡 프로젝트 기획 의도
  - 친구들과의 여행 계획 및 사진첩 공유와 여행 루트를 짜주는 AI기능을 제공하는 시크릿 사이트입니다!
  - 최근에는 여러가지의 SNS가 유행하고 있으며 여러 사람들에게 자신들의 인생을 공유하고 있으나 그럴때일수록 친한 친구들과의 추억을 더욱 소중하고 프라이빗하게 보관할 수 있는 사이트가 있으면 좋겠다는 생각을 했습니다.
  - 기획 진행하며 다이어리는 앱용이 적절하다는 의견이 있었고, 그 부분을 보안하기 위해 웹사이트만의 장점을 살릴 수 있는 MBTI 테스트와 AI 요소를 추가해 지금의 웹사이트가 탄생하게 되었습니다!
  - 사용자의 입장에서 흥미로운 요소들과 기능들을 선별하고 구현하기 위해 팀원들과 함께 많은 노력을 기울였습니다.
  - 프라이빗함이 핵심 키워드이기 때문에 웹사이트의 기능을 온전히 즐기기 위해선 그룹 생성이 필수입니다. 가입과 동시에 그룹이 생성이 됩니다!
  - 그룹과 노트를 생성한 후, 노트 상세 페이지에서 다양한 기능들을 확인할 수 있습니다. 일정추가, 사진첩 생성, AI랑 놀기, 계획표 전송, 해방 필름을 만나 볼 수 있습니다!
  - 항목들을 삭제 시 휴지통으로 이동되며 휴지통 창에서 복원 또는 완전 삭제를 선택할 수 있습니다!
  - AI 기능은 결제를 통해서 사용할 수 있으며 그룹에서 한 사람만 결제해도 그룹 전체의 인원이 AI 기능을 사용할 수 있습니다! (테스트 결제라 실결제는 이뤄지지 않습니다!)
  - AI은 작성한 일정을 가져와 선택하여 각 목적지들을 비교해서 거리를 기준으로 최적의 경로를 제공하고, openai를 통해 목적지들 주변의 명소들을 추천 받습니다! 그 후 웹크롤링을 통해 관련 블로그링크를 제공합니다.


<br>


## ℹ️ 웹사이트 정보
![info1](https://github.com/Msgun7/Our_liberation_note/assets/125116878/efbd95e1-56f5-450d-a552-181e9885cdb4)
![info2](https://github.com/Msgun7/Our_liberation_note/assets/125116878/8da5b50b-e79c-44a6-8b14-ebb780fee1bd)


<br>
<br>


## 🛠 기능 설명 (중요도 ⭐️로 표시!)

<br>

<details>
  <summary>유저 (⭐️⭐️⭐️⭐️⭐️) - 정은</summary>
  
     - 일반 로그인 & 이메일 인증
     - 카카오, 구글, 네이버 소셜 로그인 ➡️ allauth 라이브러리 사용 X
</details>

<br>

<details>
  <summary>사진첩 (⭐️⭐️⭐️⭐️⭐️) - 제건</summary>
  
     - 사진 저장 및 메모 ( 사진 저장 시 위치도 같이 저장할 수 있음)
     - 사진 댓글
</details>

<br>

<details>
  <summary>계획기능 (⭐️⭐️⭐️⭐️⭐️) - 미영</summary>
  
     - 달력에 일정 저장 및 계획 결과물을 Email로 전송
     - email은 웹 특성상 알림보다 확인용이 맞을 것이라고 판단 -> 알림용❌ 확인용⭕️
</details>

 <br>

<details>
  <summary>여행 지도 스탬프기능 (⭐️⭐️⭐️⭐️) - 예린</summary>
  
     - 여행간 곳에 스탬프가 생기고 그 장소의 사진(or 스티커)를 한번에 모아 볼 수 있음
</details>

<br>

<details>
  <summary>기본기능 (⭐️⭐️⭐️⭐️⭐️) - 예지</summary>
  
     - 유저 마이페이지(노트들 모아두는 곳)
    - 노트 생성(페이지들을 묶어주는 요소)
</details>

<br>

<details>
  <summary>그룹 (⭐️⭐️⭐️⭐️⭐️) - 정은</summary>
  
    - 프라이빗한 주제에 맞게 다이어리 작성 전 그룹 생성
    - 그룹장이 팀원의 email을 저장하는 형식
</details>
 
 <br>

<details>
  <summary>여행 궁합 테스트 (⭐️⭐️⭐️⭐️) - 예린</summary>
  
    - 여행 mbti 테스트를 진행해 친구와 궁합을 맞춰 볼 수 있는 기능
    - 보너스 기능 → 유저가 아니여도 사용 가능
</details>

<br>

<details>
  <summary>알고리즘(국내용! 베타버전)(⭐️⭐️⭐️) - 미영</summary>
  
    - 여행지 코스를 고민하는 유저들을 위해 대신 계획 해주는 ai(장소의 좌표를 보고 최단거리로 순서대로 계획해줌)
    - 해당 장소를 지도에 스탬프 찍어서 모달에 보여주기
</details>

<br>

<details>
  <summary>여행사진을 인생네컷처럼  바꿔주기 (⭐️⭐️⭐️) - 예지</summary>

    - 유저의 흥미를 끌기 위한 기능 중 하나!
    - 가로 버전, 세로 버전 취향에 맞춰 선택 가능
</details>

<br>

<details>
  <summary>결제기능 (⭐️⭐️) - 미영</summary>

    - 코스 정해주는 ai 사용 가능
    - 가로 버전, 세로 버전 취향에 맞춰 선택 가능
</details>

<br>

<details>
  <summary>이미지 컨펌 기능! (⭐️⭐️⭐️) - 미영</summary>

    - 코스 정해주는 ai 사용 가능
    - 가로 버전, 세로 버전 취향에 맞춰 선택 가능
</details>

<br>

<details>
  <summary>휴지통 기능 (⭐️⭐️⭐️) - 예린</summary>

    - 그룹, 사진, 노트를 삭제하면 휴지통으로 이동
    - 휴지통에서 복원&삭제 선택 가능
</details>

<br>

<details>
  <summary>✨Front PM - 예지</summary>

    - 예술 팀장
</details>


 <br>

 
## 🚀 Stacks


![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)


<br>


## 🌏 Deployment Tools
[![AWS](https://img.shields.io/badge/AWS-%23FF9900?style=for-the-badge&logo=Amazon-AWS&logoColor=white)](https://aws.amazon.com/)
![GitHub Actions](https://img.shields.io/badge/GitHubActions-2088FF?style=for-the-badge&logo=GitHubActions&logoColor=white)
[![S3](https://img.shields.io/badge/S3-%23169BF7?style=for-the-badge&logo=Amazon-S3&logoColor=white)](https://aws.amazon.com/s3/)
[![CloudFront](https://img.shields.io/badge/CloudFront-%23F5851C?style=for-the-badge&logo=Amazon-CloudFront&logoColor=white)](https://aws.amazon.com/cloudfront/)


<br>


## 🛠  Tools
[![Figma](https://img.shields.io/badge/Figma-F24E1E?style=for-the-badge&logo=Figma&logoColor=white)](https://www.figma.com/)
![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=Git&logoColor=white)
![KakaoTalk](https://img.shields.io/badge/kakaotalk-ffcd00.svg?style=for-the-badge&logo=kakaotalk&logoColor=000000)
![ChatGPT](https://img.shields.io/badge/chatGPT-74aa9c?style=for-the-badge&logo=openai&logoColor=white)


<br>


## 👥  Collaboration
[![Slack](https://img.shields.io/badge/Slack-4A154B?style=for-the-badge&logo=Slack&logoColor=white)](https://slack.com/)
![Notion](https://img.shields.io/badge/Notion-000000?style=for-the-badge&logo=notion&logoColor=white)
![GitHub](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white)


<br>


## 🔗 Link
- [🌟Backend Github]([https://github.com/ORN-group/Our_liberation_note_front](https://github.com/Msgun7/Our_liberation_note))↗️

- 참고 사이트
  - [카카오 Maps API](https://apis.map.kakao.com/web/sample/multipleMarkerEvent/)
 
- ⚙️ Developers
  - [❤️연제건(팀장)](https://github.com/Msgun7)
  - [💚김미영](https://github.com/kmy9810)
  - [💙김정은](https://github.com/Eunnylog)
  - [💜양예린](https://github.com/yell2023)
  - [💛최예지](https://github.com/choiyeji2022)

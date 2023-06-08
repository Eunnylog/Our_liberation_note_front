let category_id = "1";
let recipe_total = 0

function RecipeList(event) {
  localStorage.setItem("page", 0)
  const url = new URLSearchParams(window.location.search)
  const category = url.get("category_id")

  if (category) {
    category_id = category
  }

  recipe_total = 0
  // 페이징을 위한 숫자 불러오기
  P_Page()
}

RecipeList()

async function P_Page() {
  let p_offset = localStorage.getItem('page') * 1
  if (p_offset > recipe_total) {
    alert("마지막 페이지 입니다")
  } else {
    const response = await fetch(`${backend_base_url}/recipe-list/${category_id}/${p_offset}/`, {
      headers: {
        'content-type': 'application/json',
      },
      method: 'GET',
    })
    const response_json = await response.json()
    //레시피 총개수 한번만 저장
    if (recipe_total == 0) {
      recipe_total = response_json['total']
    }


    $('#recipe_list').empty()
    response_json['data'].forEach((a) => {
      const name = a['name']
      const main_img = a['main_img']
      const kcal = a['kcal']
      const recipe_id = a['id']

      let temp_html1 = `<a href="/recipe_detail.html?recipe_id=${recipe_id}">
                                <section class="cp-card content" style="height:300px; padding:10px;">
                                    <div class="thumb" style="background-image: url(${main_img}); border-radius:20%">
                                    </div>
                                    <div class="body">
                                        <h4 style="font-size:15px;">${name}</h4>
                                        <div class="metadata" style="margin-top:2px; float:right;">
                                            <div class="review-rating">
                                                <span class="cp-stars"style="font-size:15px;">
                                                    ${kcal}kcal
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            </a>`;
      $('#recipe_list').append(temp_html1);
    })
    localStorage.setItem('page', p_offset + 8)
  }
  // 현재 페이지 위치를 보여주는 곳
  $('#page_num').empty()
  let page_num_html = `<h5>${p_offset / 8 + 1} 페이지 / ${parseInt(recipe_total / 8) + 1} 페이지</h5>`
  $('#page_num').append(page_num_html);

}



async function M_Page() {
  //다음 버튼 눌렀다 뒤로 오면 -16~ -> -8 하면 그자리
  let m_offset = localStorage.getItem('page') * 1 - 16
  if (localStorage.getItem('page') * 1 - 8 <= 0) {
    alert('첫 페이지 입니다!')
  } else {
    localStorage.setItem('page', m_offset + 8)
  }

  const response = await fetch(`${backend_base_url}/recipe-list/${category_id}/${m_offset}/`, {
    headers: {
      'content-type': 'application/json',
      // 'Authorization': `Bearer ${accessToken}`
    },
    method: 'GET',
  })
  const response_json = await response.json()
  $('#recipe_list').empty()

  response_json['data'].forEach((a) => {
    const name = a['name']
    const main_img = a['main_img']
    const kcal = a['kcal']
    const recipe_id = a['id']

    let temp_html1 = `<a href="/recipe_detail.html?recipe_id=${recipe_id}">
                            <section class="cp-card content" style="height:300px; padding:10px;">
                                <div class="thumb" style="background-image: url(${main_img}); border-radius:20%">
                                </div>
                                <div class="body">
                                    <h4 style="font-size:15px;">${name}</h4>
                                    <div class="metadata" style="margin-top:2px; float:right;">
                                        <div class="review-rating">
                                            <span class="cp-stars"style="font-size:15px;">
                                                ${kcal}kcal
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </a>`;
    $('#recipe_list').append(temp_html1);
  })

  $('#page_num').empty()
  let page_num_html = `<h5>${m_offset / 8 + 1} 페이지 / ${parseInt(recipe_total / 8) + 1} 페이지</h5>`
  $('#page_num').append(page_num_html);

}

// 가장 최근에 본 레시피
async function LastRecipe() {
  if (localStorage.getItem('last_watch_recipe') != null) {
    let last_watch_recipe = localStorage.getItem('last_watch_recipe')
    const response = await fetch(`${backend_base_url}/recipe/${last_watch_recipe}/`, {

      headers: {
        "Content-Type": "application/json",
        // Authorization: "Bearer " + localStorage.getItem("access"),
      },
      method: "GET",
    });
    const response_json = await response.json()
    // console.log(response_json)
    const main_img = response_json['main_img']
    const name = response_json['name']
    const kcal = response_json['kcal']
    const tip = response_json['tip']
    const ingredients = response_json['ingredients']

    let temp_html1 = `<a href="/recipe_detail.html?recipe_id=${last_watch_recipe}">
                            <section class="cp-card content" style="height: auto; overflow:hidden; padding:10px;">
                                <div class="thumb" style="background-image: url(${main_img}); border-radius:20%; height:300px; width:500px;
                                                        margin:30px auto 30px 20px; display: inline-block;"></div>
                                <div class="body" style="width:400px; float:right; margin-right:50px; text-align:center;">
                                    <h4 >${name}</h4>
                                    <span class="cp-stars" >
                                            ${kcal}kcal 
                                    </span>
                                    <div class="metadata" style="float:right; margin-top:20px">
                                        <p>TIP : ${tip}</p>
                                    </div>
                                    <div class="metadata" style="float:right; margin-top:20px">
                                        <p>준비물 : ${ingredients}</p>
                                    </div>
                                </div>
                            </section>
                        </a>
                        `;
    $('#last_wathc_list').append(temp_html1);
  }
}

LastRecipe()
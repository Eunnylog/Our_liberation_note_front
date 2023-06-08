async function ReviewList() {
    // const accessToken = localStorage.getItem('access')
    const root_address = `${backend_base_url}`;
    const response = await fetch(`${backend_base_url}/review/`, {
        headers: {
            'content-type': 'application/json',
            // 'Authorization': `Bearer ${accessToken}`
        },
        method: 'GET',
    })

    const response_json = await response.json()
    $('#recipe_list').empty()
    response_json.forEach((a) => {
        console.log(a)
        const title = a['title']
        const recipe = a['recipe_name']
        let stars = {
            "1": "⭐️",
            "2": "⭐️⭐️",
            "3": "⭐️⭐️⭐️",
            "4": "⭐️⭐️⭐️⭐️",
            "5": "⭐️⭐️⭐️⭐️⭐️"
        }
        const star = stars[a['star']]
        const review_id = a['id']
        let created_at = new Date(a['created_at']);
        let month = (created_at.getMonth() + 1); // 월, 11[1을 더해야함. 유일하게 조심해야할 부분. 1월은 0이다.]
        let date = created_at.getDate(); // 일, 14
        let year = created_at.getFullYear()
        const image = root_address + a["image"];
        if (a["image"] == null) {
            let temp_html1 = `<a href="/review_detail.html?review_id=${review_id}">
                                <section class="cp-card content" style="height:300px;">
                                    <div class="thumb" style="background-image: url('/css/assets/main-bg.jpg'); border-radius:20%">
                                    </div>
                                    <div class="body">
                                        <h4 style="font-size:15px;">${title}(${star})</h4>
                                        <div class="metadata" style="margin-top:2px;">
                                            <div class="review-rating">
                                                <span class="cp-stars" style="font-size:15px;">
                                                ${year}.${month}.${date}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            </a>`;
            $('#recipe_list').append(temp_html1);
        } else {
            let temp_html1 = `<a href="/review_detail.html?review_id=${review_id}">
                            <section class="cp-card content" style="height:300px;">
                                <div class="thumb" style="background-image: url(${image}); border-radius:20%">
                                </div>
                                <div class="body">
                                    <h4 style="font-size:15px;">${title}(${star})</h4>
                                    <div class="metadata" style="margin-top:2px;">
                                        <div class="review-rating">
                                            <span class="cp-stars" style="font-size:15px;">
                                            ${year}.${month}.${date}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </a>`;
            $('#recipe_list').append(temp_html1);
        }

    })
}
ReviewList()

$(document).ready(function () {
    getRecipeDetail()
    async function getRecipeDetail() {
        params = new URLSearchParams(window.location.search);
        recipe_id = params.get("recipe_id");
        localStorage.setItem("last_watch_recipe", recipe_id)
        const access_token = localStorage.getItem('access')
        if (access_token) {
            let temp = `<a a href="" class=" cp-button secondary" data-bs-toggle="modal" data-bs-target="#review"> 후기 작성</a>`
            $("#save_review_box").append(temp)
        }
        const response = await fetch(`${backend_base_url}/recipe/${recipe_id}/`, {

            headers: {
                "Content-Type": "application/json",
            },
            method: "GET",
        });
        //해당 숙소 리뷰 조회
        const response_json = await response.json()
        // 메인이미지
        const main_img = response_json['main_img']
        let temp_html1 = `<img class="thumb" src="${main_img}" style="float:left; border: 2px solid #696865;">`
        $("#main_img").append(temp_html1);

        // 레시피 이름
        const name = response_json['name']
        let temp_html2 = `<a class="back-link"><${name}></a>`
        $("#recipe_name").append(temp_html2)

        // 레시피 정보
        const category = response_json['category']
        const kcal = response_json['kcal']
        const tag = response_json['tag']
        const car = response_json['car']
        const fat = response_json['fat']
        const na = response_json['na']
        const pro = response_json['pro']
        const tip = response_json['tip']
        const ingredients = response_json['ingredients']
        let temp_html3 = `
                        <div style="float: left;">
                            <h5>category(${category})</h5>
                        </div>
                        <div style="float: right;">
                            <h5>총 열량 : ${kcal}kcal</h5>
                        </div>
                        <br><br>
                        <p>재료 : ${ingredients}</p>
                        <p>탄수화물 : ${car}</p>
                        <p>단백질 : ${pro}</p>
                        <p>나트륨 : ${na}</p>
                        <p>해시태그 : ${tag}</p>
                        <p>지방 : ${fat}</p>
                        <p>TIP : ${tip}</p>
                        `
        $("#recipe_info").append(temp_html3)

        // 조리 순서
        response_json["sub_recipe_set"].forEach((a) => {
            const turn = a['turn']
            const validJSON = turn.replace(/'/g, '"');
            const turnList = JSON.parse(validJSON);
            const turn_img = a['img']
            const validJSON2 = turn_img.replace(/'/g, '"');
            const img_list = JSON.parse(validJSON2);

            for (step = 0; step < turnList['length']; step++) {
                let temp_html4 = `
                                <div class="Gallery-item js-item">
                                    <div class="Gallery-itemContent" style=""><img class="rdg-image" src="${img_list[step]}" style="object-fit:cover;width:100%;
                                    height:100%;"></div>
                                    <div class="Gallery-itemContent" style="font-size: 20px; text-align:center;">${turnList[step]}</div>
                                </div>
                                `;
                $("#recipe_turn").append(temp_html4);
                let temp_html5 = `<button class="Nav-button js-button"></button>`
                $("#recipe_turn_btn").append(temp_html5);
            }

        });

        const gallery = new Gallery({
            container: document.querySelector('.js-container'),
            nav: document.querySelector('.js-nav'),
            items: Array.from(document.querySelectorAll('.js-item')),
            btns: Array.from(document.querySelectorAll('.js-button'))
        }).
            render();
    }
})

class FancyNav {
    constructor({ btns, nav, highlightColor, backgroundColor, strokeWidth }) {
        this.btns = btns;
        this.nav = nav;
        this.highlightColor = 'rgb(238, 190, 0)';
        this.strokeWidth = strokeWidth;
        this.backgroundColor = backgroundColor;
        this.transparent = this.alphaFromColor(highlightColor, 0);
    }

    render() {
        const svg = Snap(this.nav.clientWidth, this.nav.clientHeight);
        this.svgBtns = this.btns.map(btn => this.renderSVGBtns(btn, svg));

        const btnBBox = this.svgBtns[0].getBBox();
        this.offset = this.svgBtns[1].getBBox().cx - btnBBox.cx;
        this.magicPath = this.renderMagicPath(svg, btnBBox);
        this.circumference = 2 * Math.PI * btnBBox.r1; // assume circle

        this.setCurrent();
        this.bindBtnEvents();
        this.nav.appendChild(svg.node);
    }

    renderSVGBtns(btn, svg) {
        // Hide html btns
        btn.style.opacity = 0;
        const x = btn.offsetLeft + btn.offsetWidth / 2;
        const y = btn.offsetTop + btn.offsetHeight / 2;
        const r = btn.offsetHeight / 2; // assume circle

        const outerCircle = svg.
            circle(x, y, r).
            attr({
                fill: this.transparent,
                stroke: this.highlightColor,
                strokeWidth: 2
            });

        const innerCircle = svg.
            circle(x, y, r / 4).
            attr({
                fill: this.highlightColor,
                stroke: this.transparent,
                strokeWidth: 0,
                class: 'hoverIndicator',
                transform: 's0,0'
            });


        return svg.group(outerCircle, innerCircle);
    }

    renderMagicPath(svg, btnBBox) {
        const pathSegments = [
            `M${btnBBox.cx},${btnBBox.y2}`].
            concat(
                this.svgBtns.reduce((acc, b, index, arr) => {
                    const res = [
                        `a${btnBBox.r1},${btnBBox.r1},0,0,0,0,-${btnBBox.height}`, // left circle
                        `a${btnBBox.r1},${btnBBox.r1},0,0,0,0,${btnBBox.height}` // right circle
                    ];
                    if (index < arr.length - 1) {
                        res.push(`l${this.offset},0`); // path to next circle, not on last one
                    }
                    return acc.concat(res);
                }, []));


        return svg.
            path(pathSegments.join(' ')).
            attr({
                stroke: this.highlightColor,
                strokeWidth: this.strokeWidth,
                strokeLinecap: 'round',
                fill: this.transparent
            });

    }

    setCurrent() {
        const pathLength = Snap.path.getTotalLength(this.magicPath.attr('d')); // fixes length in Firefox
        // strokeDasharray: `${this.circumference - this.strokeWidth / 4}, ${pathLength}`,
        this.magicPath.attr({
            strokeDasharray: `${this.circumference - this.strokeWidth / 4}, ${pathLength}`,
            strokeDashoffset: 0
        });

    }

    goToIndex(index) {
        const dashOffset = -index * (this.circumference + this.offset);
        Snap.animate(this.removePx(this.magicPath.attr('strokeDashoffset')), dashOffset, v => {
            this.magicPath.attr({ strokeDashoffset: v });
        }, 600, mina.easeinout);
    }

    bindBtnEvents() {
        this.btns.forEach((btn, index) => {
            btn.addEventListener('click', () => this.handleClick(index), false);
            btn.addEventListener('mouseover', () => this.showFocus(index), false);
            btn.addEventListener('focus', () => this.showFocus(index), false);
            btn.addEventListener('mouseout', () => this.removeFocus(index), false);
            btn.addEventListener('blur', () => this.removeFocus(index), false);
        });
    }

    showFocus(index) {
        this.svgBtns[index].
            select('.hoverIndicator').
            stop().
            animate({ transform: 's1,1' }, 225, mina.easein);
    }

    removeFocus(index) {
        this.svgBtns[index].
            select('.hoverIndicator').
            stop().
            animate({ transform: 's0,0' }, 175, mina.easeout);
    }

    handleClick(index) {
        this.goToIndex(index);
    }

    removePx(str) {
        return parseInt(str.replace('px', ''), 10);
    }

    alphaFromColor(c, alpha) {
        const { r, g, b } = Snap.color(c);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
}


class Gallery {
    constructor({ container, items, btns, nav }) {
        this.container = container;
        this.items = items;
        this.btns = btns;
        this.nav = nav;
        this.itemWidth = this.items[0].clientWidth;
    }

    render() {
        this.btns.forEach((btn, index) => {
            btn.addEventListener('click', () => this.goToIndex(index), false);
        });

        const fancyNav = new FancyNav({
            btns: this.btns,
            nav: this.nav,
            highlightColor: '#00e',
            backgroundColor: '#FFFFFF',
            strokeWidth: 10
        }).
            render();
    }

    goToIndex(index) {
        this.container.style.transform = `translateX(${-index * this.itemWidth}px)`;
    }
}



async function createReview() {
    params = new URLSearchParams(window.location.search);
    recipe_id = params.get("recipe_id");
    console.log(recipe_id)
    const title = document.getElementById("title").value;
    const star = parseInt(document.getElementById("star").value);
    const content = document.getElementById("content").value;
    const image = document.getElementById("image");
    const access_token = localStorage.getItem('access')
    const formData = new FormData();
    formData.append("title", title,);
    formData.append("star", star);
    formData.append("content", content);
    formData.append("image", image.files[0]);

    console.log(access_token)

    response = await fetch(`${backend_base_url}/review/${recipe_id}/`, {
        headers: {
            "Authorization": `Bearer ${access_token}`,
        },
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            alert("후기가 등록되었습니다.");
            window.location.reload();
        })
        .catch(error => {
            alert("에러가 발생했습니다.");
        });
}
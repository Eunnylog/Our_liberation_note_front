// More API functions here:
// https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/image

// the link to your model provided by Teachable Machine export panel
const URL = './my_model/';

let model, webcam, labelContainer, maxPredictions;

// Load the image model and setup the webcam
async function init() {
  const modelURL = URL + 'model.json';
  const metadataURL = URL + 'metadata.json';
  // load the model and metadata
  // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
  // or files from your local hard drive
  // Note: the pose library adds "tmImage" object to your window (window.tmImage)
  model = await tmImage.load(modelURL, metadataURL);
  maxPredictions = model.getTotalClasses();
  labelContainer = document.getElementById('label-container');
  for (let i = 0; i < maxPredictions; i++) {
    // and class labels
    labelContainer.appendChild(document.createElement('div'));
  }
}
// run the webcam image through the image model
async function predict() {
  // predict can take in an image, video or canvas html element
  var image = document.getElementById('face-image');
  const prediction = await model.predict(image, false);
  let pensByColors = prediction.sort((a, b) => (b.probability - a.probability));
  result_data = pensByColors[0]['className']
  result = `당신이 선택한 재료는 ${result_data}입니다!`
  $('#result_data').append(result)
  $('#extra_data').empty()
  btn = `
          <input id="extra" name="extra" type="text" class="form-control" placeholder="재료 추가하기~"
          style="width: 80%; height:50px; float:left;">
          <button id="save_btn" class="cp-button secondary" onclick="extraSearch('${result_data}')"
            style="float:right; margin-top: 10px; margin-bottom: 30px background-color:#ffbb00;">
            추가
          </button>
        `
  $('#extra_data').append(btn)
  search(result_data)
}
init()

async function search(result_data) {
  search_data = result_data
  const response = await fetch(`${backend_base_url}/search/`, {
    headers: {
      'content-type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({
      "search": search_data
    })
  });
  const response_json = await response.json()
  $('#recommend_recipe').empty()
  response_json.forEach((a) => {
    const name = a['name']
    const ingredients = a['ingredients']
    const recipe_id = a['id']
    result = `
              <div class="media" style="padding: 20px; margin-top: 30px">
                  <div>
                      <div style="float: left">
                          <a href="/recipe_detail.html?recipe_id=${recipe_id}" class="back-link">${name}</a>
                      </div>
                      <br><br>
                      <div style="float: right;">
                          <h5 style="font-size: 13px">재료 : ${ingredients}</h5>
                      </div>
                  </div>
              </div><br>
              <hr>
            `
    $('#recommend_recipe').append(result)
  })
}

function extraSearch(result_data) {
  const result = result_data
  const extra = document.getElementById("extra").value
  const new_data = `${result},${extra}`
  search(new_data)
}

checkLogin()
checkSubscribe()
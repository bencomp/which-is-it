const api = 'https://api.data.netwerkdigitaalerfgoed.nl/datasets/NMVW/collectie/services/collectie/sparql'
let player
const postOptions = {
  method: 'POST',
  mode: 'cors',
  cache: 'no-cache',
  redirect: 'follow',
  headers: {
    "Accept": "application/sparql-results+json",
    "Content-Type": "application/x-www-form-urlencoded",
  },
}
window.onload = function() {
  fetch('getobjects.rq')
    .then(response => response.text())
    .then(rq => {
      postOptions.body = `query=${rq}`
      fetch(api, postOptions)
        .then(response => response.json())
        .then(ld => {
          const html = []
          ld.results.bindings.forEach(obj => {
            const img = new Image()
            img.onload = () => {
              if (this.width > this.height) {
                
              }
            }
            img.src = obj.img.value
            html.push(`
    <article class="col" id="${obj.id.value}">
      <div class="card shadow-sm">
        <img src="${obj.img.value}">
        <div class="card-body">
          <p class="card-text">${obj.onderwerp.value}, <a href="${obj.geonames.value}">${obj.lokatie.value}</a></p>
          <div class="d-flex justify-content-between align-items-center">
            <div class="btn-group">
              <button type="button" class="guess btn btn-sm btn-outline-secondary">Deze is het!</button>
            </div>
          </div>
        </div>
      </div>
    </article>
`)
          })
          document.getElementById('objects').innerHTML = html.join('')
          document.querySelectorAll('article').forEach(obj => {
            obj.onclick = (ev) => {
              obj.classList.toggle('selected')
     
              let annotation = {
                "@context": "http://www.w3.org/ns/anno.jsonld",                                                                                                               
                "id": "https://w3id.org/whichisit/annotation/#"+Math.floor(Math.random()*100000),                                                                                                                           
                "type": "annotation",                                                                                                                                     
                "bodyValue": annotationText + " " + answer,                                                                                                                         
                "target": "todo"
              }
              // FIXME 
              console.log(annotation);




            }
          })

          document.querySelectorAll('.guess').forEach(obj => {
            obj.onclick = (e) => {
               e.preventDefault()
               return false
            }
          })
        })
        .catch(e => alert('Er heeft zich een fout voorgedaan'))
    })

  const eventOut = {
        type: "question",
        question: "Hello world",
        player: player,
    }
    // setTimeout(() => {
    //   console.lwebsocket.send(JSON.stringify(eventOut))
    //   alert(1)
    // }, 1000)
    // 
}
var annotationText = "";
var websocket;
var answer = "";
window.addEventListener("DOMContentLoaded", () => {
  websocket = new WebSocket("ws://172.16.32.159:8001/");
  initGame(websocket);

  document.querySelectorAll(".btn-outline-secondary")[0].addEventListener("click", () => {
      annotationText = document.querySelectorAll(".form-control")[0].value;
     websocket.send(annotationText);
  })

})

function initGame(websocket) {
  websocket.addEventListener("open", () => {
    // Send an "init" event according to who is connecting.
    const params = new URLSearchParams(window.location.search);
    let event = { type: "init" };
    if (params.has("join")) {
      // Second player joins an existing game.
      event.join = "player2";
      player = "player2";
    } else if (params.has("watch")) {
      // Spectator watches an existing game.
      event.watch = "watch";
    } else {
      // First player starts a new game.
      player = "player1";
    }
    // FIXME: show player1 or player2 in UI
    websocket.send(JSON.stringify(event));
  });

  websocket.addEventListener("message", (e) => {
    if (e.data == "ja") {
      answer = "ja";
    } else if (e.data = "nee")  {
      answer = "nee";

    }


    console.log(e)
  });
}



/**
 * Update UI with "yes"/"no" answer
 * @param {string} answer The other player's answer
 */
function showAnswer(answer) {
    // FIXME
}

/**
 * Update UI with question to answer
 * @param {string} question The other player's question
 */
function showQuestion(question) {
    // FIXME
}
/**
 * Update UI with number of images the opponent has left
 * @param {number} numImages Number of images opponent has left
 */
function showOpponentImages(numImages) {
    // FIXME
}

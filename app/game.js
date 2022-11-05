const server = "ws://192.168.43.181:8001"
const webserver = "http://192.168.43.181:8000"
const api = 'https://api.data.netwerkdigitaalerfgoed.nl/datasets/NMVW/collectie/services/collectie/sparql'
/** This user's role in the game */
let player

/**
 * state of the game, one of
 * - player1asks
   - player1
 */
let state = "player1asks"

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
//   fetch('getobjects.rq')
//     .then(response => response.text())
//     .then(rq => {
//       postOptions.body = `query=${rq}`
//       fetch(api, postOptions)
      fetch(webserver + "/objects.json")
        .then(response => response.json())
        .then(ld => {
          console.log(ld)
          const html = []
          ld.results.bindings.forEach(obj => {
            // console.log("test")
            const img = new Image()
            const vlagImg = new Image();
            vlagImg.src = obj.vlag.value
            img.src = obj.imgS.value
            html.push(`
    <article class="col">
      <div class="card shadow-sm">
        <img src="${obj.imgS.value}">
        <div class="card-body">
          <p class="card-text"><img src=${obj.vlag.value}></p>
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
        .then(() => {
          const cards = Array.from(document.querySelectorAll('.card'))
          const theImg = document.createElement('img', {id: 'the_image'})
          const theNumber = Math.floor(Math.random() * cards.length)
          console.log(theNumber)
          theImg.src = cards[theNumber].querySelector('img')['src']
          document.getElementById('this_one').appendChild(theImg)
        })
        .catch(e => {
            console.error(e)
            alert('Er heeft zich een fout voorgedaan')
            })
    // })

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

function showMessage(message) {
  window.setTimeout(() => window.alert(message), 50);
}

var annotationText = "";
var websocket;
var answer = "";

window.addEventListener("DOMContentLoaded", () => {
  websocket = new WebSocket(server);
  initGame(websocket);

  document.querySelectorAll(".btn-outline-secondary")[0].addEventListener("click", () => {
    annotationText = document.querySelectorAll(".form-control")[0].value;
    const event = {
        type: "question",
        question: annotationText,
        player: player,
    }
    document.getElementById('my_question').textContent = annotationText
    websocket.send(JSON.stringify(event))
  })
  document.querySelector("#yesAnswer").addEventListener("click", () => {
    const event = {
        type: "answer",
        answer: "ja",
        player: player,
    }
    document.querySelector('.orakel').classList.add('hide')
    websocket.send(JSON.stringify(event))
  })
  document.querySelector("#noAnswer").addEventListener("click", () => {
    const event = {
        type: "answer",
        answer: "nee",
        player: player,
    }
    document.querySelector('.orakel').classList.add('hide')
    websocket.send(JSON.stringify(event))
  })
  document.querySelector("#decisionsReady").addEventListener("click", () => {
    // Disable images that have been "selected"
    // Annotate these with negative of received answer
    // Find images that are still in the game
    // Annotate them with received answer
    // const imagesLeft = findActiveImages()
    // const urisLeft = Array.from(imagesLeft)//, img => {})
    const event = {
        type: "decisions",
        left: [],
        player: player,
    }
    // Clear question and answer
    document.querySelector('#questionBox').classList.remove('ja', 'nee')
    document.querySelector('#questionBox').value = ""

    websocket.send(JSON.stringify(event))

  })

})

/**
 * Return images that haven't been deactivated yet
 */
function findActiveImages() {
  return document.querySelectorAll('.card:not(.inactive)')
}

/**
 * Add listeners to the websocket and sets up the game
 * @param {WebSocket} websocket
 */
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
      player = "watcher"
    } else {
      // First player starts a new game.
      player = "player1";
    }
    // FIXME: show player1 or player2 in UI
    websocket.send(JSON.stringify(event));
  });

  websocket.addEventListener("message", ({ data }) => {
    const event = JSON.parse(data);
    console.log(event);
    switch (event.type) {
      case "init":
        // Create links for inviting the second player and spectators.
        // document.querySelector(".join").href = "?join=" + event.join;
        // document.querySelector(".watch").href = "?watch=" + event.watch;
        // FIXME: get the board parameters from player1
        break;
      case "question":
        // Update the UI with the question from the other player.
        if (event.player !== player) {
            showQuestion(event.question);
        }
        break;
      case "answer":
        // Show the other player's answer
        if (event.player !== player) {
            showAnswer(event.answer);
        }
        break;
      case "decisions":
        // Show the other player's answer
        if (event.player !== player) {
            showOpponentImages();

        }
        break;
      case "win":
        showMessage(`Player ${event.player} wins!`);
        // No further messages are expected; close the WebSocket connection.
        websocket.close(1000);
        break;
      case "error":
        showMessage(event.message);
        break;
      default:
        throw new Error(`Unsupported event type: ${event.type}.`);
    }
  });
}



/**
 * Update UI with "yes"/"no" answer
 * @param {string} answer The other player's answer
 */
function showAnswer(inAnswer) {
    // FIXME
    answer = inAnswer
    const questionElem = document.querySelector('#questionBox')
    if (answer === "ja") {
        questionElem.classList.add('ja')
    } else if (answer === "nee") {
        questionElem.classList.add('nee')
    }
    document.querySelector('#oppo_answer').textContent = inAnswer
}

/**
 * Update UI with question to answer
 * @param {string} question The other player's question
 */
function showQuestion(question) {
  document.querySelector('.orakel').classList.remove('hide')
  document.querySelector('#oppo_question').textContent = question
}
/**
 * Update UI with number of images the opponent has left
 * @param {number} numImages Number of images opponent has left
 */
function showOpponentImages(numImages) {
    // FIXME
}

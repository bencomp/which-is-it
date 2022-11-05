import { showAnswer, showOpponentImages, showQuestion } from "./board.js";

/** Identifier for current player, undefined for watchers */
let player;

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
}

function showMessage(message) {
  window.setTimeout(() => window.alert(message), 50);
}

/**
 * Add listener for messages from server
 * @param {*} board
 * @param {*} websocket
 */
function receiveMoves(board, websocket) {
  websocket.addEventListener("message", ({ data }) => {
    const event = JSON.parse(data);
    console.log(event);
    switch (event.type) {
      case "init":
        // Create links for inviting the second player and spectators.
        document.querySelector(".join").href = "?join=" + event.join;
        document.querySelector(".watch").href = "?watch=" + event.watch;
        break;
      case "question":
        // Update the UI with the move.
        showQuestion(event.question);
        break;
      case "answer":
        // Show the other player's answer
        showAnswer(event.answer);
        break;
      case "decisions":
        // Show the other player's answer
        showOpponentImages(event.left.length);
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

function sendMoves(board, websocket) {
  // Don't send moves for a spectator watching a game.
  const params = new URLSearchParams(window.location.search);
  if (params.has("watch")) {
    return;
  }
  // Add listener for question
  const questionElem = board.querySelector("#question");
  board.querySelector("#sendQuestion").addEventListener('click', (e) => {
  // on form submission, prevent default
    // e.preventDefault();

    // event.preventDefault();
    // const formData = e.formData;
    const eventOut = {
        type: "question",
        question: questionElem.value,
        player: player,
    }
    websocket.send(JSON.stringify(eventOut));
  });
  // Add listener for answer
  board.querySelector("#yesAnswer").addEventListener("click", () => {
    const event = {
        type: "answer",
        answer: "yes",
        player: player,
    }
    websocket.send(JSON.stringify(event));
  });
  board.querySelector("#noAnswer").addEventListener("click", () => {
    const event = {
        type: "answer",
        answer: "no",
        player: player,
    }
    websocket.send(JSON.stringify(event));
  });
  // Add listener for decisions
  board.querySelector("#sendDecisions").addEventListener("click", () => {
    // Determine which images are still in the game
    const imagesLeft = Array.from(board.querySelectorAll(".active"), element => {
        const img = element.querySelector("img");
        if (img !== null) {
            return img["src"];
        } else {
            return "";
        }
    });
    const event = {
        type: "decisions",
        left: imagesLeft,
        // removed: imagesRemoved,
        player: player,
    }
    websocket.send(JSON.stringify(event));
  });

}



window.addEventListener("DOMContentLoaded", () => {
  // Initialize the UI.
  const board = document.querySelector(".board");
//   createBoard(board);
  // Open the WebSocket connection and register event handlers.
  const websocket = new WebSocket("ws://localhost:8001/");
  initGame(websocket);
  receiveMoves(board, websocket);
  sendMoves(board, websocket);
});

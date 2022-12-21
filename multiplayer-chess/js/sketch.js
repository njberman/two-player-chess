import Board from './Board.js';
import { SIZE, API_URL } from './constants.js';
import { convertToFen } from './convertToFen.js';
let board;
let currentCode;
let codeInput;
let currentCodeElement;
let frame = 0;

window.setup = () => {
  createCanvas(SIZE, SIZE);
  board = new Board('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w');
  codeInput = createInput('', 'text');
  codeInput.elt.placeholder = 'Game Code (press enter once done)';
  codeInput.size(300, 20);
  currentCodeElement = createElement(
    'h1',
    'ENTER GAME CODE ABOVE TO START GAME'
  );
  setInterval(async () => {
    if (currentCode) {
      const game = await getGame(currentCode);
      console.log(game);
      board.fen = game.boardFen;
      board.tiles = board.createTilesWithFen(board.fen);
    }
  }, 1000);
};

window.draw = async () => {
  if (currentCode) {
    background(220);
    board.draw();
  }
};

window.onclick = async function (evt) {
  const x = evt.clientX;
  const y = evt.clientY;
  board.userClick(x, y);
  navigator.clipboard.writeText(convertToFen(board));
  board.fen = convertToFen(board);
  board.tiles = board.createTilesWithFen(board.fen);

  if (currentCode) {
    await setGame(currentCode, board.fen);
  }
};

window.onkeypress = async (evt) => {
  if (evt.key === 'Enter' && codeInput.value !== '') {
    currentCode = codeInput.value();
    codeInput.value('');
    currentCodeElement.elt.innerText = 'Code: ' + currentCode;

    let game = await getGame(currentCode);
    if (!game) {
      game = await makeGame(currentCode);
    }
    board.fen = game.boardFen;
    board.tiles = board.createTilesWithFen(board.fen);
  }
};

async function getGame(code) {
  const response = await fetch(API_URL + '/get-game', {
    mode: 'cors',
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      code,
    }),
  });
  const json = await response.json();
  if (json.message) {
    return undefined;
  }
  return json.game;
}

async function makeGame(code) {
  // No game exists, make a new one
  const response = await fetch(API_URL + '/new-game', {
    mode: 'cors',
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      code,
    }),
  });
  const json = await response.json();
  return json.game;
}

async function setGame(code, newFen) {
  const response = await fetch(API_URL + '/set-game', {
    mode: 'cors',
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      code: code,
      newFen,
    }),
  });
  const json = await response.json();
  if (json.message === 'No game exists with that code') {
    return undefined;
  }
  return json.game;
}

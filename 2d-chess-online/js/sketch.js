import Board from './Board.js';
import { SIZE } from './constants.js';
import { convertToFen } from './convertToFen.js';
let board;
const gameCodeForm = document.getElementById('game-code-form');
const gameCodeInput = document.getElementById('game-code');
let started = false;
const BASE_HTML = document.getElementById('main').children[0].innerHTML;

gameCodeForm.addEventListener('submit', (e) => {
  e.preventDefault();
  board = new Board(gameCodeInput.value);
  started = true;
  gameCodeInput.value = '';
});

window.setup = (code, btn) => {
  createCanvas(SIZE, SIZE);
  board = new Board(code, BASE_HTML);
  document.getElementsByClassName('taken')[0].innerHTML = BASE_HTML;
};

window.draw = () => {
  background(220);
  if (started) {
    board.draw();
  } else {
    document.getElementById('game-code-show').innerText = '';
  }
};

window.onclick = function (evt) {
  if (started && board.turn === board.pov) {
    const x = mouseX;
    const y = mouseY;
    board.userClick(x, y);
  }
};

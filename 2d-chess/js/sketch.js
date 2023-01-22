import Board from './Board.js';
import { SIZE } from './constants.js';
import { convertToFen } from './convertToFen.js';
let board;

const BASE_HTML = document.getElementsByClassName('taken')[0].innerHTML;

document
  .getElementById('restart')
  .addEventListener('click', () => window.setup());

window.setup = () => {
  createCanvas(SIZE, SIZE);
  select('canvas').class('rounded-lg');
  board = new Board();
  document.getElementsByClassName('taken')[0].innerHTML = BASE_HTML;
};

window.draw = () => {
  background(220);
  board.draw();
};

window.onclick = function (evt) {
  const x = mouseX;
  const y = mouseY;
  board.userClick(x, y);
  // navigator.clipboard.writeText(convertToFen(board));
  // console.log(convertToFen(board));
};

import Board from './Board.js';
import { SIZE } from './constants.js';
import { convertToFen } from './convertToFen.js';
let board;

window.setup = () => {
  createCanvas(SIZE, SIZE);
  board = new Board();
  document.getElementsByClassName('taken')[0].innerHTML =
    '<h1>Taken Pieces</h1>';
};

window.draw = () => {
  background(220);
  board.draw();
};

window.onclick = function (evt) {
  const x = mouseX;
  const y = mouseY;
  board.userClick(x, y);
  navigator.clipboard.writeText(convertToFen(board));
  // console.log(convertToFen(board));
};

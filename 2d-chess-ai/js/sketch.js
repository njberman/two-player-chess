import Board from './Board.js';
import { COLOUR, SIZE } from './constants.js';
import { convertToFen } from './convertToFen.js';
let board;

const startButton = document.getElementById('start');
const difficultyInput = document.getElementById('difficulty-options');

startButton.addEventListener('click', () => {
  startButton.innerText = 'Restart Game';
  const diff = difficultyInput.value;
  const diff_level = 20;

  window.setup(diff_level);
  board.diff = diff;
  loop();
});

window.setup = (diff_level) => {
  createCanvas(SIZE, SIZE);
  document.getElementsByClassName('taken')[0].innerHTML =
    '<h1>Taken Pieces</h1>';
  board = new Board(diff_level);
  noLoop();
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

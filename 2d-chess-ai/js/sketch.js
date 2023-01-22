import Board from './Board.js';
import { COLOUR, SIZE } from './constants.js';
import { convertToFen } from './convertToFen.js';
let board;

const startButton = document.getElementById('start');
const difficultyInput = document.getElementById('difficulty-options');
const BASE_HTML = document.getElementsByClassName('taken')[0].innerHTML;

difficultyInput.addEventListener('change', () => {
  const diffLevelL = document.getElementById('diff-level-l');
  const diffLevel = document.getElementById('diff-level');
  if (difficultyInput.value === 'diff') {
    diffLevelL.className = diffLevelL.className.replace('invisible', '');
    diffLevel.className = diffLevel.className.replace('invisible', '');
  } else {
    diffLevelL.className += 'invisible';
    diffLevel.className += 'invisible';
  }
});

startButton.addEventListener('click', () => {
  startButton.innerText = 'Restart Game';
  const diff = difficultyInput.value;
  const diff_level = document.getElementById('diff-level').value;

  window.setup(diff_level);
  board.diff = diff;
  loop();
});

window.setup = (diff_level) => {
  createCanvas(SIZE, SIZE);
  select('canvas').class('rounded-lg');
  document.getElementsByClassName('taken')[0].innerHTML = BASE_HTML;
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

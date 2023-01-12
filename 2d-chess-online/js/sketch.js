import Board from './Board.js';
import { SIZE } from './constants.js';
import { convertToFen } from './convertToFen.js';
let board;
// let socket = new WebSocket('ws://localhost:3030');
// socket.onopen = (e) => {
//   console.log('[open] Connection Established');
//   console.log('Sending to server');
//   socket.send('My name is Nato');
// };

window.setup = () => {
  createCanvas(SIZE, SIZE);
  board = new Board();
};

window.draw = () => {
  background(220);
  board.draw();
};

window.onclick = function (evt) {
  const x = evt.clientX;
  const y = evt.clientY;
  board.userClick(x, y);
  navigator.clipboard.writeText(convertToFen(board));
  // console.log(convertToFen(board));
};

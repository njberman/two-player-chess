import Bishop from './Bishop.js';
import { COLOUR, SIZE, ABC, APIURL } from './constants.js';
import Pawn from './Pawn.js';
import Rook from './Rook.js';
import Knight from './Knight.js';
import King from './King.js';
import Queen from './Queen.js';
import CheckFinder from './CheckFinder.js';
import { convertToFen } from './convertToFen.js';

const info = document.getElementById('info');

export default class Board {
  constructor(code) {
    this.sizeOfSquare = SIZE / 8;
    this.tiles = this.createTiles();
    this.turn = COLOUR.WHITE;
    this.isInCheck = false;
    this.checkMate = false;
    this.pov = COLOUR.WHITE;

    // Connect to server and initialize whether we are black or white
    let url;
    if (APIURL.includes('localhost')) {
      this.socket = new WebSocket(`ws://${APIURL}`);
    } else {
      this.socket = new WebSocket(`wss://${APIURL}`);
    }
    this.socket.onerror = (e) => {
      info.innerText = JSON.stringify(e);
    };
    this.socket.onopen = () => {
      console.log('[open] Connection established');
      console.log(code);
      info.innerText = 'Connected to WebSocket!';
      if (APIURL.includes('localhost')) {
        url = `http://${APIURL}/new-game`;
      } else {
        url = `https://${APIURL}/new-game`;
      }
      this.socket.send(`new ${code ? code : ''}`);
      this.socket.onmessage = (e) => {
        const message = e.data;
        console.log('Received:', message);
        if (message[0] === '{') {
          const json = JSON.parse(message);
          console.log(json);
          info.innerText = JSON.stringify(json);
          this.gameCode = json.code;
          if (json.message.includes('Game already exists')) {
            this.flip();
          }
          document.getElementById(
            'game-code-show',
          ).innerText = `Code: ${this.gameCode}`;
        } else {
          info.innerText = message;
          // this.flip();
          if (
            message.includes('move') &&
            message.split(' ')[0] === this.gameCode &&
            message.split(' ')[3] !== this.pov
          ) {
            const { from, to } = this.moveToIdx(message.split(' ')[2]);
            this.move(from, to);
          }
        }
      };
    };
  }

  flip() {
    this.tiles.reverse().forEach((item, i) =>
      item.reverse().forEach((itm, j) => {
        if (itm !== undefined) {
          itm.x = i;
          itm.y = j;
          if (itm.direction) {
            itm.direction *= -1;
          }
        }
      }),
    );
    this.pov = this.pov === COLOUR.WHITE ? COLOUR.BLACK : COLOUR.WHITE;
  }

  createTiles() {
    let tiles = this.createEmptyBoard();

    for (let i = 0; i < 8; i++) {
      tiles[i][1] = new Pawn(i, 1, COLOUR.BLACK, '♟');
      tiles[i][6] = new Pawn(i, 6, COLOUR.WHITE, '♙');
      // tiles[i][1] = new Pawn(i, 1, COLOUR.BLACK, images.black.pawn);
      // tiles[i][6] = new Pawn(i, 6, COLOUR.WHITE, images.white.pawn);
    }

    tiles[0][0] = new Rook(0, 0, COLOUR.BLACK, '♜');
    tiles[7][0] = new Rook(7, 0, COLOUR.BLACK, '♜');
    tiles[0][7] = new Rook(0, 7, COLOUR.WHITE, '♖');
    tiles[7][7] = new Rook(7, 7, COLOUR.WHITE, '♖');

    tiles[2][0] = new Bishop(2, 0, COLOUR.BLACK, '♝');
    tiles[5][0] = new Bishop(5, 0, COLOUR.BLACK, '♝');
    tiles[2][7] = new Bishop(2, 7, COLOUR.WHITE, '♗');
    tiles[5][7] = new Bishop(5, 7, COLOUR.WHITE, '♗');

    tiles[1][0] = new Knight(1, 0, COLOUR.BLACK, '♞');
    tiles[6][0] = new Knight(6, 0, COLOUR.BLACK, '♞');
    tiles[1][7] = new Knight(1, 7, COLOUR.WHITE, '♘');
    tiles[6][7] = new Knight(6, 7, COLOUR.WHITE, '♘');

    tiles[4][0] = new King(4, 0, COLOUR.BLACK, '♚');
    tiles[4][7] = new King(4, 7, COLOUR.WHITE, '♔');

    tiles[3][0] = new Queen(3, 0, COLOUR.BLACK, '♛');
    tiles[3][7] = new Queen(3, 7, COLOUR.WHITE, '♕');

    return tiles;
  }

  createEmptyBoard() {
    let board = [];
    for (let i = 0; i < 8; i++) {
      board[i] = [];
      for (let j = 0; j < 8; j++) {
        board[i][j] = undefined;
      }
    }
    return board;
  }

  draw() {
    textAlign(CENTER, CENTER);
    textSize(80);
    rectMode(CENTER);
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        const currentTile = this.tiles[i][j];
        const x = this.getPos(i);
        const y = this.getPos(j);

        if ((i + j) % 2 != 0) {
          push();
          noStroke();
          fill(75, 114, 153);
          rect(x, y, this.sizeOfSquare, this.sizeOfSquare);
          pop();
        } else {
          push();
          noStroke();
          fill(234, 232, 210);
          rect(x, y, this.sizeOfSquare, this.sizeOfSquare);
          pop();
        }
        if (currentTile) {
          currentTile.draw(x, y);
        }
      }
    }
    for (let i = 0; i < 8; i++) {
      const x = this.getPos(i);
      const y = this.getPos(7);
      push();
      textSize(20);
      noStroke();
      if (i % 2 === 0) {
        fill(234, 232, 210);
      } else {
        fill(75, 114, 153);
      }
      textAlign(CENTER, CENTER);
      const w = SIZE / 8;
      let txt;
      if (this.pov === COLOUR.WHITE) {
        txt = ABC[i];
      } else {
        txt = ABC[7 - i];
      }
      text(txt, x + w / 2 - 10, y - w / 2 + w - 12);
      pop();
    }
    for (let i = 7; i >= 0; i--) {
      const x = this.getPos(0);
      const y = this.getPos(i);
      push();
      textSize(20);
      noStroke();
      if (i % 2 === 0) {
        fill(75, 114, 153);
      } else {
        fill(234, 232, 210);
      }
      textAlign(CENTER, CENTER);
      const w = SIZE / 8;
      let val;
      if (this.pov === COLOUR.WHITE) {
        val = 8 - i;
      } else {
        val = i + 1;
      }
      text(val, x - w / 2 + 10, y + w / 2 - w + 15);
      pop();
    }

    this.displaySelected();
    if (this.checkMate && this.isInCheck) {
      push();
      textSize(80);
      noStroke();
      fill(0, 200);
      text('Checkmate!', SIZE / 2, SIZE / 2);
      pop();
    } else if (this.isInCheck) {
      push();
      textSize(80);
      noStroke();
      fill(0, 100);
      text('Check!', SIZE / 2, SIZE / 2);
      pop();
    }
  }

  displaySelected() {
    if (this.selected) {
      const tile = this.tiles[this.selected.x][this.selected.y];
      if (tile) {
        push();
        noStroke();
        fill(0, 100);

        for (const move of this.legalMoves) {
          ellipse(
            this.getPos(move.x),
            this.getPos(move.y),
            this.sizeOfSquare / 4,
          );
        }
        pop();
      }
    }
  }

  getPos(index) {
    let offset = this.sizeOfSquare / 2;
    return index * this.sizeOfSquare + offset;
  }

  userClick(clientX, clientY) {
    const x = Math.floor(clientX / 100);
    const y = Math.floor(clientY / 100);
    this.select(x, y);
  }

  select(x, y) {
    if (this.isOffBoard(x, y)) {
      this.selected = undefined;
    } else if (this.tiles[x][y] && this.tiles[x][y].colour === this.turn) {
      this.selected = JSON.parse(JSON.stringify(this.tiles[x][y]));
      this.legalMoves = this.tiles[this.selected.x][
        this.selected.y
      ].findLegalMoves(this.tiles);
    } else if (this.selected) {
      const potentialMove = this.legalMoves.find((e) => e.x == x && e.y == y);
      if (potentialMove) {
        this.move(this.selected, potentialMove);
      } else {
        this.selected = undefined;
      }
    }
  }

  move(from, to) {
    console.log(from, to);
    this.turn = this.turn === COLOUR.WHITE ? COLOUR.BLACK : COLOUR.WHITE;
    this.tiles[from.x][from.y].userMove(to.x, to.y, this.tiles);
    this.selected = undefined;

    this.isInCheck = CheckFinder.isCurrentPlayerInCheck(this.tiles, this.turn);

    if (this.isInCheck) {
      let moves = CheckFinder.findMovesForCheckedPlayer(this.tiles, this.turn);
      if (moves.length === 0) {
        this.checkMate = true;
        console.log('Checkmate');
      }
    }

    if (this.socket.readyState > 0) {
      if (this.turn !== this.pov) {
        this.socket.send(
          `${this.gameCode} move ${this.idxToMove(from, to)} ${this.pov}`,
        );
      }
    }
  }

  moveToIdx(move) {
    const from = { x: 0, y: 0 };
    const to = { x: 0, y: 0 };
    const split = move.split('');
    if (this.pov === COLOUR.WHITE) {
      const abc = 'abcdefgh';
      from.x = abc.indexOf(split[0]);
      from.y = 8 - Number(split[1]);
      to.x = abc.indexOf(split[2]);
      to.y = 8 - Number(split[3]);
    } else {
      const abc = 'abcdefgh'.split('').reverse().join('');
      from.x = abc.indexOf(split[0]);
      from.y = Number(split[1]) - 1;
      to.x = abc.indexOf(split[2]);
      to.y = Number(split[3]) - 1;
    }
    console.log(from, to, 'moveToIdx');
    return { from, to };
  }

  idxToMove(from, to) {
    const abc = 'abcdefgh';
    let alMove = '';
    if (this.pov === COLOUR.WHITE) {
      alMove += abc[from.x] + (8 - from.y) + abc[to.x] + (8 - to.y);
    } else {
      alMove += abc[7 - from.x] + (from.y + 1) + abc[7 - to.x] + (to.y + 1);
    }
    return alMove;
  }

  isOffBoard(x, y) {
    return x > 7 || x < 0 || y > 7 || y < 0;
  }
}

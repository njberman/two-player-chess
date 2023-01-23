import Bishop from './Bishop.js';
import { COLOUR, SIZE, ABC, APIURL } from './constants.js';
import Pawn from './Pawn.js';
import Rook from './Rook.js';
import Knight from './Knight.js';
import King from './King.js';
import Queen from './Queen.js';
import CheckFinder from './CheckFinder.js';
import { convertToFen } from './convertToFen.js';

export default class Board {
  constructor(diff_level) {
    this.sizeOfSquare = SIZE / 8;
    this.tiles = this.createTiles();
    this.turn = COLOUR.WHITE;
    this.isInCheck = false;
    this.checkMate = false;

    this.stockfish = new Worker('/2d-chess-ai/assets/stockfish2.js');
    this.stockfish.postMessage('uci');
    this.stockfish.postMessage('ucinewgame');
    this.stockfish.postMessage(
      'setoption name Skill Level value ' + diff_level,
    );
    this.stockfish.addEventListener('message', (e) => console.log(e.data));
    this.depth = 10;
    this.diff = 'easy';
    this.elo = diff_level;

    // this.socket = new WebSocket(`ws${APIURL.replace('http', '')}`);
    // this.socket.onopen = () => {
    //   console.log('[open] Connection Established');
    // };

    this.lastMove = {
      from: { x: undefined, y: undefined },
      to: { x: undefined, y: undefined },
    };
    this.started = false;
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
        if (this.started) {
          if (
            (this.lastMove.from.x === i && this.lastMove.from.y === j) ||
            (this.lastMove.to.x === i && this.lastMove.to.y === j)
          ) {
            push();
            noStroke();
            fill(255, 254, 134, 100);
            rect(x, y, this.sizeOfSquare, this.sizeOfSquare);
            pop();
          }
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
      text(ABC[i], x + w / 2 - 10, y - w / 2 + w - 12);
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
      text(8 - i, x - w / 2 + 10, y + w / 2 - w + 15);
      pop();
    }

    this.displaySelected();

    if (this.checkMate && this.isInCheck) {
      push();
      textAlign(CENTER, CENTER);
      textSize(80);
      noStroke();
      fill(0, 200);
      text('Checkmate!', SIZE / 2, SIZE / 2);
      pop();
    } else if (this.isInCheck) {
      push();
      textAlign(CENTER, CENTER);
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

  aiMove() {
    console.log(this.checkMate);
    if (this.turn === COLOUR.BLACK && !this.checkMate) {
      if (this.diff === 'easy') {
        // Random moves
        const blackPieces = [];
        for (let col of this.tiles) {
          for (let piece of col) {
            if (piece && piece.colour === COLOUR.BLACK) blackPieces.push(piece);
          }
        }
        let randMove;
        while (!this.checkMate) {
          const randPiece =
            blackPieces[Math.floor(Math.random() * blackPieces.length)];
          const randMoves = randPiece.findLegalMoves(this.tiles);
          const { x, y } = randPiece;
          if (randMoves.length > 0) {
            const { x: x2, y: y2 } =
              randMoves[Math.floor(Math.random() * randMoves.length)];
            randMove = { from: { x, y }, to: { x: x2, y: y2 } };
            break;
          }
        }
        this.move(randMove.from, randMove.to);
      } else if (this.diff === 'diff') {
        // Stockfish
        const board = this;
        this.stockfish.postMessage('position fen ' + convertToFen(this));
        this.stockfish.postMessage(`go depth ${this.depth}`);
        this.stockfish.addEventListener('message', function (e) {
          if (e.data.includes('bestmove')) {
            console.log(e.data);
            const blackBestMovePos = e.data.split(' ')[1];
            board.blackBestMove = {
              from: { x: undefined, y: undefined },
              to: { x: undefined, y: undefined },
            };
            // Convert pos to x and y
            board.blackBestMove.from.x = ABC.indexOf(blackBestMovePos[0]);
            board.blackBestMove.from.y = 8 - blackBestMovePos[1];
            board.blackBestMove.to.x = ABC.indexOf(blackBestMovePos[2]);
            board.blackBestMove.to.y = 8 - blackBestMovePos[3];
            if (
              board.tiles[board.blackBestMove.from.x][
                board.blackBestMove.from.y
              ]
            ) {
              board.move(board.blackBestMove.from, board.blackBestMove.to);
            }
            return;
          }
        });
        // if (this.socket.readyState === 1) {
        //   this.socket.send(`ai ${this.elo} ${convertToFen(this)}`);
        //   this.socket.onmessage = (e) => {
        //     if (e.data.includes('bestmove') && this.turn === COLOUR.BLACK) {
        //       const { from, to } = this.moveToIdx(e.data.split(' ')[1]);
        //       this.move(from, to);
        //     }
        //   };
        // }
      }
    }
  }

  moveToIdx(move) {
    const from = { x: 0, y: 0 };
    const to = { x: 0, y: 0 };
    const split = move.split('');
    const abc = 'abcdefgh';
    from.x = abc.indexOf(split[0]);
    from.y = 8 - Number(split[1]);
    to.x = abc.indexOf(split[2]);
    to.y = 8 - Number(split[3]);
    return { from, to };
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
    this.lastMove.from = from;
    this.lastMove.to = to;
    this.started = true;

    this.aiMove();

    this.isInCheck = CheckFinder.isCurrentPlayerInCheck(this.tiles, this.turn);

    if (this.isInCheck) {
      let moves = CheckFinder.findMovesForCheckedPlayer(this.tiles, this.turn);
      if (moves.length === 0) {
        this.checkMate = true;
        console.log('Checkmate');
      }
    }
  }

  isOffBoard(x, y) {
    return x > 7 || x < 0 || y > 7 || y < 0;
  }
}

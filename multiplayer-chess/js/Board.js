import Bishop from './Bishop.js';
import { COLOUR, SIZE, SPRITES } from './constants.js';
import Pawn from './Pawn.js';
import Rook from './Rook.js';
import Knight from './Knight.js';
import King from './King.js';
import Queen from './Queen.js';
import CheckFinder from './CheckFinder.js';

export default class Board {
  constructor(fen) {
    this.sizeOfSquare = SIZE / 8;
    // this.tiles = this.createTiles();
    this.tiles = this.createTilesWithFen(fen);
    this.turn = COLOUR.WHITE;
    this.isInCheck = false;
    this.fen = fen;
  }

  isLowerCase(str) {
    return str.toUpperCase() !== str;
  }

  createTilesWithFen(fen) {
    if (fen.includes('w')) {
      this.turn = COLOUR.WHITE;
    } else if (fen.includes('b')) {
      this.turn = COLOUR.BLACK;
    }
    fen = fen.split(' ')[0].split('');

    let k = 0;
    let tiles = this.createEmptyBoard();
    for (let j = 0; j < tiles.length; j++) {
      for (let i = 0; i < tiles[j].length; i++) {
        if ('rnbqkpPRNBQK/'.includes(fen[k])) {
          if (this.isLowerCase(fen[k])) {
            switch (fen[k]) {
              case 'r':
                tiles[i][j] = new Rook(i, j, COLOUR.BLACK, SPRITES.black.rook);
                break;
              case 'n':
                tiles[i][j] = new Knight(
                  i,
                  j,
                  COLOUR.BLACK,
                  SPRITES.black.knight,
                );
                break;
              case 'b':
                tiles[i][j] = new Bishop(
                  i,
                  j,
                  COLOUR.BLACK,
                  SPRITES.black.bishop,
                );
                break;
              case 'q':
                tiles[i][j] = new Queen(
                  i,
                  j,
                  COLOUR.BLACK,
                  SPRITES.black.queen,
                );
                break;
              case 'k':
                tiles[i][j] = new King(i, j, COLOUR.BLACK, SPRITES.black.king);
                break;
              case 'p':
                tiles[i][j] = new Pawn(i, j, COLOUR.BLACK, SPRITES.black.pawn);
                break;
            }
          } else if (!this.isLowerCase(fen[k])) {
            if (fen[k] === '/') {
              i--;
            }
            switch (fen[k]) {
              case 'R':
                tiles[i][j] = new Rook(i, j, COLOUR.WHITE, SPRITES.white.rook);
                break;
              case 'N':
                tiles[i][j] = new Knight(
                  i,
                  j,
                  COLOUR.WHITE,
                  SPRITES.white.knight,
                );
                break;
              case 'B':
                tiles[i][j] = new Bishop(
                  i,
                  j,
                  COLOUR.WHITE,
                  SPRITES.white.bishop,
                );
                break;
              case 'Q':
                tiles[i][j] = new Queen(
                  i,
                  j,
                  COLOUR.WHITE,
                  SPRITES.white.queen,
                );
                break;
              case 'K':
                tiles[i][j] = new King(i, j, COLOUR.WHITE, SPRITES.white.king);
                break;
              case 'P':
                tiles[i][j] = new Pawn(i, j, COLOUR.WHITE, SPRITES.white.pawn);
                break;
            }
          }
        } else if ('12345678'.includes(fen[k])) {
          i += Number(fen[k]) - 1;
        }
        k++;
      }
    }
    return tiles;
  }

  createTiles() {
    let tiles = this.createEmptyBoard();

    for (let i = 0; i < 8; i++) {
      tiles[i][1] = new Pawn(i, 1, COLOUR.BLACK, '♟');
      tiles[i][6] = new Pawn(i, 6, COLOUR.WHITE, '♙');
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
          fill(205, 205, 205);
          rect(x, y, this.sizeOfSquare, this.sizeOfSquare);
          pop();
        } else {
          push();
          fill(255, 255, 255);
          rect(x, y, this.sizeOfSquare, this.sizeOfSquare);
          pop();
        }
        if (currentTile) {
          currentTile.draw(x, y);
        }
      }
    }
    this.displaySelected();
  }

  displaySelected() {
    if (this.selected) {
      const tile = this.tiles[this.selected.x][this.selected.y];
      if (tile) {
        push();
        fill(100, 255, 100, 100);

        for (const move of this.legalMoves) {
          rect(
            this.getPos(move.x),
            this.getPos(move.y),
            this.sizeOfSquare,
            this.sizeOfSquare,
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
        console.log('Checkmate');
      }
    }
  }

  isOffBoard(x, y) {
    return x > 7 || x < 0 || y > 7 || y < 0;
  }
}

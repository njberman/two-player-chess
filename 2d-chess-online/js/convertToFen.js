import Bishop from './Bishop.js';
import { COLOUR } from './constants.js';
import King from './King.js';
import Knight from './Knight.js';
import Pawn from './Pawn.js';
import Queen from './Queen.js';
import Rook from './Rook.js';

const SPRITES = {
  black: {
    rook: '♜',
    knight: '♞',
    bishop: '♝',
    queen: '♛',
    king: '♚',
    pawn: '♟',
  },
  white: {
    rook: '♖',
    knight: '♘',
    bishop: '♗',
    queen: '♕',
    king: '♔',
    pawn: '♙',
  },
};

export function convertToFen(board) {
  const tiles = board.tiles;
  let fen = '';
  let blank = 0;
  for (let j = 0; j < tiles.length; j++) {
    blank = 0;
    for (let i = 0; i < tiles[j].length; i++) {
      const tile = tiles[i][j];
      if (
        (tile !== undefined) & (blank > 0) ||
        (i === 7) & (tile === undefined)
      ) {
        if ((i === 7) & (tile === undefined)) {
          blank++;
        }
        fen += String(blank);
        blank = 0;
      }
      if (tile !== undefined) {
        if (tile.colour === 'black') {
          for (let sprite in SPRITES.black) {
            if (tile.sprite === SPRITES.black[sprite]) {
              if (sprite !== 'knight') {
                fen += sprite.split('')[0];
              } else {
                fen += 'n';
              }
            }
          }
        } else if (tile.colour === 'white') {
          for (let sprite in SPRITES.white) {
            if (tile.sprite === SPRITES.white[sprite]) {
              if (sprite !== 'knight') {
                fen += sprite.split('')[0].toUpperCase();
              } else {
                fen += 'N';
              }
            }
          }
        }
      } else {
        blank += 1;
      }
      if ((i === 7) & (j !== 7)) {
        fen += '/';
      }
    }
  }

  if (board.turn === COLOUR.WHITE) fen += ' w';
  else fen += ' b';

  fen += ' KQkq - 0 1';

  console.log(fen);

  return fen;
}

export function convertToTiles(ogFen) {
  function createEmptyBoard() {
    let board = [];
    for (let i = 0; i < 8; i++) {
      board[i] = [];
      for (let j = 0; j < 8; j++) {
        board[i][j] = undefined;
      }
    }
    return board;
  }
  let tiles = createEmptyBoard();
  let i = 0;
  let j = 0;
  let fen = ogFen;
  fen = fen.split(' ')[0];
  console.log(fen);
  for (let char of fen) {
    if (char > 0) {
      for (let k = j; k < j + Number(char); k++) {
        tiles[i][k] = undefined;
        i++;
      }
    } else {
      switch (char.toLowerCase()) {
        case 'p':
          if (char === 'P') {
            tiles[i][j] = new Pawn(i, j, COLOUR.WHITE, SPRITES.white.pawn);
          } else {
            tiles[i][j] = new Pawn(i, j, COLOUR.BLACK, SPRITES.black.pawn);
          }
          i++;
          break;
        case 'r':
          if (char === 'R') {
            tiles[i][j] = new Rook(i, j, COLOUR.WHITE, SPRITES.white.rook);
          } else {
            tiles[i][j] = new Rook(i, j, COLOUR.BLACK, SPRITES.black.rook);
          }
          i++;
          break;
        case 'n':
          if (char === 'N') {
            tiles[i][j] = new Knight(i, j, COLOUR.WHITE, SPRITES.white.knight);
          } else {
            tiles[i][j] = new Knight(i, j, COLOUR.BLACK, SPRITES.black.knight);
          }
          i++;
          break;
        case 'b':
          if (char === 'B') {
            tiles[i][j] = new Bishop(i, j, COLOUR.WHITE, SPRITES.white.bishop);
          } else {
            tiles[i][j] = new Bishop(i, j, COLOUR.BLACK, SPRITES.black.bishop);
          }
          i++;
          break;
        case 'q':
          if (char === 'Q') {
            tiles[i][j] = new Queen(i, j, COLOUR.WHITE, SPRITES.white.queen);
          } else {
            tiles[i][j] = new Queen(i, j, COLOUR.BLACK, SPRITES.black.queen);
          }
          i++;
          break;
        case 'k':
          if (char === 'K') {
            tiles[i][j] = new King(i, j, COLOUR.WHITE, SPRITES.white.king);
          } else {
            tiles[i][j] = new King(i, j, COLOUR.BLACK, SPRITES.black.king);
          }
          i++;
          break;
        case '/':
          j++;
          i = 0;
          break;
      }
    }
  }

  for (let x = 0; x < 8; x++) {
    if (tiles[x].length > 8) tiles[x].splice(8);
  }

  let turn = ogFen.split(' ')[1] === 'b' ? COLOUR.BLACK : COLOUR.WHITE;
  return { tiles, turn };
}

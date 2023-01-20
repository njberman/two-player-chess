import CheckFinder from './CheckFinder.js';
import { SIZE } from './constants.js';
import imagePaths from './imagePaths.js';
import images from './preloadImages.js';
export default class Piece {
  constructor(x, y, colour, sprite) {
    this.x = x;
    this.y = y;
    this.colour = colour;
    this.hasMoved = false;
    this.sprite = sprite;
    this.w = SIZE / 8;
  }

  userMove(toX, toY, tiles, board) {
    this.hasMoved = true;

    const prev = tiles[toX][toY];
    if (prev !== undefined) {
      if (board.socket.readyState > 0) {
        board.socket.send(`take ${board.gameCode} ${prev.sprite}`);
      }
    }
    this.move(toX, toY, tiles);
  }

  move(toX, toY, tiles) {
    const fromX = this.x;
    const fromY = this.y;

    tiles[toX][toY] = this;

    this.x = toX;
    this.y = toY;

    tiles[fromX][fromY] = undefined;
  }

  findLegalMoves(tiles) {
    let moves = this.findMoves(tiles);
    for (let i = moves.length - 1; i >= 0; i--) {
      const currentMove = moves[i];
      if (
        CheckFinder.movePutsPlayerInCheck(
          this.x,
          this.y,
          currentMove.x,
          currentMove.y,
          tiles,
          this.colour,
        )
      ) {
        moves.splice(i, 1);
      }
    }
    return moves;
  }

  isOffBoard(newX, newY) {
    return newX > 7 || newX < 0 || newY > 7 || newY < 0;
  }

  draw(x, y) {
    //text(this.sprite, x, y);
    imageMode(CENTER);
    image(images[this.sprite], x, y, this.w, this.w);
  }
}

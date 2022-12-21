import { COLOUR, SPRITES } from './constants.js';

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

  return fen;
}

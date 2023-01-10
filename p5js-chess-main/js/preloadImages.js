const images = {
  '♙': undefined,
  '♖': undefined,
  '♘': undefined,
  '♗': undefined,
  '♕': undefined,
  '♔': undefined,

  '♟': undefined,
  '♜': undefined,
  '♞': undefined,
  '♝': undefined,
  '♛': undefined,
  '♚': undefined,
};
window.preload = () => {
  images['♙'] = loadImage('/p5js-chess-main/pieces_images/pawn_w.png');
  images['♟'] = loadImage('/p5js-chess-main/pieces_images/pawn_b.png');
  images['♖'] = loadImage('/p5js-chess-main/pieces_images/rook_w.png');
  images['♜'] = loadImage('/p5js-chess-main/pieces_images/rook_b.png');
  images['♘'] = loadImage('/p5js-chess-main/pieces_images/knight_w.png');
  images['♞'] = loadImage('/p5js-chess-main/pieces_images/knight_b.png');
  images['♗'] = loadImage('/p5js-chess-main/pieces_images/bishop_w.png');
  images['♝'] = loadImage('/p5js-chess-main/pieces_images/bishop_b.png');
  images['♕'] = loadImage('/p5js-chess-main/pieces_images/queen_w.png');
  images['♛'] = loadImage('/p5js-chess-main/pieces_images/queen_b.png');
  images['♔'] = loadImage('/p5js-chess-main/pieces_images/king_w.png');
  images['♚'] = loadImage('/p5js-chess-main/pieces_images/king_b.png');
};

export default images;

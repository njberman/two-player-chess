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
  images['♙'] = loadImage('/2d-chess/pieces_images/pawn_w.png');
  images['♟'] = loadImage('/2d-chess/pieces_images/pawn_b.png');
  images['♖'] = loadImage('/2d-chess/pieces_images/rook_w.png');
  images['♜'] = loadImage('/2d-chess/pieces_images/rook_b.png');
  images['♘'] = loadImage('/2d-chess/pieces_images/knight_w.png');
  images['♞'] = loadImage('/2d-chess/pieces_images/knight_b.png');
  images['♗'] = loadImage('/2d-chess/pieces_images/bishop_w.png');
  images['♝'] = loadImage('/2d-chess/pieces_images/bishop_b.png');
  images['♕'] = loadImage('/2d-chess/pieces_images/queen_w.png');
  images['♛'] = loadImage('/2d-chess/pieces_images/queen_b.png');
  images['♔'] = loadImage('/2d-chess/pieces_images/king_w.png');
  images['♚'] = loadImage('/2d-chess/pieces_images/king_b.png');
};

export default images;

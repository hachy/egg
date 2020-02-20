type Piece = import('./piece').Piece;

export class Global {
  static pieces: Piece[] = [];
  static waiting: Piece[] = [];
  static gameOver = false;
  static done = false;
  static moveDownN = 0;
  static anim: number;
  static dropStart = Date.now();
}

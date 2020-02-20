import { canvasEl, COL, ROW, SQX, SQY, VACANT, board } from './const';

export class Canvas {
  static ctx = canvasEl.getContext('2d') as CanvasRenderingContext2D;

  static drawSquare(x: number, y: number, image: string): void {
    const img = new Image();
    img.src = image;
    img.onload = (): void => {
      this.ctx.drawImage(img, x * SQX, y * SQY, SQX, SQY);
    };
  }

  static drawBoard(y = 0): void {
    for (let r = y; r < ROW; r++) {
      for (let c = 0; c < COL; c++) {
        Canvas.drawSquare(c, r, board[r][c]);
      }
    }
  }

  static swap(h: number, pxl: number, pxr: number): void {
    const max = pxr + 1;
    let left: string[] = [];
    let right: string[] = [];
    for (let c = pxl; c < max; c++) {
      for (let r = h; r < ROW; r++) {
        if (pxl === c) {
          left.push(board[r][c]);
          Canvas.drawSquare(c, r, VACANT);
        } else {
          right.push(board[r][c]);
          Canvas.drawSquare(c, r, VACANT);
        }
      }
    }
    const res = right.concat(left);
    let n = 0;
    for (let c = pxl; c < max; c++) {
      for (let r = h; r < ROW; r++) {
        Canvas.drawSquare(c, r, res[n]);
        board[r][c] = res[n];
        n++;
      }
    }
    left = [];
    right = [];
  }
}

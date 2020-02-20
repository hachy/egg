import { canvasEl, COL, ROW, SQX, SQY, VACANT, VACANT_COLOR, PLATE, board } from './const';

export class Canvas {
  static ctx = canvasEl.getContext('2d') as CanvasRenderingContext2D;

  static drawSquare(x: number, y: number, image: string): void {
    const img = new Image();
    img.src = image;
    img.onload = (): void => {
      this.ctx.drawImage(img, x * SQX, y * SQY, SQX, SQY);
      this.ctx.beginPath();
      this.ctx.moveTo(0, SQY);
      this.ctx.lineTo(4 * SQX, SQY);
      this.ctx.strokeStyle = '#555555';
      this.ctx.stroke();
    };
  }

  static drawBoard(y = 0): void {
    for (let r = y; r < ROW; r++) {
      for (let c = 0; c < COL; c++) {
        Canvas.drawSquare(c, r, board[r][c]);
      }
    }
  }

  static drawPlate(): void {
    this.ctx.fillStyle = VACANT_COLOR;
    this.ctx.fillRect(0, 9 * SQY, COL * SQX, SQY);

    const img = new Image();
    img.src = PLATE;
    img.onload = (): void => {
      this.ctx.drawImage(img, 0 * SQX, 9.1 * SQY);
      this.ctx.drawImage(img, 3 * SQX, 9.1 * SQY);
    };
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

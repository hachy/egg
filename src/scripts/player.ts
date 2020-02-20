import { canvasEl, COL, SQX, SQY } from './const';

export class Player {
  ctx: CanvasRenderingContext2D;
  x: number;

  constructor(x = 1) {
    this.ctx = canvasEl.getContext('2d') as CanvasRenderingContext2D;
    this.x = x;
    this.draw();
  }

  get xLeft(): number {
    return this.x;
  }

  get xRight(): number {
    return this.x + 1;
  }

  draw(): void {
    this.ctx.fillStyle = 'purple';
    this.ctx.fillRect(this.x * SQX, 9.5 * SQY, SQX * 2, SQY / 2);
  }

  unDraw(): void {
    this.ctx.fillStyle = 'white';
    this.ctx.fillRect(this.x * SQX, 9.5 * SQY, SQX * 2, SQY / 2);
  }

  left(): void {
    if (this.x > 0) {
      this.unDraw();
      this.x--;
      this.draw();
    }
  }

  right(): void {
    if (this.x < COL - 2) {
      this.unDraw();
      this.x++;
      this.draw();
    }
  }
}

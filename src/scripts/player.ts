import { canvasEl, COL, SQX, SQY, VACANT_COLOR, PLAYER, PLATE } from './const';

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
    const img = new Image();
    img.src = PLAYER;
    img.onload = (): void => {
      this.ctx.drawImage(img, this.x * SQX, 9.1 * SQY);
    };
  }

  unDraw(moveLeft = true): void {
    this.ctx.fillStyle = VACANT_COLOR;
    this.ctx.fillRect(this.x * SQX, 9 * SQY, SQX * 2, SQY);

    const img = new Image();
    img.src = PLATE;
    img.onload = (): void => {
      if (moveLeft) {
        this.ctx.drawImage(img, (this.x + 2) * SQX, 9.1 * SQY);
      } else {
        this.ctx.drawImage(img, (this.x - 1) * SQX, 9.1 * SQY);
      }
    };
  }

  left(): void {
    if (this.x > 0) {
      this.unDraw(true);
      this.x--;
      this.draw();
    }
  }

  right(): void {
    if (this.x < COL - 2) {
      this.unDraw(false);
      this.x++;
      this.draw();
    }
  }
}

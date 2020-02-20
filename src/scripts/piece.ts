import { COL, ROW, VACANT, UPPER_SHELL, LOWER_SHELL, board } from './const';
import { Canvas } from './canvas';
import { Global } from './global';
import { ready } from './ready';

const wait = (ms: number): Promise<number> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export class Piece {
  x: number;
  y: number;
  image: string;

  constructor(x: number, y: number, image: string) {
    this.image = image;
    this.x = x;
    this.y = y;
  }

  draw(): void {
    Canvas.drawSquare(this.x, this.y, this.image);
  }

  unDraw(): void {
    Canvas.drawSquare(this.x, this.y, VACANT);
  }

  left(): void {
    if (!this.collision(-1, 0)) {
      this.x--;
      this.draw();
    }
  }

  right(): void {
    if (!this.collision(1, 0)) {
      this.x++;
      this.draw();
    }
  }

  eggArr(): number[] {
    const ny = this.y + 1;
    const a = [];

    let firstLowerShell;
    for (let i = ny; i < ROW; i++) {
      if (board[i][this.x] === LOWER_SHELL) {
        firstLowerShell = i;
        break;
      }
    }
    if (firstLowerShell) {
      for (let i = ny; i <= firstLowerShell; i++) {
        a.push(i);
      }
    }
    return a;
  }

  async hatch(arr: number[]): Promise<void> {
    cancelAnimationFrame(Global.anim);
    arr.pop();
    for (const a of arr) {
      const nny = this.y + 1;
      this.unDraw();
      Canvas.drawSquare(this.x, nny, VACANT);
      board[this.y][this.x] = VACANT;
      board[nny][this.x] = VACANT;
      this.y++;
      this.draw();
      await wait(400);
      if (nny === a) {
        this.unDraw();
        Canvas.drawSquare(this.x, this.y + 1, VACANT);
        board[this.y + 1][this.x] = VACANT;
        Global.dropStart = Date.now();
      }
    }
  }

  checkLower(): void {
    const ny = this.y + 1;
    if (ny < ROW) {
      if (board[ny][this.x] === this.image) {
        this.unDraw();
        Canvas.drawSquare(this.x, ny, VACANT);
        board[this.y][this.x] = VACANT;
        board[ny][this.x] = VACANT;
      } else if (board[this.y][this.x] === UPPER_SHELL) {
        if (this.eggArr().length === 0) {
          this.unDraw();
          board[this.y][this.x] = VACANT;
        } else if (this.eggArr().length === 1) {
          this.unDraw();
          board[this.y][this.x] = VACANT;
          Canvas.drawSquare(this.x, this.y + 1, VACANT);
          board[this.y + 1][this.x] = VACANT;
        } else {
          this.hatch(this.eggArr());
        }
      }
    } else if (ny >= ROW) {
      // UPPER_SHELLが一番下に来たとき消す
      if (board[this.y][this.x] === UPPER_SHELL) {
        this.unDraw();
        board[this.y][this.x] = VACANT;
      }
    }
  }

  down(): void {
    if (!this.collision(0, 1)) {
      this.unDraw();
      this.y++;
      this.draw();
    } else {
      this.lock();
      this.checkLower();
      Global.pieces = Global.pieces.filter(p => p !== this);
      if (Global.pieces.length === 0) {
        Canvas.drawBoard(1);
        ready();
      }
    }
  }

  collision(x: number, y: number): boolean {
    const nx = this.x + x;
    const ny = this.y + y;

    if (nx < 0 || nx >= COL || ny >= ROW) {
      return true;
    }

    if (board[ny][nx] !== VACANT) {
      return true;
    }
    return false;
  }

  lock(): void {
    board[this.y][this.x] = this.image;
    if (this.y <= 0) {
      console.log('gameover');
      Global.gameOver = true;
    }
  }
}
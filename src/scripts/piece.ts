import { COL, ROW, VACANT, UPPER_SHELL, LOWER_SHELL, board } from './const';
import { Canvas } from './canvas';
import { Global } from './global';
import { wait } from './util';
import { Score } from './score';

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
      Canvas.moveLeft(this.x, this.y, this.image);
      this.x--;
    }
  }

  right(): void {
    if (!this.collision(1, 0)) {
      Canvas.moveRight(this.x, this.y, this.image);
      this.x++;
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
      Score.count(5);
      await wait(400);
      if (nny === a) {
        this.unDraw();
        Canvas.drawSquare(this.x, this.y + 1, VACANT);
        board[this.y + 1][this.x] = VACANT;
        Global.dropStart = Date.now();
        Score.count(5);
      }
    }
    await wait(200);
    Global.preventKey = false;
  }

  checkLower(): void {
    const ny = this.y + 1;
    if (ny < ROW) {
      if (board[ny][this.x] === this.image) {
        this.unDraw();
        Canvas.drawSquare(this.x, ny, VACANT);
        board[this.y][this.x] = VACANT;
        board[ny][this.x] = VACANT;
        Score.count(1);
      } else if (board[this.y][this.x] === UPPER_SHELL) {
        if (this.eggArr().length === 0) {
          this.unDraw();
          board[this.y][this.x] = VACANT;
        } else if (this.eggArr().length === 1) {
          this.unDraw();
          board[this.y][this.x] = VACANT;
          Canvas.drawSquare(this.x, this.y + 1, VACANT);
          board[this.y + 1][this.x] = VACANT;
          Score.count(1);
        } else {
          Global.preventKey = true;
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
      for (let c = 0; c < COL; c++) {
        if (board[0][c] !== VACANT) {
          console.log('gameover');
          Global.gameOver = true;
          Global.pauseDisabled = true;
        }
      }
      Global.pieces = Global.pieces.filter(p => p !== this);
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
  }
}

import { COL, ROW, CHARACTER } from './const';
import { getNumber, wait } from './util';
import { Canvas } from './canvas';
import { Global } from './global';
import { Piece } from './piece';
import { ready } from './ready';

const pattern = [
  [0, 1],
  [0, 2],
  [0, 3],
  [0, 1, 2, 3],
  [1, 2],
  [1, 3],
  [2, 3]
];

export class Game {
  static test1(): void {
    for (let c = 1; c < COL - 1; c++) {
      for (let r = 4; r < ROW; r++) {
        const p = new Piece(c, r, CHARACTER[getNumber()]);
        p.draw();
        p.lock();
      }
    }
  }

  static test2(): void {
    const c = [5, 2, 3, 5];
    for (let r = 0; r < c.length; r++) {
      const p = new Piece(1, r + 5, CHARACTER[c[r]]);
      p.draw();
      p.lock();
    }
    const p1 = new Piece(3, 8, CHARACTER[1]);
    p1.draw();
    p1.lock();
  }

  static test3(): void {
    for (let c = 1; c < COL - 1; c++) {
      for (let r = 1; r < ROW; r++) {
        const p = new Piece(c, r, CHARACTER[getNumber()]);
        p.draw();
        p.lock();
      }
    }
  }

  static drop(): void {
    const now = Date.now();
    const delta = now - Global.dropStart;

    if (delta > 1000) {
      Game.piecesDown();
      Global.dropStart = Date.now();
    }
    if (!Global.gameOver) {
      Global.anim = requestAnimationFrame(Game.drop);
    }
  }

  static standby(): void {
    if (Global.done) {
      return;
    }
    Global.waiting = [];
    const rand = Math.floor(Math.random() * pattern.length);
    pattern[rand].forEach(v => {
      const rand2 = Math.floor(Math.random() * CHARACTER.length);
      const p = new Piece(v, 0, CHARACTER[rand2]);
      p.draw();
      Global.waiting.push(p);
    });
    Global.done = true;
  }

  static piecesDown(): void {
    if (!Global.gameOver) {
      Global.pieces.forEach(p => {
        if (Global.standbyFlag) {
          Game.spawn();
          Global.standbyFlag = false;
        }
        p.down();
      });
      if (Global.pieces.length === 0) {
        Canvas.drawBoard(1);
        ready();
        Global.standbyFlag = true;
      }
    }
  }

  static async spawn(): Promise<void> {
    await wait(200);
    Game.standby();
  }

  static swap(h: number, pxl: number, pxr: number): void {
    Global.pieces.forEach(p => {
      if (p.y >= h) {
        if (pxl === p.x) {
          p.right();
        }
        if (pxr === p.x) {
          p.left();
        }
      }
    });
  }
}

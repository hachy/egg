import { COL, ROW, VACANT, board, CHARACTER } from './const';
import { getNumber, wait, lockedH } from './util';
import { Canvas } from './canvas';
import { Global } from './global';
import { Piece } from './piece';
import { ready } from './ready';
import { Player } from './player';

const pattern = [
  [0, 1],
  [0, 2],
  [0, 3],
  [0, 1, 2, 3],
  [1, 2],
  [1, 3],
  [2, 3]
];

class Game {
  startBtn: HTMLButtonElement;
  player!: Player;

  constructor() {
    this.startBtn = document.getElementById('startBtn') as HTMLButtonElement;
  }

  init(): void {
    this.startBtn.addEventListener('click', () => this.start());
  }

  start(): void {
    this.startBtn.style.display = 'none';
    Game.createBoard();
    Canvas.drawBoard();
    Canvas.drawPlate();

    this.player = new Player();

    // Game.test1();
    Game.test2();
    // Game.test3();

    Game.spawn();
    ready();
    Game.drop();
    document.addEventListener('keydown', e => this.keydown(e));
  }

  keydown(e: KeyboardEvent): void {
    if (Global.gameOver) {
      e.preventDefault();
      return;
    }
    switch (e.keyCode) {
      case 37:
        this.player.left();
        break;
      case 38:
        break;
      case 39:
        this.player.right();
        break;
      case 40:
        if (!Global.preventKey) {
          Game.piecesDown();
          Global.anim = requestAnimationFrame(Game.drop);
        }
        break;
      case 32: {
        if (!Global.preventKey) {
          const h = lockedH(this.player.xLeft);
          if (h) {
            Canvas.swap(h, this.player.xLeft, this.player.xRight);
            Game.swap(h, this.player.xLeft, this.player.xRight);
          }
          this.player.swap();
        }
        break;
      }
      default:
        break;
    }
  }

  static createBoard(): void {
    for (let r = 0; r < ROW; r++) {
      board[r] = [];
      for (let c = 0; c < COL; c++) {
        board[r][c] = VACANT;
      }
    }
  }

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

const game = new Game();
game.init();

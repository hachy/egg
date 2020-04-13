import { COL, ROW, VACANT, board, CHARACTER } from './const';
import { getNumber, wait, lockedH } from './util';
import { Canvas } from './canvas';
import { Global } from './global';
import { Piece } from './piece';
import { ready } from './ready';
import { Player } from './player';
import { Score } from './score';
import { GameOver } from './gameover';

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
  newGameBtn: HTMLButtonElement;
  pauseBtn: HTMLButtonElement;
  resumeBtn: HTMLButtonElement;
  swapBtn: HTMLButtonElement;
  leftBtn: HTMLButtonElement;
  rightBtn: HTMLButtonElement;
  downBtn: HTMLButtonElement;
  player!: Player;

  constructor() {
    this.startBtn = document.getElementById('startBtn') as HTMLButtonElement;
    this.newGameBtn = document.getElementById('newGameBtn') as HTMLButtonElement;
    this.pauseBtn = document.getElementById('pauseBtn') as HTMLButtonElement;
    this.resumeBtn = document.getElementById('resumeBtn') as HTMLButtonElement;
    this.swapBtn = document.getElementById('btn-swap') as HTMLButtonElement;
    this.leftBtn = document.getElementById('btn-left') as HTMLButtonElement;
    this.rightBtn = document.getElementById('btn-right') as HTMLButtonElement;
    this.downBtn = document.getElementById('btn-down') as HTMLButtonElement;
    document.addEventListener('keydown', (e) => this.keydown(e));
  }

  init(): void {
    Global.gameOver = true;
    this.startBtn.addEventListener('click', () => this.start());
    this.newGameBtn.addEventListener('click', () => this.newGame());
    this.pauseBtn.addEventListener('click', () => this.pause());
    this.resumeBtn.addEventListener('click', () => this.resume());
    this.swapBtn.addEventListener('click', () => this.swapCtrl());
    this.leftBtn.addEventListener('click', () => this.leftCtrl());
    this.rightBtn.addEventListener('click', () => this.rightCtrl());
    this.downBtn.addEventListener('click', () => this.downCtrl());
  }

  start(): void {
    Global.gameOver = false;
    this.startBtn.style.display = 'none';
    this.pauseBtn.disabled = false;
    Game.createBoard();
    Canvas.drawBoard();
    Canvas.drawPlate();

    this.player = new Player();

    Game.production();
    // Game.test1();

    Game.spawn();
    ready();
    Game.drop();
  }

  newGame(): void {
    this.resumeBtn.style.display = 'none';
    GameOver.hide();
    Global.waiting = [];
    Global.gameOver = false;
    Global.pauseDisabled = false;
    Score.count(0);
    this.start();
  }

  pause(): void {
    if (!Global.pauseDisabled) {
      if (!Global.gameOver) {
        Global.gameOver = true;
        this.resumeBtn.style.display = 'block';
      } else {
        this.resume();
      }
    }
  }

  resume(): void {
    if (!Global.pauseDisabled) {
      Global.gameOver = false;
      Global.anim = requestAnimationFrame(Game.drop);
      this.resumeBtn.style.display = 'none';
    }
  }

  keydown(e: KeyboardEvent): void {
    switch (e.keyCode) {
      case 37:
        this.leftCtrl();
        break;
      case 39:
        this.rightCtrl();
        break;
      case 40:
        this.downCtrl();
        break;
      case 32: {
        this.swapCtrl();
        break;
      }
      default:
        break;
    }
  }

  leftCtrl(): void {
    if (!Global.gameOver) {
      this.player.left();
    }
  }

  rightCtrl(): void {
    if (!Global.gameOver) {
      this.player.right();
    }
  }

  // eslint-disable-next-line class-methods-use-this
  downCtrl(): void {
    if (!Global.gameOver) {
      if (!Global.preventKey) {
        Game.piecesDown();
        Global.anim = requestAnimationFrame(Game.drop);
      }
    }
  }

  swapCtrl(): void {
    if (!Global.gameOver) {
      if (!Global.preventKey) {
        const h = lockedH(this.player.xLeft);
        if (h) {
          Canvas.swap(h, this.player.xLeft, this.player.xRight);
          Game.swap(h, this.player.xLeft, this.player.xRight);
        }
        this.player.swap();
      }
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

  static production(): void {
    for (let c = 0; c < COL; c++) {
      for (let r = 5; r < ROW; r++) {
        const p = new Piece(c, r, CHARACTER[getNumber()]);
        p.draw();
        p.lock();
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

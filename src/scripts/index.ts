import { COL, ROW, VACANT, board } from './const';
import { Global } from './global';
import { lockedH } from './util';
import { Canvas } from './canvas';
import { Game } from './game';
import { ready } from './ready';
import { Player } from './player';
import { Score } from './score';

for (let r = 0; r < ROW; r++) {
  board[r] = [];
  for (let c = 0; c < COL; c++) {
    board[r][c] = VACANT;
  }
}

Score.count(0);

Canvas.drawBoard();
Canvas.drawPlate();

const player = new Player();

// Game.test1();
Game.test2();
// Game.test3();

Game.standby();
ready();
// Game.drop();

document.addEventListener('keydown', e => {
  if (Global.gameOver) {
    e.preventDefault();
    return;
  }
  switch (e.keyCode) {
    case 37:
      player.left();
      break;
    case 38:
      break;
    case 39:
      player.right();
      break;
    case 40:
      Game.piecesDown();
      break;
    case 32: {
      const h = lockedH(player.xLeft);
      if (h) {
        Canvas.swap(h, player.xLeft, player.xRight);
        Game.swap(h, player.xLeft, player.xRight);
      }
      player.swap();
      break;
    }
    default:
      break;
  }
});

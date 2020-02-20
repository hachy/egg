import { COL, ROW, VACANT, board } from './const';
import { lockedH } from './util';
import { Canvas } from './canvas';
import { Game } from './game';
import { ready } from './ready';
import { Player } from './player';

for (let r = 0; r < ROW; r++) {
  board[r] = [];
  for (let c = 0; c < COL; c++) {
    board[r][c] = VACANT;
  }
}

Canvas.drawBoard();
Canvas.drawPlate();

const player = new Player();

// Game.test1();
Game.test2();

Game.standby();
ready();

// Game.drop();

document.addEventListener('keydown', e => {
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
      break;
    }
    default:
      break;
  }
});

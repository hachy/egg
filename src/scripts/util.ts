import { ROW, VACANT, board } from './const';

export const getNumber = (): number => {
  const min = 0;
  const max = 4;
  let random;

  do {
    random = Math.floor(Math.random() * (max - min)) + min;
  } while (random === getNumber.last);
  getNumber.last = random;
  return random;
};

export const lockedH = (px: number): number => {
  let h!: number;
  const pxr = px + 2;
  let exitLoops = false;
  for (let r = 1; r < ROW; r++) {
    for (let c = px; c < pxr; c++) {
      if (board[r][c] !== VACANT) {
        h = r;
        exitLoops = true;
        break;
      }
    }
    if (exitLoops) break;
  }
  return h;
};

export const wait = (ms: number): Promise<number> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

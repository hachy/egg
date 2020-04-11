import { Global } from './global';

export class Score {
  static el = document.getElementById('score') as HTMLSpanElement;

  static count(i: number): void {
    if (i === 0) {
      Global.score = 0;
    } else {
      Global.score += i;
    }
    Score.el.textContent = `${Global.score}`;
  }
}

import { Global } from './global';

export class Score {
  static el = document.getElementById('score') as HTMLSpanElement;

  static count(i: number): void {
    Global.score += i;
    Score.el.textContent = `${Global.score}`;
  }
}

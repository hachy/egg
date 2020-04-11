import { Global } from './global';

export class Score {
  static els = document.getElementsByClassName('score') as HTMLCollection;

  static count(i: number): void {
    if (i === 0) {
      Global.score = 0;
    } else {
      Global.score += i;
    }
    Score.els[0].textContent = `${Global.score}`; // header score
    Score.els[1].textContent = `${Global.score}`; // final score
  }
}

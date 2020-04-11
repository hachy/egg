export class GameOver {
  static panel = document.getElementById('game-over') as HTMLDivElement;

  static show(): void {
    GameOver.panel.style.display = 'block';
  }

  static hide(): void {
    GameOver.panel.style.display = 'none';
  }
}

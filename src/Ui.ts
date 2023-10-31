import { App } from "./App";
import { IDrawable } from "./IDrawable";

type UiState = "running" | "lose" | "win";

export class Ui implements IDrawable {
  private static readonly RIGHT_PADDING = 100;
  private static readonly DURATION = 2;
  private static readonly ANIMATION_SPEED = 8;
  public score = 0;
  private bestScore = parseInt(localStorage.getItem("score")!);
  private currentWaveHighlightDelay = 0;
  private bestScoreHighlightDelay = 0;
  private _state: UiState = "running";
  private _currentWave = 0;

  public reset() {
		this.score = 0;
    this._state = "running";
    this._currentWave = 0;
  }
  public incrementWave() {
    this._currentWave++;
    this.currentWaveHighlightDelay = Ui.DURATION;
  }
  public end(state: UiState) {
    this._state = state;
    if (!isNaN(this.bestScore) && this.bestScore > this.score)
      return;
    localStorage.setItem("score", `${this.score}`);
    this.bestScore = this.score;
    this.bestScoreHighlightDelay = Ui.DURATION * Ui.DURATION;
  }
  update(delta: number) {
    this.currentWaveHighlightDelay = Math.max(0, this.currentWaveHighlightDelay - delta);
    this.bestScoreHighlightDelay = Math.max(0, this.bestScoreHighlightDelay - delta);
  }
  draw(ctx: CanvasRenderingContext2D) {
    ctx.font = "16px Joystick";
    ctx.fillStyle = "rgb(32, 200, 32)";
    ctx.textAlign = "right";
    ctx.textBaseline = "top";
    if (this.score > this.bestScore) {
      ctx.fillStyle = "rgb(32, 255, 32)";
    }
    ctx.fillText("Score: ", App.WIDTH - Ui.RIGHT_PADDING, 10);
    ctx.fillText(`${this.score * App.SCORE_MULTIPLIER}`, App.WIDTH - 10, 10);
    ctx.fillStyle = "rgb(32, 200, 32)";
    ctx.font = `${16 + Math.sin(this.bestScoreHighlightDelay * Ui.ANIMATION_SPEED)}px Joystick`;
    ctx.fillText("Highscore: ", App.WIDTH - Ui.RIGHT_PADDING, 30);
    ctx.fillText(`${this.bestScore * App.SCORE_MULTIPLIER}`, App.WIDTH - 10, 30);
    ctx.font = `${16 + Math.sin(this.currentWaveHighlightDelay * Ui.ANIMATION_SPEED)}px Joystick`;
    ctx.fillText("Wave: ", App.WIDTH - Ui.RIGHT_PADDING, 50);
    ctx.fillText(`${this._currentWave + 1}`, App.WIDTH - 10, 50);
    if (this.state !== "running") {
			ctx.font = '40px Joystick';
			ctx.textAlign = 'center';
			ctx.fillText('Game over', App.WIDTH * 0.5, App.HEIGHT * 0.3);
			ctx.font = '15px Joystick';
			ctx.fillText('Press Enter to restart', App.WIDTH * 0.5, App.HEIGHT * 0.5);
		}
  }

  public get currentWave() {
    return (this._currentWave);
  }
  public get state() {
    return (this._state);
  }
}
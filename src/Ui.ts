import { App } from "./App";
import { IDrawable } from "./IDrawable";
import { SoundManager } from "./SoundManager";

type UiState = "menu" | "running" | "lose" | "win";

export class Ui implements IDrawable {
  private static readonly RIGHT_PADDING = 80;
  private static readonly DURATION = 2;
  private static readonly ANIMATION_SPEED = 8;
  private static readonly BLINK_DURATION = 0.5;
  public score = 0;
  private bestScore = parseInt(localStorage.getItem("score") || "0");
  private currentWaveHighlightDelay = 0;
  private bestScoreHighlightDelay = 0;
  private time = 0;
  private _state: UiState = "menu";
  private _currentWave = 0;

  private drawGameover(ctx: CanvasRenderingContext2D) {
    ctx.font = "30px Joystick";
    ctx.textAlign = "center";
    ctx.fillText(this.state === "win" ? "Congratulations!" : "Game over", App.WIDTH * 0.5, App.HEIGHT * 0.3);
    ctx.font = `${16 + Math.sin(this.bestScoreHighlightDelay) * Ui.ANIMATION_SPEED}px Joystick`;
    ctx.fillText(`Score: ${this.score * 100}`, App.WIDTH * 0.5, App.HEIGHT * 0.4);
    if (~~(this.time / Ui.BLINK_DURATION) % 2 === 0) {
      ctx.font = "16px Joystick";
      ctx.fillText("Press Enter to restart", App.WIDTH * 0.5, App.HEIGHT * 0.5);
    }
  }
  private drawMenu(ctx: CanvasRenderingContext2D) {
    ctx.font = "30px Joystick";
    ctx.textAlign = "center";
    ctx.fillText("Space Invader", App.WIDTH * 0.5, App.HEIGHT * 0.3);
    if (this.bestScore !== 0) {
      ctx.font = "16px Joystick";
      ctx.fillText(`Best Score: ${this.bestScore * 100}`, App.WIDTH * 0.5, App.HEIGHT * 0.4);
    }
    if (~~(this.time / Ui.BLINK_DURATION) % 2 === 0) {
      ctx.font = "16px Joystick";
      ctx.fillText("Press Enter to start", App.WIDTH * 0.5, App.HEIGHT * 0.5);
    }
  }

  public reset() {
    this.score = 0;
    this._state = "running";
    this._currentWave = 0;
    this.currentWaveHighlightDelay = Ui.DURATION;
  }
  public incrementWave() {
    this._currentWave++;
    this.currentWaveHighlightDelay = Ui.DURATION;
  }
  public end(state: UiState) {
    this._state = state;
    if (this.bestScore >= this.score) return;
    localStorage.setItem("score", `${this.score}`);
    this.bestScore = this.score;
    this.bestScoreHighlightDelay = Ui.DURATION * Ui.DURATION;
    SoundManager.play("gameover");
  }
  public update(delta: number) {
    this.time += delta;
    this.currentWaveHighlightDelay = Math.max(
      0, this.currentWaveHighlightDelay - delta
    );
    this.bestScoreHighlightDelay = Math.max(
      0, this.bestScoreHighlightDelay - delta
    );
  }
  public draw(ctx: CanvasRenderingContext2D) {
    ctx.font = "16px Joystick";
    ctx.fillStyle = "rgb(32, 200, 32)";
    ctx.textAlign = "right";
    ctx.textBaseline = "top";
    if (this.state === "menu") {
      this.drawMenu(ctx);
      return;
    }
    if (this.score > this.bestScore) {
      ctx.fillStyle = "rgb(32, 255, 32)";
    }
    ctx.fillText("Score: ", App.WIDTH - Ui.RIGHT_PADDING, 10);
    ctx.fillText(`${this.score * App.SCORE_MULTIPLIER}`, App.WIDTH - 10, 10);
    ctx.fillStyle = "rgb(32, 200, 32)";
    ctx.font = `${16 + Math.sin(this.bestScoreHighlightDelay * Ui.ANIMATION_SPEED)}px Joystick`;
    ctx.fillText("Highscore: ", App.WIDTH - Ui.RIGHT_PADDING, 30);
    ctx.fillText(
      `${this.bestScore * App.SCORE_MULTIPLIER}`,
      App.WIDTH - 10,
      30
    );
    ctx.font = `${16 + Math.sin(this.currentWaveHighlightDelay * Ui.ANIMATION_SPEED)}px Joystick`;
    ctx.fillText("Wave: ", App.WIDTH - Ui.RIGHT_PADDING, 50);
    ctx.fillText(`${this._currentWave + 1}`, App.WIDTH - 10, 50);
    if (this.currentWaveHighlightDelay > 0) {
      ctx.font = "30px Joystick";
      ctx.textAlign = "center";
      ctx.fillText(`Wave ${this._currentWave + 1}`, App.WIDTH * 0.5, App.HEIGHT * 0.4);
    }
    if (this.state === "lose" || this.state === "win") {
      this.drawGameover(ctx);
    }
  }

  public get currentWave() {
    return this._currentWave;
  }
  public get state() {
    return this._state;
  }
}

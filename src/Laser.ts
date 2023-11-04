import { App } from "./App";
import { ProgressBar } from "./ProgressBar";
import { Vector2 } from "./Vector2";

export class Laser {
  private static readonly LOAD_SIZE = 20;
  private static readonly DURATION = 0.8;
  private progress = new ProgressBar();
  private loader = 0;
  private duration = 0;

  public reset() {
    this.loader = 0;
  }
  public load() {
    this.loader++;
  }
  public trigger() {
    if (this.loader < Laser.LOAD_SIZE)
      return;
    this.duration = Laser.DURATION;
    this.loader = 0;
  }
  public update(delta: number): void {
    this.duration -= delta;
  }
  public draw(ctx: CanvasRenderingContext2D, position: Vector2): void {
    ctx.font = "16px Joystick";
    ctx.textAlign = "left";
    ctx.fillText("Laser", 110, 10);
    this.progress.draw(ctx, Math.min(1, this.loader / Laser.LOAD_SIZE), { x: 110, y: 25 });
    if (!this.isActive)
      return;
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'yellow';
    ctx.beginPath();
    ctx.moveTo(position.x + App.TILE_SIZE / 2, 0);
    ctx.lineTo(position.x + App.TILE_SIZE / 2, position.y);
    ctx.stroke();
  }
  public get isActive() {
    return (this.duration > 0);
  }
}
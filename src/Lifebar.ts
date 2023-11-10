import { ProgressBar } from "./ProgressBar";

export class Lifebar extends ProgressBar {
  public draw(ctx: CanvasRenderingContext2D, lives: number): void {
    ctx.font = "16px Joystick";
    ctx.textAlign = "left";
    ctx.fillText("Health", 10, 10);
    super.draw(ctx, Math.max(0, lives / Lifebar.NB), { x: 10, y: 25 });
  }
}
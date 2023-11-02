import { Vector2 } from "./Vector2";

export class ProgressBar {
  private static readonly IMAGE = document.getElementById("health") as HTMLImageElement;
  public static readonly NB = 5;

  public draw(ctx: CanvasRenderingContext2D, percent: number, position: Vector2): void {
    const HEIGHT = ProgressBar.IMAGE.height / (ProgressBar.NB + 1);

    ctx.drawImage(
      ProgressBar.IMAGE,
      0, HEIGHT * Math.ceil(ProgressBar.NB * (1 - percent)),
      ProgressBar.IMAGE.width, HEIGHT,
      position.x, position.y,
      ProgressBar.IMAGE.width * 2,
      HEIGHT * 2,
    );
  }
}
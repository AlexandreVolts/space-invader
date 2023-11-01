export class Lifebar {
  private static readonly IMAGE = document.getElementById("health") as HTMLImageElement;
  public static readonly NB = 5;

  public draw(ctx: CanvasRenderingContext2D, lives: number): void {
    const HEIGHT = Lifebar.IMAGE.height / (Lifebar.NB + 1);

    ctx.font = "16px Joystick";
    ctx.textAlign = "left";
    ctx.fillText("Health", 10, 10);
    ctx.drawImage(
      Lifebar.IMAGE,
      0, HEIGHT * (Lifebar.NB - lives),
      Lifebar.IMAGE.width, HEIGHT,
      10, 25,
      Lifebar.IMAGE.width * 2,
      HEIGHT * 2,
    );
  }
}
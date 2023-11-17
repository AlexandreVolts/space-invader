import { Vector2 } from "../Vector2";
import { AEnemy } from "./AEnemy";

export class Phantom extends AEnemy {
  private static readonly VISIBLE_TIME = 4;
  private time = 0;
  // TODO: Finish Phantom class.
  constructor(position: Vector2, boss: boolean) {
    super(3, 5, boss, 2);
    this.position = position;
  }

  private get isVisible() {
    return (~~(this.time / Phantom.VISIBLE_TIME) % 3 !== 2);
  }

  public collidesWithXAxis(x: number) {
    return (this.isVisible && super.collidesWithXAxis(x));
  }
  public collidesWith(point: Readonly<Vector2>) {
    return (this.isVisible && super.collidesWith(point));
  }
  public update(delta: number) {
    super.update(delta);
    this.time += delta;
  }
  public draw(ctx: CanvasRenderingContext2D) {
    ctx.globalAlpha = !this.isVisible ? 0.5 : 1;
    super.draw(ctx);
    ctx.globalAlpha = 1;
  }
}
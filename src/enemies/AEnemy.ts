import { ASpaceInvaderSprites } from "../ASpaceInvaderSprites";
import { App } from "../App";
import { IPooledObject } from "../pools/IPooledObject";
import { Vector2 } from "../Vector2";

export abstract class AEnemy extends ASpaceInvaderSprites {
  private static readonly HIT_MARKER_DURATION = 0.75;
  private static readonly HIT_MARKER_BLINK_RATE = 0.2;
  private hitMarker = 0;

  constructor(gridPos: Readonly<Vector2>, public readonly score: number, private lives = 2) {
    super(gridPos, { x: 1, y: 0 });
  }

  public collidesWith(point: Readonly<Vector2>) {
    return (
      point.x > this.position.x &&
      point.y > this.position.y &&
      point.x < this.position.x + App.TILE_SIZE &&
      point.y < this.position.y + App.TILE_SIZE * 0.5
    );
  }
  public hit() {
    this.lives--;
    this.hitMarker = AEnemy.HIT_MARKER_DURATION;
  }
  public update(delta: number) {
    super.update(delta);
    this.hitMarker -= this.hitMarker <= 0 ? 0 : delta;
  }
  public draw(ctx: CanvasRenderingContext2D) {
    if (this.hitMarker % AEnemy.HIT_MARKER_BLINK_RATE > AEnemy.HIT_MARKER_BLINK_RATE * 0.5) {
      return;
    }
    super.draw(ctx);
  }

  public get isAlive() {
    return (this.lives > 0);
  }
}
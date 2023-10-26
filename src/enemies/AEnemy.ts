import { ASpaceInvaderSprites } from "../ASpaceInvaderSprites";
import { App } from "../App";
import { Vector2 } from "../Vector2";
import { rand } from "../rand";

export abstract class AEnemy extends ASpaceInvaderSprites {
  private static readonly HIT_MARKER_DURATION = 0.75;
  private static readonly HIT_MARKER_BLINK_RATE = 0.2;
  private static readonly MIN_COOLDOWN = 2.5;
  private static readonly MAX_COOLDOWN = 20;
  private hitMarker = 0;
  private cooldown = rand(AEnemy.MIN_COOLDOWN, AEnemy.MAX_COOLDOWN);

  constructor(gridPos: Readonly<Vector2>, public readonly score: number, private lives = 2) {
    super(gridPos, { x: 1, y: 0 });
  }

  public hit() {
    this.lives--;
    this.hitMarker = AEnemy.HIT_MARKER_DURATION;
  }
  public shoot(): Vector2 | undefined {
    if (this.cooldown > 0)
      return;
    this.cooldown += rand(AEnemy.MIN_COOLDOWN, AEnemy.MAX_COOLDOWN);
    return ({ ...this.position });
  }
  public update(delta: number) {
    super.update(delta);
    this.hitMarker -= this.hitMarker <= 0 ? 0 : delta;
    this.cooldown -= delta;
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
import { ASpaceInvaderSprites } from "./ASpaceInvaderSprites";
import { Vector2 } from "./Vector2";

export class ABlinkSprite extends ASpaceInvaderSprites {
  private static readonly BLINK_DURATION = 0.6;
  private static readonly BLINK_BLINK_RATE = 0.2;
  private hitMarker = 0;

  constructor(
    gridPos: Readonly<Vector2>,
    animationBox: Readonly<Vector2> = { x: 0, y: 0 },
    width = 1,
    size = 1,
  ) {
    super(gridPos, animationBox, width, size);
  }

  public blink() {
    this.hitMarker = ABlinkSprite.BLINK_DURATION;
  }

  public update(delta: number) {
    super.update(delta);
    this.hitMarker -= this.hitMarker <= 0 ? 0 : delta;
  }
  public draw(ctx: CanvasRenderingContext2D) {
    if (this.hitMarker % ABlinkSprite.BLINK_BLINK_RATE > ABlinkSprite.BLINK_BLINK_RATE * 0.5) {
      return;
    }
    super.draw(ctx);
  }
  public get isBlinking() {
    return (this.hitMarker > 0);
  }
}
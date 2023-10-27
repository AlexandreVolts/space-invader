import { ABlinkSprite } from "../ABlinkSprite";
import { Vector2 } from "../Vector2";
import { rand } from "../rand";

export abstract class AEnemy extends ABlinkSprite {
  private static readonly MIN_COOLDOWN = 2.5;
  private static readonly MAX_COOLDOWN = 20;
  private cooldown = rand(AEnemy.MIN_COOLDOWN, AEnemy.MAX_COOLDOWN);

  constructor(gridPos: Readonly<Vector2>, public readonly score: number, private lives = 2) {
    super(gridPos, { x: 1, y: 0 });
  }

  public hit() {
    this.lives--;
    this.blink();
  }
  public shoot(): Vector2 | undefined {
    if (this.cooldown > 0)
      return;
    this.cooldown += rand(AEnemy.MIN_COOLDOWN, AEnemy.MAX_COOLDOWN);
    return ({ ...this.position });
  }
  public update(delta: number) {
    super.update(delta);
    this.cooldown -= delta;
  }

  public get isAlive() {
    return (this.lives > 0);
  }
}
import { ABlinkSprite } from "../ABlinkSprite";
import { App } from "../App";
import { SoundManager } from "../SoundManager";
import { Vector2 } from "../Vector2";
import { rand } from "../rand";

export abstract class AEnemy extends ABlinkSprite {
  public static readonly BOSS_SIZE = 3;
  private static readonly MIN_COOLDOWN = 2.5;
  private static readonly MAX_COOLDOWN = 20;
  private static readonly BOSS_LIFE_MULTIPLIER = 6;
  protected cooldown = rand(AEnemy.MIN_COOLDOWN, AEnemy.MAX_COOLDOWN);

  constructor(
    gridPos: Readonly<Vector2>,
    public readonly score: number,
    public readonly boss = false,
    private lives = 2
  ) {
    super(gridPos, { x: 1, y: 0 }, 1, boss ? AEnemy.BOSS_SIZE : 1);
    if (this.boss) {
      this.lives *= AEnemy.BOSS_LIFE_MULTIPLIER;
      this.score *= AEnemy.BOSS_LIFE_MULTIPLIER;
    }
  }

  public hit() {
    this.lives--;
    this.blink();
    if (this.lives > 0) SoundManager.play("enemy-hit");
  }
  public shoot(): Vector2 | undefined {
    if (this.cooldown > 0) return;
    this.cooldown = rand(AEnemy.MIN_COOLDOWN, AEnemy.MAX_COOLDOWN);
    if (!this.boss) {
      return { ...this.position };
    }
    this.cooldown /= AEnemy.BOSS_LIFE_MULTIPLIER;
    return { x: this.position.x + App.TILE_SIZE, y: this.position.y };
  }
  public update(delta: number) {
    super.update(delta);
    this.cooldown -= delta;
  }
  public getPosition() {
    return { ...this.position };
  }

  public get isAlive() {
    return this.lives > 0;
  }
}

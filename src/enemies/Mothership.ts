import { ASpaceInvaderSprites } from "../ASpaceInvaderSprites";
import { App } from "../App";
import { SoundManager } from "../SoundManager";
import { rand } from "../rand";

export class Mothership extends ASpaceInvaderSprites {
  private static readonly SPEED = 140;
  private static readonly MIN_DELAY = 15;
  private static readonly MAX_DELAY = 45;
  private delay = rand(Mothership.MIN_DELAY, Mothership.MAX_DELAY);
  private vy = 0;
  private alive = true;

  constructor() {
    super({ x: 3, y: 0 }, { x: 0, y: 0 }, 1, 2);
    this.position.x = -App.TILE_SIZE * 2;
    this.position.y = App.TILE_SIZE * 2;
  }

  public kill() {
    this.alive = false;
    SoundManager.play("mothership-hit");
  }
  public update(delta: number) {
    this.delay -= delta;
    if (this.delay > 0) return;
    if (this.delay >= -delta) SoundManager.play("mothership");
    this.position.x += Mothership.SPEED * delta;
    this.position.y += this.vy;
    if (!this.isAlive) {
      this.vy += delta * 10;
    }
  }
  public get isAlive() {
    return this.alive;
  }
}

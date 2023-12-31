import { ABlinkSprite } from "./ABlinkSprite";
import { App } from "./App";
import { Vector2 } from "./Vector2";

export class Player extends ABlinkSprite {
  private static readonly SPEED_X = 185;
  private vx = 0;
  public isFiring = false;

  constructor() {
    super({ x: 4, y: 0 });
    this.position.x = (App.WIDTH - App.TILE_SIZE) / 2;
    this.position.y = App.HEIGHT - App.TILE_SIZE * 2;
  }

  public move(dir: -1 | 0 | 1) {
    this.vx = dir * Player.SPEED_X;
  }
  public update(delta: number) {
    super.update(delta);
    this.position.x += this.vx * delta;
    this.position.x = Math.max(
      0,
      Math.min(App.WIDTH - App.TILE_SIZE, this.position.x)
    );
  }
  public getPosition(): Readonly<Vector2> {
    return this.position;
  }
}

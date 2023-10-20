import { App } from "./App";
import { ASpaceInvaderSprites } from "./ASpaceInvaderSprites";

export class Player extends ASpaceInvaderSprites {
  private static readonly SPEED_X = 300;
  private vx = 0;

  constructor() {
    super({ x: 4, y: 0 });
    this.position.x = (App.WIDTH - App.TILE_SIZE) / 2;
    this.position.y = App.HEIGHT - App.TILE_SIZE * 2;
  }

  public move(dir: -1 | 0 | 1) {
    this.vx = dir * Player.SPEED_X;
  }
  public update(delta: number) {
    this.position.x += this.vx * delta;
  }
  public getPosition() {
    return { ...this.position };
  }
}
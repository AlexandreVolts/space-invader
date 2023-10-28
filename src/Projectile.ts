import { IPooledObject } from "./pools/IPooledObject";
import { ASpaceInvaderSprites } from "./ASpaceInvaderSprites";
import { Vector2 } from "./Vector2";
import { App } from "./App";
import { Direction } from "./Direction";

export class Projectile extends ASpaceInvaderSprites implements IPooledObject {
  private vy = 500;
  private free = true;

  constructor(dir: Direction = -1) {
    super({ x: 2, y: 0 });
    this.vy *= dir;
  }

  public trigger(position: Readonly<Vector2>) {
    this.position = { ...position };
    this.free = false;
  }
  public kill() {
    this.free = true;
  }
  public update(delta: number) {
    this.position.y += this.vy * delta;
    if (this.position.y < -App.TILE_SIZE || this.position.y > App.HEIGHT) {
      this.kill();
    }
  }

  public getHitPoint() {
    return ({
      x: this.position.x + App.TILE_SIZE * 0.5,
      y: this.position.y,
    });
  }
  public get isAlive() {
    return (!this.free);
  }
}
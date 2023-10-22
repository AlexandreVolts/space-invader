import { IPooledObject } from "./IPooledObject";
import { ASpaceInvaderSprites } from "./ASpaceInvaderSprites";
import { Vector2 } from "./Vector2";
import { App } from "./App";

export class Projectile extends ASpaceInvaderSprites implements IPooledObject {
  private vy = -400;
  private free = true;

  constructor() {
    super({ x: 2, y: 0 });
  }

  public launch(position: Readonly<Vector2>) {
    this.position = { ...position };
    this.free = false;
  }
  public kill() {
    this.free = true;
  }
  public update(delta: number) {
    this.position.y += this.vy * delta;
    if (this.position.y < -App.TILE_SIZE) {
      this.kill();
    }
  }

  public getHitPoint() {
    return ({
      x: this.position.x + App.TILE_SIZE * 0.5,
      y: this.position.y,
    });
  }
  public get isAvailable() {
    return (this.free);
  }
}
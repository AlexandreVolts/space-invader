import { IPooledObject } from "./IPooledObject";
import { ASpaceInvaderSprites } from "./ASpaceInvaderSprites";
import { Vector2 } from "./Vector2";
import { App } from "./App";

export class Projectile extends ASpaceInvaderSprites implements IPooledObject {
  private vy = -500;
  private free = true;

  constructor() {
    super({ x: 2, y: 0 });
  }

  public launch(position: Vector2) {
    this.position = position;
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
  public get isAvailable() {
    return (this.free);
  }
}
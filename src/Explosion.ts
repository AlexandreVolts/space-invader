import { ASpaceInvaderSprites } from "./ASpaceInvaderSprites";
import { App } from "./App";
import { Vector2 } from "./Vector2";
import { IPooledObject } from "./pools/IPooledObject";

export class Explosion extends ASpaceInvaderSprites implements IPooledObject {
  private static readonly ANIMATION_ACCELERATION = 4;
  private static readonly ANIMATION_DURATION = 3 / Explosion.ANIMATION_ACCELERATION;
  private animation = 0;

  constructor() {
    super({ x: 2, y: 2 }, { x: 0, y: 3 });
  }

  public trigger(position: Readonly<Vector2>) {
    this.frame = 0;
    this.animation = Explosion.ANIMATION_DURATION;
    this.position = {
      x: ~~(position.x / App.TILE_SIZE) * App.TILE_SIZE,
      y: ~~(position.y / App.TILE_SIZE) * App.TILE_SIZE,
    };
  }
  public update(delta: number) {
    super.update(delta);
    this.frame += delta * Explosion.ANIMATION_ACCELERATION;
    this.animation -= delta;
  }

  public get isAlive() {
    return (this.animation > 0);
  }
}
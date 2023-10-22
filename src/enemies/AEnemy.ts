import { ASpaceInvaderSprites } from "../ASpaceInvaderSprites";
import { App } from "../App";
import { Vector2 } from "../Vector2";

export abstract class AEnemy extends ASpaceInvaderSprites {
  private _isAlive = true;

  constructor(gridPos: Readonly<Vector2>) {
    super(gridPos, { x: 1, y: 0 });
  }

  public collidesWith(point: Readonly<Vector2>) {
    return (
      point.x > this.position.x &&
      point.y > this.position.y &&
      point.x < this.position.x + App.TILE_SIZE &&
      point.y < this.position.y + App.TILE_SIZE * 0.5
    );
  }
  public kill() {
    this._isAlive = false;
  }
}
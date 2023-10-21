import { ASpaceInvaderSprites } from "../ASpaceInvaderSprites";
import { Vector2 } from "../Vector2";

export abstract class AEnemy extends ASpaceInvaderSprites {
  constructor(gridPos: Vector2) {
    super(gridPos, { x: 1, y: 0 });
  }
}
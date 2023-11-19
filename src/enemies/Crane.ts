import { Vector2 } from "../Vector2";
import { AEnemy } from "./AEnemy";

export class Crane extends AEnemy {
  constructor(position: Vector2, boss: boolean) {
    super(4, 5, boss, 8);
    this.position = position;
  }
  public shoot(): Vector2 | undefined {
    return (undefined);
  }
}

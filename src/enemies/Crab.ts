import { Vector2 } from "../Vector2";
import { AEnemy } from "./AEnemy";

export class Crab extends AEnemy {
  constructor(position: Vector2, boss: boolean) {
    super(0, 2, boss);
    this.position = position;
  }
}

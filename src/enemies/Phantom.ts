import { Vector2 } from "../Vector2";
import { AEnemy } from "./AEnemy";

export class Phantom extends AEnemy {
  // TODO: Finish Phantom class.
  constructor(position: Vector2, boss: boolean) {
    super(3, 5, boss, 3);
    this.position = position;
  }
}
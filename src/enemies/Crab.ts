import { Vector2 } from "../Vector2";
import { AEnemy } from "./AEnemy";

export class Crab extends AEnemy {
  constructor(position: Vector2) {
    super({ x: 0, y: 0 }, 1);
    this.position = position;
  }
}
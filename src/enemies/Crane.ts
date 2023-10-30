import { Vector2 } from "../Vector2";
import { AEnemy } from "./AEnemy";

export class Crane extends AEnemy {
  constructor(position: Vector2, boss: boolean) {
    super({x: 0, y: 4}, 5, boss, 4);
    this.position = position;
  }
}
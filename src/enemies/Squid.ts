import { Vector2 } from "../Vector2";
import { AEnemy } from "./AEnemy";

export class Squid extends AEnemy {
  constructor(position: Vector2, boss: boolean) {
    super(1, 4, boss, 2);
    this.position = position;
  }

  public update(delta: number) {
    super.update(delta);
    this.cooldown -= delta;
  }
}
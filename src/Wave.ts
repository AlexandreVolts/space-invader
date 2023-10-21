import { App } from "./App";
import { IDrawable } from "./IDrawable";
import { Vector2 } from "./Vector2";
import { AEnemy } from "./enemies/AEnemy";
import { Crab } from "./enemies/Crab";

export class Wave extends Array<AEnemy> implements IDrawable {
  constructor(private readonly size: Readonly<Vector2>) {
    super();
    for (let x = 0; x < size.x; x++) {
      for (let y = 0; y < size.y; y++) {
        this.push(new Crab({ x: x * App.TILE_SIZE, y: y * App.TILE_SIZE }));
      }
    }
  }
  public update(delta: number) {
    this.forEach((enemy) => enemy.update(delta));
  }
  public draw(ctx: CanvasRenderingContext2D) {
    this.forEach((enemy) => enemy.draw(ctx));
  }
}
import { IDrawable } from "../IDrawable";
import { Vector2 } from "../Vector2";
import { IPooledObject } from "./IPooledObject";

export class Pool<T extends IPooledObject> extends Array<T> implements IDrawable {
  public trigger(position: Readonly<Vector2>) {
    super.find((item) => !item.isAlive)?.trigger(position);
  }
  public apply = (callback: (item: T) => void) => super.filter((item) => item.isAlive).forEach(callback);

  public update(delta: number) {
    this.apply((item) => item.update(delta));
  }
  public draw = (ctx: CanvasRenderingContext2D) => this.apply((item) => item.draw(ctx));
}
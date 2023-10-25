import { IDrawable } from "../IDrawable";
import { Vector2 } from "../Vector2";

export interface IPooledObject extends IDrawable {
  trigger(position: Readonly<Vector2>): void;
  get isAlive(): boolean;
}
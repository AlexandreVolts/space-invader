import { App } from "./App";
import { IDrawable } from "./IDrawable";
import { Vector2 } from "./Vector2";
import { IPooledObject } from "./pools/IPooledObject";

type BonusType = "S" | "L" | "H";

export class Bonus implements IPooledObject, IDrawable {
  private static readonly IMAGE = document.getElementById(
    "bonuses"
  ) as HTMLImageElement;
  private static readonly TILE_WIDTH = Bonus.IMAGE.width / 6;
  private static readonly TILE_HEIGHT = Bonus.IMAGE.height / 4;
  private static readonly VY = 150;

  private readonly imageY: number;
  private _position: Vector2 = { x: 0, y: App.HEIGHT };

  constructor(public readonly type: BonusType) {
    switch (type) {
      case "S":
        this.imageY = 0;
        break;
      case "L":
        this.imageY = 1;
        break;
      case "H":
        this.imageY = 2;
        break;
    }
  }

  public trigger(position: Readonly<Vector2>): void {
    this._position = { ...position };
  }
  public kill() {
    this._position.y += App.HEIGHT;
  }
  public update(delta: number): void {
    this._position.y += Bonus.VY * delta;
  }
  public draw(ctx: CanvasRenderingContext2D): void {
    ctx.drawImage(
      Bonus.IMAGE,
      0,
      (this.imageY + 1) * Bonus.TILE_HEIGHT,
      Bonus.TILE_WIDTH,
      Bonus.TILE_HEIGHT,
      this._position.x,
      this._position.y,
      App.TILE_SIZE,
      App.TILE_SIZE
    );
  }

  public get position(): Vector2 {
    return { x: this._position.x + App.TILE_SIZE * 0.5, y: this._position.y };
  }
  public get isAlive(): boolean {
    return this._position.y < App.HEIGHT;
  }
}

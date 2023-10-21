import { App } from "./App";
import { IDrawable } from "./IDrawable";
import { Vector2 } from "./Vector2";

export abstract class ASpaceInvaderSprites implements IDrawable {
  private static readonly sprites = document.getElementById('space-invaders') as HTMLImageElement;
  private static readonly SPRITESHEET_COLS = 7;
  private static readonly SPRITESHEET_ROWS = 5;
  private static readonly TILE_WIDTH = ASpaceInvaderSprites.sprites.width / ASpaceInvaderSprites.SPRITESHEET_COLS;
  private static readonly TILE_HEIGHT = ASpaceInvaderSprites.sprites.height / ASpaceInvaderSprites.SPRITESHEET_ROWS;
  protected position: Vector2 = { x: 0, y: 0 };

  constructor(
    private readonly gridPos: Readonly<Vector2>,
    private readonly width = 1,
  ) {}

  public draw(ctx: CanvasRenderingContext2D) {
    ctx.drawImage(
      ASpaceInvaderSprites.sprites,
      this.gridPos.x * ASpaceInvaderSprites.TILE_WIDTH,
      this.gridPos.y * ASpaceInvaderSprites.TILE_HEIGHT,
      this.width * ASpaceInvaderSprites.TILE_WIDTH,
      ASpaceInvaderSprites.TILE_HEIGHT,
      this.position.x, this.position.y,
      App.TILE_SIZE * this.width,
      App.TILE_SIZE,
    )
  }
  
  public abstract update(delta: number): void;
}
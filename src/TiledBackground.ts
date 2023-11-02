import { App } from "./App";
import { IDrawable } from "./IDrawable";

export class TiledBackground implements IDrawable {
  private static readonly TILE_SIZE = 100;
  private static readonly CHANGE_LINE = 5;
  private static readonly NB_IMAGES = 3;
  private static readonly OFFSET_SPEED = 2;
  private readonly images: HTMLImageElement[] = [];
  private offsetX = 0;

  constructor() {
    for (let i = 0; i < TiledBackground.NB_IMAGES; i++) {
      this.images.push(document.getElementById(`background-${i}`) as HTMLImageElement);
    }
  }

  public update(delta: number) {
    this.offsetX = (this.offsetX + TiledBackground.OFFSET_SPEED * delta) % TiledBackground.TILE_SIZE;
  }
  public draw(ctx: CanvasRenderingContext2D) {
    for (let i = -TiledBackground.TILE_SIZE; i < App.WIDTH; i += TiledBackground.TILE_SIZE) {
      for (let j = 0; j < App.HEIGHT; j += TiledBackground.TILE_SIZE) {
        ctx.drawImage(this.images[0], i + this.offsetX, j, TiledBackground.TILE_SIZE, TiledBackground.TILE_SIZE);
        if (j / TiledBackground.TILE_SIZE === TiledBackground.CHANGE_LINE) {
          ctx.drawImage(this.images[1], i, j, TiledBackground.TILE_SIZE, TiledBackground.TILE_SIZE);
        }
        else if (j / TiledBackground.TILE_SIZE > TiledBackground.CHANGE_LINE) {
          ctx.drawImage(this.images[2], i, j, TiledBackground.TILE_SIZE, TiledBackground.TILE_SIZE);
        }
      }
    }
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 1;
    ctx.beginPath();
		ctx.moveTo(0, App.HEIGHT - App.TILE_SIZE * 2);
		ctx.lineTo(App.WIDTH, App.HEIGHT - App.TILE_SIZE * 2);
		ctx.stroke();
  }
}
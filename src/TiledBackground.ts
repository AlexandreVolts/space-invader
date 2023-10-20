import { App } from "./App";

export class TiledBackground {
  private static readonly TILE_SIZE = 100;
  private static readonly CHANGE_LINE = 5;
  private static readonly NB_IMAGES = 3;
  private readonly images: HTMLImageElement[] = [];

  constructor() {
    for (let i = 0; i < TiledBackground.NB_IMAGES; i++) {
      this.images.push(document.getElementById(`background-${i}`) as HTMLImageElement);
    }
  }

  public draw(ctx: CanvasRenderingContext2D) {
    for (let i = 0; i < App.WIDTH; i += TiledBackground.TILE_SIZE) {
      for (let j = 0; j < App.HEIGHT; j += TiledBackground.TILE_SIZE) {
        ctx.drawImage(this.images[0], i, j, TiledBackground.TILE_SIZE, TiledBackground.TILE_SIZE);
        if (j / TiledBackground.TILE_SIZE === TiledBackground.CHANGE_LINE) {
          ctx.drawImage(this.images[1], i, j, TiledBackground.TILE_SIZE, TiledBackground.TILE_SIZE);
        }
        else if (j / TiledBackground.TILE_SIZE > TiledBackground.CHANGE_LINE) {
          ctx.drawImage(this.images[2], i, j, TiledBackground.TILE_SIZE, TiledBackground.TILE_SIZE);
        }
      }
    }
  }
}
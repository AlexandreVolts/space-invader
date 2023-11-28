import { ABlinkSprite } from "./ABlinkSprite";
import { App } from "./App";

export class Shield extends ABlinkSprite {
  private static readonly NB_LIVES = 8;
  private static readonly LIVES_REGENERATION = 4;
  private static readonly NB_STATES = 4;
  private lives = Shield.NB_LIVES;

  constructor(index: number) {
    super({ x: 3, y: 1 }, { x: 0, y: 4 }, 2);
    
    const PADDING = (App.WIDTH - App.TILE_SIZE * 2 * App.NB_SHIELDS) / (App.NB_SHIELDS + 1);

    this.position.x = PADDING + (App.TILE_SIZE * 2 + PADDING) * index;
    this.position.y = App.HEIGHT - App.TILE_SIZE * 4;
  }
  public reset() {
    this.lives = Shield.NB_LIVES;
  }
  public regenerate() {
    this.lives = Math.min(this.lives + Shield.LIVES_REGENERATION, Shield.NB_LIVES);
  }
  public hit() {
    this.lives--;
    this.blink();
  }
  public update(delta: number) {
    super.update(delta);
    this.frame = Shield.NB_STATES - ~~(((this.lives + 1) / Shield.NB_LIVES) * Shield.NB_STATES);
  }
  public get isAlive() {
    return (this.lives > 0);
  }
}
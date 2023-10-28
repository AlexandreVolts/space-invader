import { ABlinkSprite } from "./ABlinkSprite";
import { App } from "./App";

export class Shield extends ABlinkSprite {
  private static readonly NB_LIVES = 8;
  private static readonly NB_STATES = 4;
  private lives = Shield.NB_LIVES;

  constructor(x: number) {
    super({ x: 3, y: 1 }, { x: 0, y: 4 }, 2);
    this.position.x = x;
    this.position.y = App.HEIGHT - App.TILE_SIZE * 4;
  }
  public reset() {
    this.lives = Shield.NB_LIVES;
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
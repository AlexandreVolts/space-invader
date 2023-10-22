import { App } from "./App";
import { IDrawable } from "./IDrawable";
import { ProjectilePool } from "./ProjectilePool";
import { Vector2 } from "./Vector2";
import { AEnemy } from "./enemies/AEnemy";
import { Crab } from "./enemies/Crab";

export class Wave extends Array<AEnemy> implements IDrawable {
  private static readonly DEFAULT_SPEED = 20;
  private readonly position: Vector2 = { x: 0, y: 0 };
  private readonly velocity: Vector2 = { x: 0, y: 0 };

  constructor(private readonly size: Readonly<Vector2>) {
    super();
    this.velocity.x = Wave.DEFAULT_SPEED;
    for (let x = 0; x < size.x; x++) {
      for (let y = 0; y < size.y; y++) {
        this.push(new Crab({ x: x * App.TILE_SIZE, y: y * App.TILE_SIZE }));
      }
    }
  }

  public analyseProjectiles(projectiles: Readonly<ProjectilePool>) {
    projectiles.apply((projectile) => {
      const position = {
        x: projectile.getHitPoint().x - this.position.x,
        y: projectile.getHitPoint().y - this.position.y,
      }
      this.forEach((enemy, index) => {
        if (!enemy.collidesWith(position)) {
          return;
        }
        enemy.kill();
        projectile.kill();
        this.splice(index, 1);
      });
    });
  }
  public update(delta: number) {
    this.position.x += this.velocity.x * delta;
    this.position.y += this.velocity.y * delta;
    this.forEach((enemy) => enemy.update(delta));
    if (this.position.x >= 0 && this.position.x + this.size.x * App.TILE_SIZE <= App.WIDTH) {
      return;
    }
    this.position.x = Math.max(0, Math.min(App.WIDTH - this.size.x * App.TILE_SIZE, this.position.x));
    this.position.y += App.TILE_SIZE;
    this.velocity.x *= -1;
  }
  public draw(ctx: CanvasRenderingContext2D) {
    ctx.translate(this.position.x, this.position.y);
    this.forEach((enemy) => enemy.draw(ctx));
    ctx.translate(-this.position.x, -this.position.y);
  }
}
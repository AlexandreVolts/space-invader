import { App } from "./App";
import { IDrawable } from "./IDrawable";
import { ProjectilePool } from "./ProjectilePool";
import { Vector2 } from "./Vector2";
import { AEnemy } from "./enemies/AEnemy";
import { Crab } from "./enemies/Crab";

export class Wave extends Array<AEnemy> implements IDrawable {
  private static readonly DEFAULT_SPEED = 20;
  private static readonly SPEED_ACCELERATION = 1.15;
  private readonly position: Vector2 = { x: 0, y: 0 };
  private readonly velocity: Vector2 = { x: 0, y: 0 };

  constructor(private readonly size: Readonly<Vector2>) {
    super();
    this.reset();
  }

  private getHorizontalPadding(dir: -1 | 1) {
    let x = dir === -1 ? this.size.x - 1 : 0;
    let y = 0;
    let selected = this[x + y * this.size.x];

    while(!selected.isAlive) {
      selected = this[x + y * this.size.x];
      y = (y + 1) % this.size.y;
      x += y === 0 ? dir : 0;
    }
    return (dir === 1 ? x : this.size.x - 1 - x);
  }
  private getVerticalSize() {
    let i = this.length - 1;

    for (; i >= 0 && !this[i].isAlive; i--);
    return (~~(i / this.size.x) + 1);
  }

  public analyseProjectiles(projectiles: Readonly<ProjectilePool>) {
    let score = 0;
  
    projectiles.apply((projectile) => {
      const position = {
        x: projectile.getHitPoint().x - this.position.x,
        y: projectile.getHitPoint().y - this.position.y,
      }
      this.filter((enemy) => enemy.isAlive).forEach((enemy) => {
        if (!enemy.collidesWith(position)) {
          return;
        }
        enemy.kill();
        projectile.kill();
        score += enemy.score;
      });
    });
    return (score);
  }
  public reset() {
    if (this.length > 0) {
      this.splice(0, this.length);
    }
    for (let y = 0; y < this.size.y; y++) {
      for (let x = 0; x < this.size.x; x++) {
        this.push(new Crab({ x: x * App.TILE_SIZE, y: y * App.TILE_SIZE + App.TILE_SIZE }));
      }
    }
    this.position.x = 0;
    this.position.y = 0;
    this.velocity.x = Wave.DEFAULT_SPEED;
  }
  public update(delta: number) {
    const leftPadding = -this.getHorizontalPadding(1) * App.TILE_SIZE;
    const rightPadding = App.WIDTH + this.getHorizontalPadding(-1) * App.TILE_SIZE;

    this.position.x += this.velocity.x * delta;
    this.position.y += this.velocity.y * delta;
    this.forEach((enemy) => enemy.update(delta));
    if (this.position.x >= leftPadding && this.position.x + this.size.x * App.TILE_SIZE <= rightPadding) {
      return;
    }
    this.position.x = Math.max(leftPadding, Math.min(rightPadding - this.size.x * App.TILE_SIZE, this.position.x));
    this.position.y += App.TILE_SIZE;
    this.velocity.x *= -1 * Wave.SPEED_ACCELERATION;
  }
  public draw(ctx: CanvasRenderingContext2D) {
    ctx.translate(this.position.x, this.position.y);
    this.filter((enemy) => enemy.isAlive).forEach((enemy) => enemy.draw(ctx));
    ctx.translate(-this.position.x, -this.position.y);
  }

  public get areAllEnemiesDead() {
    return (this.filter((enemy) => enemy.isAlive).length === 0);
  }
  public get hasReachedLimit() {
    const bottomY = this.position.y + this.getVerticalSize() * App.TILE_SIZE;

    return (bottomY >= App.HEIGHT - App.TILE_SIZE * 3);
  }
}
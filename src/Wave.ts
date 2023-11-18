import { App } from "./App";
import { IDrawable } from "./IDrawable";
import { ProjectilePool } from "./pools/ProjectilePool";
import { Vector2 } from "./Vector2";
import { AEnemy } from "./enemies/AEnemy";
import { Direction } from "./Direction";
import { Mothership } from "./enemies/Mothership";

type OnEnemyKilledCallback = (position: Vector2) => void;

export class Wave extends Array<AEnemy | null> implements IDrawable {
  private static readonly DEFAULT_SPEED = 20;
  private static readonly TRANSITION_DURATION = 4;
  private static readonly MOTHERSHIP_SPAWN_LIMIT = 10;
  private static readonly SPEED_ACCELERATION = 1.15;
  private static readonly MOTHERSHIP_DAMAGE_RATIO = 0.4;
  private readonly position: Vector2 = { x: 0, y: -App.HEIGHT * 0.5 };
  private readonly velocity: Vector2 = { x: Wave.DEFAULT_SPEED * Math.sign(Math.random() - 0.5), y: 0 };
  private readonly mothership = new Mothership();

  constructor(private readonly size: Readonly<Vector2>) {
    super();
  }

  private apply(callback: (enemy: AEnemy) => void) {
    (this.filter((enemy) => enemy?.isAlive) as AEnemy[]).forEach(callback);
  }
  private getHorizontalPadding(dir: Direction) {
    let x = dir === -1 ? this.size.x - 1 : 0;
    let y = 0;
    let index = x + y * this.size.x;
    let selected = this[index];

    while (!selected?.isAlive && index >= 0 && index < this.size.x * this.size.y) {
      y = (y + 1) % this.size.y;
      x += y === 0 ? dir : 0;
      index = x + y * this.size.x;
      selected = this[index];
    }
    if (selected?.boss) {
      if (dir === -1) {
        x += AEnemy.BOSS_SIZE - 1;
      }
    }
    return dir === 1 ? x : this.size.x - 1 - x;
  }
  private getVerticalSize() {
    let i = this.length - 1;

    for (; i >= 0 && !this[i]?.isAlive; i--);
    if (this[i]?.boss) {
      i += this.size.x;
    }
    return ~~(i / this.size.x) + 1;
  }
  private hitEnemy(enemy: AEnemy, onEnemyKilled: OnEnemyKilledCallback, position: Vector2) {
    enemy.hit();
    if (enemy.isAlive) {
      return (0);
    }
    onEnemyKilled(position);
    if (
      this.mothership.isAlive &&
      this.filter((enemy) => enemy?.isAlive).length < Wave.MOTHERSHIP_SPAWN_LIMIT
    ) {
      this.mothership.cancel();
    }
    return (enemy.score);
  }
  private killRandomEnemies(onEnemyKilled: OnEnemyKilledCallback) {
    let score = 0;

    this.apply((enemy) => {
      const position = {
        x: enemy.getPosition().x + this.position.x,
        y: enemy.getPosition().y + this.position.y,
      };

      if (enemy.boss || Math.random() > Wave.MOTHERSHIP_DAMAGE_RATIO) {
        return;
      }
      while (enemy?.isAlive) {
        enemy.hit();
      }
      onEnemyKilled(position);
      score += enemy?.score;
    });
    return score;
  }

  public analyseProjectiles(projectiles: Readonly<ProjectilePool>, onEnemyKilled: OnEnemyKilledCallback) {
    let score = 0;

    projectiles.apply((projectile) => {
      const position = {
        x: projectile.getHitPoint().x - this.position.x,
        y: projectile.getHitPoint().y - this.position.y,
      };

      if (
        this.mothership.isAlive &&
        this.mothership.collidesWith(projectile.getHitPoint())
      ) {
        score += this.killRandomEnemies(onEnemyKilled);
        this.mothership.kill();
        projectile.kill();
      }
      this.apply((enemy) => {
        if (!enemy.collidesWith(position)) {
          return;
        }
        score += this.hitEnemy(enemy, onEnemyKilled, projectile.getHitPoint());
        projectile.kill();
      });
    });
    return score;
  }
  public analyseLaser(x: number, onEnemyKilled: OnEnemyKilledCallback) {
    let score = 0;

    this.apply((enemy) => {
      const position = {
        x: enemy.getPosition().x + this.position.x,
        y: enemy.getPosition().y + this.position.y,
      };

      if (!enemy.collidesWithXAxis(x - this.position.x)) {
        return;
      }
      this.hitEnemy(enemy, onEnemyKilled, position)
    });
    return score;
  }
  public getShotPositions() {
    return this.filter((enemy) => enemy?.isAlive)
      .map((enemy) => {
        const pos = enemy?.shoot();

        if (!pos) return;
        return {
          x: pos.x + this.position.x,
          y: pos.y + this.position.y,
        };
      })
      .filter(Boolean) as Vector2[];
  }
  public update(delta: number) {
    const leftPadding = -this.getHorizontalPadding(1) * App.TILE_SIZE;
    const rightPadding = App.WIDTH + this.getHorizontalPadding(-1) * App.TILE_SIZE;

    if (this.position.y < 0) {
      this.position.y += (App.HEIGHT * 0.5) * (delta / Wave.TRANSITION_DURATION);
      this.position.x = (App.WIDTH - App.TILE_SIZE * this.size.x) / 2;
    }
    this.position.x += this.velocity.x * delta;
    this.position.y += this.velocity.y * delta;
    this.forEach((enemy) => enemy?.update(delta));
    this.mothership.update(delta);

    if (
      this.position.x >= leftPadding &&
      this.position.x + this.size.x * App.TILE_SIZE <= rightPadding
    ) {
      return;
    }
    this.position.x = Math.max(
      leftPadding,
      Math.min(rightPadding - this.size.x * App.TILE_SIZE, this.position.x)
    );
    this.position.y += App.TILE_SIZE;
    this.velocity.x *= -1 * Wave.SPEED_ACCELERATION;
  }
  public draw(ctx: CanvasRenderingContext2D) {
    ctx.translate(this.position.x, this.position.y);
    this.apply((enemy) => enemy.draw(ctx));
    ctx.translate(-this.position.x, -this.position.y);
    this.mothership.draw(ctx);
  }

  public get areAllEnemiesDead() {
    return this.filter((enemy) => enemy?.isAlive).length === 0;
  }
  public get hasReachedLimit() {
    const bottomY = this.position.y + this.getVerticalSize() * App.TILE_SIZE;

    return bottomY >= App.HEIGHT - App.TILE_SIZE * 3;
  }
}

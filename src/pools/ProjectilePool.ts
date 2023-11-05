import { Direction } from "../Direction";
import { Projectile } from "../Projectile";
import { Vector2 } from "../Vector2";
import { Pool } from "./Pool";

export class ProjectilePool extends Pool<Projectile> {
  private static readonly COOLDOWN = 0.5;
  private cooldown = 0;

  constructor(size: number, dir: Direction = -1) {
    super(...Array.from({ length: size }).map(() => new Projectile(dir)));
  }
  
  public reset() {
    this.forEach((item) => item.kill());
  }
  public trigger(position: Readonly<Vector2>) {
    if (this.cooldown > 0)
			return;
    this.cooldown = ProjectilePool.COOLDOWN;
		super.trigger(position);
  }
  public update(delta: number) {
    super.update(delta);
    this.cooldown -= this.cooldown <= 0 ? 0 : delta;
  }
}
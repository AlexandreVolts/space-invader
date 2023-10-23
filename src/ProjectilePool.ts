import { IDrawable } from "./IDrawable";
import { Projectile } from "./Projectile";
import { Vector2 } from "./Vector2";

export class ProjectilePool extends Array<Projectile> implements IDrawable {
  private static readonly NB_PROJECTILE = 5;
  private static readonly COOLDOWN = 0.4;
  private cooldown = 0;

  constructor() {
    super();
    for (let i = 0; i < ProjectilePool.NB_PROJECTILE; i++) {
			this.push(new Projectile());
		}
  }
  
  public apply(callback: (item: Projectile) => void) {
		this.filter((item) => item.isAlive).forEach(callback);
	}
  public shoot(position: Readonly<Vector2>) {
    const projectile = this.find((projectile) => !projectile.isAlive);
		
    if (!projectile || this.cooldown !== 0)
			return;
    this.cooldown = ProjectilePool.COOLDOWN;
		projectile.launch(position);
  }
  public update(delta: number) {
    this.cooldown = this.cooldown > 0 ? this.cooldown - delta : 0;
    this.apply((projectile) => projectile.update(delta));
  }
  public draw(ctx: CanvasRenderingContext2D) {
    this.apply((projectile) => projectile.draw(ctx));
  }
}
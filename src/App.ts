import { IPooledObject } from "./IPooledObject";
import { Keyboard } from "./Keyboard";
import { Player } from "./Player";
import { Projectile } from "./Projectile";
import { ProjectilePool } from "./ProjectilePool";

export class App
{
	private static readonly COEFF = 0.6;
	public static readonly TILE_SIZE = 50;
	public static readonly WIDTH = 720 * App.COEFF;
	public static readonly HEIGHT = 1280 * App.COEFF;
	private readonly canvas: HTMLCanvasElement;
	private readonly ctx: CanvasRenderingContext2D;
	private readonly keyboard = new Keyboard();
	private readonly player = new Player();
	private readonly projectiles: ProjectilePool = new ProjectilePool();
	private lastDeltaTime = 0;

	constructor()
	{
		this.canvas = document.getElementsByTagName("canvas")[0];
		this.canvas.width = App.WIDTH;
		this.canvas.height = App.HEIGHT;
		this.ctx = this.canvas.getContext("2d")!;
		this.ctx.imageSmoothingEnabled = false;
		this.render(0);
	}

	public update(delta: number) {
		if (this.keyboard.isPressed("ArrowUp") || this.keyboard.isPressed("Space")) {
			this.projectiles.shoot(this.player.getPosition());
		}
		this.projectiles.update(delta);
		this.projectiles.apply((projectile) => projectile.update(delta));

		this.player.move(
			this.keyboard.isPressed("ArrowLeft") ? -1 :
			this.keyboard.isPressed("ArrowRight") ? 1 : 0,
		);
		this.player.update(delta);
	}
	public render = (elapsedTime: number) => {
		this.ctx.clearRect(0, 0, App.WIDTH, App.HEIGHT);
		this.update((elapsedTime - this.lastDeltaTime) / 1000);
		this.projectiles.apply((projectile) => projectile.draw(this.ctx));
		this.player.draw(this.ctx);
		this.lastDeltaTime = elapsedTime;
		requestAnimationFrame(this.render);
	}
}

document.addEventListener("DOMContentLoaded", () => new App());
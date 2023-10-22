import { IDrawable } from "./IDrawable";
import { Keyboard } from "./Keyboard";
import { Player } from "./Player";
import { ProjectilePool } from "./ProjectilePool";
import { TiledBackground } from "./TiledBackground";
import { Wave } from "./Wave";

export class App
{
	private static readonly COEFF = 0.6;
	public static readonly TILE_SIZE = 40;
	public static readonly WIDTH = 720 * App.COEFF;
	public static readonly HEIGHT = 1280 * App.COEFF;
	private readonly canvas: HTMLCanvasElement;
	private readonly ctx: CanvasRenderingContext2D;
	private readonly keyboard = new Keyboard();

	private readonly background = new TiledBackground();
	private readonly player = new Player();
	private readonly projectiles: ProjectilePool = new ProjectilePool();
	private readonly wave = new Wave({ x: 8, y: 3 });

	private readonly gameElements: IDrawable[] = [];
	private lastDeltaTime = 0;

	constructor()
	{
		this.canvas = document.getElementsByTagName("canvas")[0];
		this.canvas.width = App.WIDTH;
		this.canvas.height = App.HEIGHT;
		this.ctx = this.canvas.getContext("2d")!;
		this.ctx.imageSmoothingEnabled = false;
		this.gameElements.push(this.background);
		this.gameElements.push(this.projectiles);
		this.gameElements.push(this.wave);
		this.gameElements.push(this.player);
		this.render(0);
	}

	public update(delta: number) {
		if (this.keyboard.isPressed("ArrowUp") || this.keyboard.isPressed("Space")) {
			this.projectiles.shoot(this.player.getPosition());
		}
		this.player.move(
			this.keyboard.isPressed("ArrowLeft") ? -1 :
			this.keyboard.isPressed("ArrowRight") ? 1 : 0,
		);
		this.wave.analyseProjectiles(this.projectiles);
		this.gameElements.forEach((elem) => elem.update(delta));
	}
	public render = (elapsedTime: number) => {
		this.ctx.clearRect(0, 0, App.WIDTH, App.HEIGHT);
		this.update((elapsedTime - this.lastDeltaTime) / 1000);
		this.gameElements.forEach((elem) => elem.draw(this.ctx));
		this.lastDeltaTime = elapsedTime;
		requestAnimationFrame(this.render);
	}
}

document.addEventListener("DOMContentLoaded", () => new App());
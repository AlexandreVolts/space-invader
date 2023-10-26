import { IDrawable } from "./IDrawable";
import { Keyboard } from "./Keyboard";
import { Player } from "./Player";
import { ProjectilePool } from "./pools/ProjectilePool";
import { TiledBackground } from "./TiledBackground";
import { Wave } from "./Wave";

export class App
{
	private static readonly GAME_SIZE_COEFF = 0.6;
	private static readonly SCORE_MULTIPLIER = 100;
	public static readonly TILE_SIZE = 40;
	public static readonly WIDTH = 720 * App.GAME_SIZE_COEFF;
	public static readonly HEIGHT = 1280 * App.GAME_SIZE_COEFF;
	private readonly canvas: HTMLCanvasElement;
	private readonly ctx: CanvasRenderingContext2D;
	private readonly keyboard = new Keyboard();

	private readonly background = new TiledBackground();
	private readonly player = new Player();
	private readonly playerProjectiles: ProjectilePool = new ProjectilePool(5);
	private readonly enemyProjectiles = new ProjectilePool(5, 1);
	private readonly wave = new Wave({ x: 8, y: 3 });

	private readonly gameElements: IDrawable[] = [];
	private lastDeltaTime = 0;
	private score = 0;
	private isFinished = false;

	constructor()
	{
		this.canvas = document.getElementsByTagName("canvas")[0];
		this.canvas.width = App.WIDTH;
		this.canvas.height = App.HEIGHT;
		this.ctx = this.canvas.getContext("2d")!;
		this.ctx.imageSmoothingEnabled = false;
		this.gameElements.push(this.background);
		this.gameElements.push(this.playerProjectiles);
		this.gameElements.push(this.enemyProjectiles);
		this.gameElements.push(this.wave);
		this.gameElements.push(this.player);
		this.render(0);
	}

	private reset() {
		this.isFinished = false;
		this.score = 0;
		this.wave.reset();
		this.playerProjectiles.reset();
		this.enemyProjectiles.reset();
	}

	public update(delta: number) {
		const score = this.wave.analyseProjectiles(this.playerProjectiles);

		if (this.isFinished && this.keyboard.isPressed('Enter')) {
			this.reset();
		}
		if (!this.isFinished) {
			if (this.keyboard.isPressed("ArrowUp") || this.keyboard.isPressed("Space")) {
				this.playerProjectiles.trigger(this.player.getPosition());
			}
		}
		this.score += score;
		this.wave.getShotPositions().forEach((position) => this.enemyProjectiles.trigger(position));
		this.enemyProjectiles.apply((projectile) => {
			if (this.player.collidesWith(projectile.getHitPoint())) {
				this.isFinished = true;
				projectile.kill();
			}
		});
		this.player.move(
			this.keyboard.isPressed("ArrowLeft") ? -1 :
			this.keyboard.isPressed("ArrowRight") ? 1 : 0,
		);
		if (this.wave.hasReachedLimit)
			this.isFinished = true;
		this.gameElements.forEach((elem) => elem.update(delta));
	}
	public render = (elapsedTime: number) => {
		this.ctx.clearRect(0, 0, App.WIDTH, App.HEIGHT);
		this.update((elapsedTime - this.lastDeltaTime) / 1000);
		this.gameElements.forEach((elem) => {
			if (this.isFinished && elem instanceof Player)
				return;
			elem.draw(this.ctx);
		});
		this.ctx.font = '20px Joystick';
		this.ctx.fillStyle = 'green';
		this.ctx.textAlign = 'right';
		this.ctx.textBaseline = 'top';
		this.ctx.fillText('Score: ', App.WIDTH - 100, 10);
		this.ctx.fillText(`${this.score * App.SCORE_MULTIPLIER}`, App.WIDTH - 10, 10);
		if (this.isFinished) {
			this.ctx.font = '40px Joystick';
			this.ctx.textAlign = 'center';
			this.ctx.fillText('Game over', App.WIDTH * 0.5, App.HEIGHT * 0.3);
			this.ctx.font = '15px Joystick';
			this.ctx.fillText('Press Enter to restart', App.WIDTH * 0.5, App.HEIGHT * 0.5);
		}
		this.lastDeltaTime = elapsedTime;
		requestAnimationFrame(this.render);
	}
}

document.addEventListener("DOMContentLoaded", () => new App());
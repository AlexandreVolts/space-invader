import { EnemyPatternGenerator } from "./enemies/EnemyPatternGenerator";
import { IDrawable } from "./IDrawable";
import { Keyboard } from "./Keyboard";
import { Player } from "./Player";
import { ProjectilePool } from "./pools/ProjectilePool";
import { Shield } from "./Shield";
import { TiledBackground } from "./TiledBackground";
import { Ui } from "./Ui";

export class App {
	private static readonly GAME_SIZE_COEFF = 0.6;
	private static readonly NB_SHIELDS = 4;
	public static readonly TILE_SIZE = 40;
	public static readonly WIDTH = 720 * App.GAME_SIZE_COEFF;
	public static readonly HEIGHT = 1280 * App.GAME_SIZE_COEFF;
	public static readonly SCORE_MULTIPLIER = 100;
	private readonly canvas: HTMLCanvasElement;
	private readonly ctx: CanvasRenderingContext2D;
	private readonly keyboard = new Keyboard();

	private readonly background = new TiledBackground();
	private readonly player = new Player();
	private readonly ui = new Ui();
	private readonly playerProjectiles: ProjectilePool = new ProjectilePool(5);
	private readonly enemyProjectiles = new ProjectilePool(5, 1);
	private readonly shields: Shield[] = [];
	private wave = EnemyPatternGenerator.generate(0);

	private readonly gameElements: IDrawable[] = [];
	private lastDeltaTime = 0;

	constructor() {
		this.canvas = document.getElementsByTagName("canvas")[0];
		this.canvas.width = App.WIDTH;
		this.canvas.height = App.HEIGHT;
		this.ctx = this.canvas.getContext("2d")!;
		this.ctx.imageSmoothingEnabled = false;
		Array.from({ length: App.NB_SHIELDS }).forEach((_, index) => {
			const width = App.WIDTH - App.TILE_SIZE;
			const x = App.TILE_SIZE * 0.75 + width * (index / App.NB_SHIELDS);

			this.shields.push(new Shield(x));
		});
		this.gameElements.push(this.background);
		this.gameElements.push(this.playerProjectiles);
		this.gameElements.push(this.enemyProjectiles);
		this.gameElements.push(...this.shields);
		this.gameElements.push(this.player);
		this.gameElements.push(this.ui);
		this.render(0);
	}

	private reset() {
		this.ui.reset();
		this.wave = EnemyPatternGenerator.generate(this.ui.currentWave);
		this.playerProjectiles.reset();
		this.enemyProjectiles.reset();
		this.shields.forEach((shield) => shield.reset());
	}

	public update(delta: number) {
		if (this.wave.areAllEnemiesDead) {
			this.ui.incrementWave();
			this.shields.forEach((shield) => shield.regenerate());
			this.wave = EnemyPatternGenerator.generate(this.ui.currentWave);
		}
		if (this.ui.state !== "running" && this.keyboard.isPressed('Enter')) {
			this.reset();
		}
		if (this.ui.state == "running") {
			if (this.keyboard.isPressed("ArrowUp") || this.keyboard.isPressed("Space")) {
				this.playerProjectiles.trigger(this.player.getPosition());
			}
		}
		this.ui.score += this.wave.analyseProjectiles(this.playerProjectiles);
		this.enemyProjectiles.apply((projectile) => {
			this.shields.filter((shield) => shield.isAlive).forEach((shield) => {
				if (shield.collidesWith(projectile.getHitPoint())) {
					shield.hit();
					projectile.kill();
				}
			});
			if (this.player.collidesWith(projectile.getHitPoint())) {
				projectile.kill();
				this.ui.end("lose");
			}
		});
		this.playerProjectiles.apply((projectile) => {
			this.shields.filter((shield) => shield.isAlive).forEach((shield) => {
				if (shield.collidesWith(projectile.getHitPoint())) {
					projectile.kill();
				}
			});
		});
		this.wave.getShotPositions().forEach((position) => this.enemyProjectiles.trigger(position));
		this.player.move(
			this.keyboard.isPressed("ArrowLeft") ? -1 :
				this.keyboard.isPressed("ArrowRight") ? 1 : 0,
		);
		if (this.wave.hasReachedLimit)
			this.ui.end("lose");
		this.gameElements.forEach((elem) => elem.update(delta));
		this.wave.update(delta);
	}
	public render = (elapsedTime: number) => {
		this.ctx.clearRect(0, 0, App.WIDTH, App.HEIGHT);
		this.update((elapsedTime - this.lastDeltaTime) / 1000);
		this.gameElements.forEach((elem) => {
			if (this.ui.state !== "running" && elem instanceof Player)
				return;
			elem.draw(this.ctx);
		});
		this.wave.draw(this.ctx);
		this.lastDeltaTime = elapsedTime;
		requestAnimationFrame(this.render);
	}
}

document.addEventListener("DOMContentLoaded", () => new App());
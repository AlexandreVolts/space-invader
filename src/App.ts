import { EnemyPatternGenerator } from "./enemies/EnemyPatternGenerator";
import { ProjectilePool } from "./pools/ProjectilePool";
import { Pool } from "./pools/Pool";
import { IDrawable } from "./IDrawable";
import { Keyboard } from "./Keyboard";
import { Laser } from "./Laser";
import { Lifebar } from "./Lifebar";
import { Player } from "./Player";
import { Shield } from "./Shield";
import { TiledBackground } from "./TiledBackground";
import { Ui } from "./Ui";
import { Explosion } from "./Explosion";
import { Vector2 } from "./Vector2";
import { Bonus } from "./Bonus";
import { SoundManager } from "./SoundManager";
import { ProgressBar } from "./ProgressBar";

export class App {
	private static readonly GAME_SIZE_COEFF = 0.6;
	private static readonly BONUS_COEF = 0.15;
	public static readonly TILE_SIZE = 35;
	public static readonly WIDTH = 720 * App.GAME_SIZE_COEFF;
	public static readonly HEIGHT = 1280 * App.GAME_SIZE_COEFF;
	public static readonly SCORE_MULTIPLIER = 100;
	public static readonly NB_SHIELDS = 4;
	private readonly canvas: HTMLCanvasElement;
	private readonly ctx: CanvasRenderingContext2D;
	private readonly keyboard = new Keyboard();

	private readonly background = new TiledBackground();
	private readonly ui = new Ui();
	private readonly lifebar = new Lifebar();
	private readonly firebar = new ProgressBar();

	private readonly playerProjectiles: ProjectilePool = new ProjectilePool(6);
	private readonly enemyProjectiles = new ProjectilePool(5, 1);
	private readonly bonuses = new Pool(
		...Array.from({ length: 8 }).map(
			(_, index) => new Bonus(index === 7 ? "H" : index % 2 === 0 ? "S" : "L")
		)
	);
	private readonly explosions = new Pool(
		...Array.from({ length: 16 }).map(() => new Explosion())
	);

	private readonly player = new Player();
	private readonly shields: Shield[] = [];
	private readonly laser = new Laser();
	private wave = EnemyPatternGenerator.generate(0)!;

	private readonly gameElements: IDrawable[] = [];
	private lastDeltaTime = 0;
	private lives = Lifebar.NB;

	constructor() {
		this.canvas = document.getElementsByTagName("canvas")[0];
		this.canvas.width = App.WIDTH;
		this.canvas.height = App.HEIGHT;
		this.ctx = this.canvas.getContext("2d")!;
		this.ctx.imageSmoothingEnabled = false;
		Array.from({ length: App.NB_SHIELDS }).forEach((_, index) => {
			this.shields.push(new Shield(index));
		});
		this.gameElements.push(this.background);
		this.gameElements.push(this.playerProjectiles);
		this.gameElements.push(this.enemyProjectiles);
		this.gameElements.push(this.bonuses);
		this.gameElements.push(this.explosions);
		this.gameElements.push(...this.shields);
		this.gameElements.push(this.player);
		this.gameElements.push(this.ui);
		this.render(0);
	}

	private reset() {
		const wave = EnemyPatternGenerator.generate(0)!;

		this.ui.reset();
		this.lives = Lifebar.NB;
		this.wave = wave;
		this.playerProjectiles.reset();
		this.enemyProjectiles.reset();
		this.shields.forEach((shield) => shield.reset());
		this.laser.reset();
		SoundManager.play("restart");
		SoundManager.play("theme", 1);
	}
	private onEnemyKilled = (position: Vector2) => {
		const pos = { x: position.x - App.TILE_SIZE * 0.2, y: position.y };

		this.explosions.trigger(position);
		if (Math.random() < App.BONUS_COEF)
			this.bonuses.trigger(pos);
		SoundManager.play("explosion");
	};
	private updateProjectiles() {
		this.enemyProjectiles.apply((projectile) => {
			this.shields
				.filter((shield) => shield.isAlive)
				.forEach((shield) => {
					if (shield.collidesWith(projectile.getHitPoint())) {
						SoundManager.play("shield-hit");
						shield.hit();
						projectile.kill();
					}
				});
			if (this.player.collidesWith(projectile.getHitPoint())) {
				this.lives--;
				projectile.kill();
				this.player.isFiring = false;
				this.player.blink();
				SoundManager.play("player-hit");
				if (this.lives === 0) {
					this.ui.end("lose");
				}
			}
		});
		this.playerProjectiles.apply((projectile) => {
			this.shields
				.filter((shield) => shield.isAlive)
				.forEach((shield) => {
					if (shield.collidesWith(projectile.getHitPoint())) {
						projectile.kill();
						this.player.isFiring = false;
					}
				});
		});
	}
	private updateBonuses() {
		this.bonuses.forEach((bonus) => {
			if (!this.player.collidesWith(bonus.position)) {
				return;
			}
			switch (bonus.type) {
				case "H":
					this.lives = Math.min(Lifebar.NB, this.lives + 1);
					SoundManager.play("health-bonus");
					break;
				case "L":
					this.laser.load();
					break;
				case "S":
					this.ui.score += 5;
					break;
			}
			this.explosions.trigger({ x: bonus.position.x, y: bonus.position.y + App.TILE_SIZE * 0.5 });
			bonus.kill();
			SoundManager.play("bonus");
			this.bonuses.unshift(this.bonuses[this.bonuses.length - 1]);
			this.bonuses.pop();
		});
	}

	public update(delta: number) {
		let score = this.wave.analyseProjectiles(
			this.playerProjectiles,
			this.onEnemyKilled
		);

		if (this.laser.isActive) {
			score += this.wave.analyseLaser(
				this.player.getPosition().x + App.TILE_SIZE / 2,
				this.onEnemyKilled
			);
		}
		if (this.ui.state !== "running" && this.keyboard.isPressed("Enter")) {
			this.reset();
		}
		if (this.ui.state === "running") {
			if (this.keyboard.isPressed("ArrowUp")) {
				this.player.isFiring = true;
			}
			if (this.keyboard.isPressed("ArrowDown")) {
				this.laser.trigger();
				this.player.isFiring = false;
			}
			if (this.player.isFiring) {
				this.playerProjectiles.trigger(this.player.getPosition());
			}
		}
		this.player.move(
			this.keyboard.isPressed("ArrowLeft")
				? -1
				: this.keyboard.isPressed("ArrowRight")
					? 1
					: 0
		);
		this.ui.score += score;
		if (this.ui.state === "running" && this.wave.areAllEnemiesDead) {
			this.ui.incrementWave();
			this.shields.forEach((shield) => shield.regenerate());

			const wave = EnemyPatternGenerator.generate(this.ui.currentWave);
			if (!wave) {
				this.ui.end("win");
			}
			else {
				this.wave = wave;
				SoundManager.play("wave");
			}
		}
		this.updateProjectiles();
		this.updateBonuses();
		this.wave
			.getShotPositions()
			.forEach((position) => this.enemyProjectiles.trigger(position));
		if (this.ui.state === "running" && this.wave.hasReachedLimit) {
			this.lives = 0;
			this.ui.end("lose");
		}
		if (this.ui.state !== "menu") {
			this.wave.update(delta);
		}
		this.laser.update(delta);
		this.gameElements.forEach((elem) => elem.update(delta));
	}
	public render = (elapsedTime: number) => {
		this.ctx.clearRect(0, 0, App.WIDTH, App.HEIGHT);
		this.update((elapsedTime - this.lastDeltaTime) / 1000);
		if (this.player.isBlinking) {
			this.ctx.save();
			this.ctx.translate(Math.random() * 4, Math.random() * 4);
		}
		this.gameElements.forEach((elem) => {
			if (this.ui.state !== "running" && elem instanceof Player) return;
			elem.draw(this.ctx);
		});
		if (this.ui.state !== "menu") {
			this.wave.draw(this.ctx);
		}
		this.laser.draw(this.ctx, this.player.getPosition());
		this.lifebar.draw(this.ctx, this.lives);
		if (this.ui.state === "running") {
			this.firebar.draw(
				this.ctx,
				this.playerProjectiles.filter((p) => !p.isAlive).length / 5, {
					x: this.player.getPosition().x - App.TILE_SIZE / 2.6,
					y: this.player.getPosition().y + App.TILE_SIZE,
				}
			);
		}
		this.ctx.restore();
		this.lastDeltaTime = elapsedTime;
		requestAnimationFrame(this.render);
	};
}

document.addEventListener("DOMContentLoaded", () => new App());

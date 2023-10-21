export interface IDrawable {
  update(delta: number): void;
  draw(ctx: CanvasRenderingContext2D): void;
}
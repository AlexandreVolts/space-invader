import { Crab } from "./Crab";
import { Crane } from "./Crane";
import { Squid } from "./Squid";
import { Wave } from "../Wave";
import { App } from "../App";
import json from "./../json/waves.json";

export abstract class EnemyPatternGenerator {
  private static readonly enemies = [Crab, Crane, Squid];

  public static generate(id: number): Wave | undefined {
    const pattern = json.data[id]?.data;
    const output = new Wave({ x: pattern?.[0]?.length, y: pattern?.length });

    if (!pattern)
      return (undefined);
    for (let i = 0, w = pattern.length; i < w; i++) {
      for (let j = 0, h = pattern[0].length; j < h; j++) {
        const item = pattern[i][j];

        if (!item) {
          output.push(null);
          continue;
        }
        output.push(
          new EnemyPatternGenerator.enemies[Math.abs(item) - 1]({
            x: j * App.TILE_SIZE,
            y: i * App.TILE_SIZE + App.TILE_SIZE * 2,
          }, item < 0)
        );
      }
    }
    return output;
  }
}

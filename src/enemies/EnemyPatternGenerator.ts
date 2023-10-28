import { Crab } from "./Crab";
import { Crane } from "./Crane";
import { Wave } from "../Wave";
import json from "./../json/wave.json";
import { App } from "../App";

export abstract class EnemyPatternGenerator {
  private static readonly enemies = [Crab, Crane];

  public static generate(id: number): Wave {
    const pattern = json.data[id].data;
    const output = new Wave({ x: pattern[0].length, y: pattern.length });

    for (let i = 0, w = pattern.length; i < w; i++) {
      for (let j = 0, h = pattern[i].length; j < h; j++) {
        const item = pattern[i][j];

        if (item === null) {
          output.push(null);
          continue;
        }
        output.push(
          new EnemyPatternGenerator.enemies[item]({
            x: j * App.TILE_SIZE,
            y: i * App.TILE_SIZE + App.TILE_SIZE,
          })
        );
      }
    }
    return output;
  }
}

import { TilesInterface } from '../interfaces/TilesInterface';

export function getRandomMapID(ids: TilesInterface[]): TilesInterface {
  const num = Math.random();
  let s = 0;
  const lastIndex = ids.length - 1;

  for (let i = 0; i < lastIndex; i++) {
    s += ids[i].probability;
    if (num < s) {
      return ids[i];
    }
  }

  return ids[lastIndex];
}

import ImageLoader from './ImageLoader';
import { TilesInterface } from './interfaces/TilesInterface';
import Hero from './Hero';
import Enemy from './Enemy';
import Shots from './Shots';
import { TerrainInterface } from './interfaces/TerrainInterface';

const textures = [
  {
    id: 0, src: './src/images/dirt.png', collision: false, muddyTerrain: true, probability: 0.1,
  },
  {
    id: 1, src: './src/images/grass.png', collision: false, muddyTerrain: false, probability: 0.7,
  },
  {
    id: 2, src: './src/images/sand.png', collision: false, muddyTerrain: true, probability: 0.1,
  },
  {
    id: 3, src: './src/images/treeSmall.png', collision: true, muddyTerrain: false, probability: 0.1,
  },
];

class GameMap {
  private readonly _map: TilesInterface[][];

  private readonly _height: number;

  private readonly _width: number;

  private readonly _tileSize: number;

  private readonly _tiles: TilesInterface[];

  private _loader: ImageLoader;

  constructor() {
    this._height = 8;
    this._width = 12;
    this._tileSize = 128;
    this._tiles = [];
    this._map = [];

    this._loader = new ImageLoader();
  }

  get mapWidth() {
    return this._width * this._tileSize;
  }

  get mapHeight() {
    return this._height * this._tileSize;
  }

  static getRandomTexture(tiles: TilesInterface[]): TilesInterface {
    const num = Math.random();
    let s = 0;
    const lastIndex = tiles.length - 1;

    for (let i = 0; i < lastIndex; i++) {
      s += tiles[i].probability;
      if (num < s) {
        return tiles[i];
      }
    }

    return tiles[lastIndex];
  }

  async loadMap(): Promise<void> {
    // On charge chaque texture de notre tableau de textures
    for (let i = 0; i < textures.length; i++) {
      const texture = textures[i];
      const image = await this._loader.load(texture.src, texture.src);
      const data = { ...texture, image: image.image, id: texture.id };
      this._tiles.push(data);
    }
  }

  generateRandomMap(): TilesInterface[][] {
    for (let i = 0; i < this._height; i++) {
      this._map[i] = [];
      for (let j = 0; j < this._width; j++) {
        const randomTexture = GameMap.getRandomTexture(this._tiles);
        this._map[i].push(randomTexture);
      }
    }
    return this._map;
  }

  drawMap(ctx: CanvasRenderingContext2D): void {
    for (let i = 0; i < this._height; i++) {
      for (let j = 0; j < this._width; j++) {
        const mapId = this._map[i][j].id;
        const tile = this._tiles[mapId];

        const x = j * tile.image.width;
        const y = i * tile.image.height;
        const w = tile.image.width;
        const h = tile.image.height;

        // On s'assure que toutes nos tuiles font la même taille
        if (tile.image.width && tile.image.height !== this._tileSize) {
          tile.image.width = this._tileSize;
          tile.image.height = this._tileSize;
        }

        /* Si la tuile est un arbre par exemple, on redessine une case derrière pour qu'il
         * n'y ait pas de vide */
        if (tile.collision) {
          ctx.drawImage(this._tiles[1].image, x, y, w, h);
        }

        ctx.drawImage(tile.image, x, y, w, h);
      }
    }
  }

  checkMapCollision(entity: Hero | Enemy | Shots): TerrainInterface {
    for (let i = 0; i < this._map.length; i++) {
      for (let j = 0; j < this._map[i].length; j++) {
        const tile = this._map[i][j];

        const posX = j * this._tileSize;
        const posY = i * this._tileSize;

        if (tile.collision || tile.muddyTerrain) {
          const compensation = 20;
          const checkCollision = entity.x < posX + this._tileSize - compensation
              && entity.x + entity.w > posX + compensation
              && entity.y < posY + this._tileSize - compensation
              && entity.h + entity.y > posY + compensation;

          if (checkCollision) return { collide: tile.collision, muddy: tile.muddyTerrain };
        }
      }
    }
    return { collide: false, muddy: false };
  }

  checkIfEntityOutsideMap(posX: number, posY: number): boolean {
    if (posX > this._width * this._tileSize) return true;
    if (posX < 0) return true;

    if (posY > this._height * this._tileSize) return true;
    if (posY < 0) return true;

    return false;
  }
}

export default GameMap;

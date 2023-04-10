import { TilesInterface } from './interfaces/TilesInterface';
import { tiles } from './tiles';
import { getRandomMapID } from './utils/getRandomMapID';
import { Camera } from './Camera';

class GameMap {
  public get camera(): Camera {
    return this._camera;
  }

  private readonly _grid: TilesInterface[][];
  public get grid(): TilesInterface[][] {
    return this._grid;
  }

  private readonly _height: number;
  public get height(): number {
    return this._height;
  }

  private readonly _width: number;
  public get width(): number {
    return this._width;
  }

  private readonly _tileSize: number;
  public get tileSize(): number {
    return this._tileSize;
  }

  private readonly _tiles: TilesInterface[];

  constructor(
    width: number,
    height: number,
    private _image: HTMLImageElement,
    private _camera: Camera
  ) {
    this._width = width;
    this._height = height;

    this._tileSize = 128;
    this._tiles = [];
    this._grid = [];
  }

  get mapWidth() {
    return this._width * this._tileSize;
  }

  get mapHeight() {
    return this._height * this._tileSize;
  }

  generateRandomMap(): TilesInterface[][] {
    for (let i = 0; i < this._height; i++) {
      this._grid[i] = [];
      for (let j = 0; j < this._width; j++) {
        const randomTile = getRandomMapID(tiles);
        const tile = { ...randomTile };
        this._grid[i].push(tile);
      }
    }

    const midArray = Math.floor(this._grid.length / 2);

    this._grid[midArray][midArray].collide = false;

    return this._grid;
  }

  getTile(col: number, row: number) {
    return this._grid[col][row];
  }

  dynamicMapLoading() {
    const visibleTilesX = Math.ceil(1920 / this._tileSize + 1);
    const visibleTilesY = Math.ceil(1080 / this._tileSize);

    const startX = Math.max(0, Math.floor(this._camera.x / this._tileSize));
    const startY = Math.max(0, Math.floor(this._camera.y / this._tileSize));

    const endX = Math.min(this._width, startX + visibleTilesX);
    const endY = Math.min(this._height, startY + visibleTilesY);

    return { startX, startY, endX, endY };
  }

  drawTile(ctx: CanvasRenderingContext2D, texture: any, x: number, y: number) {
    if (texture) {
      ctx.drawImage(
        this._image,
        texture.x,
        texture.y,
        texture.w,
        texture.h,
        Math.round(x),
        Math.round(y),
        texture.w,
        texture.h
      );
    }
  }

  drawMap(ctx: CanvasRenderingContext2D): void {
    const { startX, startY, endX, endY } = this.dynamicMapLoading();
    for (let i = startY; i < endY; i++) {
      for (let j = startX; j < endX; j++) {
        const tile = this._grid[i][j];

        const x = j * this._tileSize - this._camera.x;
        const y = i * this._tileSize - this._camera.y;

        switch (tile.id) {
          case 3:
            this.drawTile(ctx, { x: 0, y: 128, w: 128, h: 128 }, x, y);
            break;
          case 4:
            this.drawTile(ctx, { x: 0, y: 128, w: 128, h: 128 }, x, y);
            break;
          default:
            break;
        }

        ctx.drawImage(
          this._image,
          tile.x,
          tile.y,
          tile.w,
          tile.h,
          Math.round(x),
          Math.round(y),
          tile.w,
          tile.h
        );
      }
    }
  }
}

export default GameMap;

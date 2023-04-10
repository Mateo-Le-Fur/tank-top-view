import { Camera } from './Camera';
import Sprite from './Sprite';
import { SpriteInterface } from './interfaces/SpriteInterface';

export default class Smoke extends Sprite {
  public get nbFrame(): number {
    return this._nbFrame;
  }

  private _sw: number;
  private _sh: number;
  private _frame: number;
  private _frameCount: number;
  private _smokes: Partial<SpriteInterface>[];

  public get frame(): number {
    return this._frame;
  }

  constructor(
    public image: HTMLImageElement,
    private _camera: Camera,
    private _nbFrame: number
  ) {
    super(image);
    this._sw = image.width / 8;
    this._sh = image.height / 1;
    this._frame = 0;
    this._frameCount = 0;

    this._smokes = [
      {
        id: 0,
        x: 324,
        y: 107,
        w: 92,
        h: 89,
      },
      {
        id: 1,
        x: 396,
        y: 285,
        w: 90,
        h: 99,
      },
      {
        id: 2,
        x: 590,
        y: 182,
        w: 79,
        h: 79,
      },
      {
        id: 3,
        x: 128,
        y: 0,
        w: 100,
        h: 97,
      },
      {
        id: 4,
        x: 226,
        y: 194,
        w: 98,
        h: 107,
      },
      {
        id: 5,
        x: 418,
        y: 0,
        w: 87,
        h: 87,
      },
    ];
  }

  update(): void {}

  draw(ctx: CanvasRenderingContext2D): void {
    const x = this._x - this._camera.x;
    const y = this._y - this._camera.y;

    const sX = this._smokes[this._frame].x ?? 0;
    const sY = this._smokes[this._frame].y ?? 0;
    const sw = this._smokes[this._frame].w ?? 0;
    const sh = this._smokes[this._frame].h ?? 0;

    ctx.save();

    ctx.translate(x + sw / 2, y);
    ctx.rotate(this._angle - Math.PI / 2);
    ctx.translate(-x - sw / 2, -y);

    this._frameCount++;
    if (this._frameCount % 2 === 0) {
      this._frame++;
    }

    ctx.drawImage(
      this.image,
      sX,
      sY,
      sw,
      sh,
      Math.round(x + this._frame),
      Math.round(y + this._frame * 20),
      sw,
      sh
    );

    ctx.restore();
  }
}

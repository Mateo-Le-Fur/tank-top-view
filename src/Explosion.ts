import { Camera } from './Camera';
import Sprite from './Sprite';

export default class Explosion extends Sprite {
  public get nbFrame(): number {
    return this._nbFrame;
  }
  public set nbFrame(value: number) {
    this._nbFrame = value;
  }
  private _sw: number;
  private _sh: number;
  private _frame: number;
  private _frameCount: number;

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
  }

  update(): void {}

  draw(ctx: CanvasRenderingContext2D): void {
    const x = this._x - this._camera.x;
    const y = this._y - this._camera.y;

    const sX = this._sw * this._frame;
    const sY = 0;

    ctx.drawImage(this.image, sX, sY, this._sw, this._sh, x, y, this._sw, this._sh);

    this._frameCount++;
    if (this._frameCount % 5 === 0) {
      this._frame++;
    }
  }
}

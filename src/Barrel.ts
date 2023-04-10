import { Camera } from './Camera';
import Sprite from './Sprite';
import { SpriteInterface } from './interfaces/SpriteInterface';

export class Barrel extends Sprite {
  private _owner: SpriteInterface | undefined;
  private _pivotY: number;

  constructor(public image: HTMLImageElement, private _camera: Camera) {
    super(image);
    this._pivotY = this._h;
  }

  attach(sprite: SpriteInterface) {
    this._owner = sprite;

    this._x = sprite.x + sprite.w / 2 - this._w / 2;
    this._y = sprite.y + sprite.h / 2;
  }

  update(): void {
    if (this._owner) {
      this.attach(this._owner);
    }
  }

  rotate(x: number, y: number) {
    if (this._owner) {
      this._x += Math.cos(this._angle);
      this._y += Math.sin(this._angle);

      const dx = x - this._x;
      const dy = y - this._y;

      this._angle = Math.atan2(dy, dx);
    }
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.save();

    const x = this._x - this._camera.x;
    const y = this._y - this._camera.y;

    ctx.translate(x + this._w / 2, y + this._pivotY);
    ctx.rotate(this._angle - Math.PI / 2);
    ctx.translate(-x - this._w / 2, -y - this._pivotY);

    ctx.drawImage(
      this.image,
      this._sx,
      this._sy,
      this._w,
      this._h,
      x,
      y,
      this._w,
      this._h
    );

    ctx.restore();
  }
}

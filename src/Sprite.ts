abstract class Sprite {
  protected _x: number;

  protected _y: number;

  protected _w: number;

  protected _h: number;

  protected _angle: number;

  protected _isHitted: boolean;

  protected _image: HTMLImageElement;

  get x(): number {
    return this._x;
  }

  get y(): number {
    return this._y;
  }

  get angle(): number {
    return this._angle;
  }

  get h() {
    return this._h;
  }

  get w() {
    return this._w;
  }

  get isHitted() {
    return this._isHitted;
  }

  set isHitted(value: boolean) {
    this._isHitted = value;
  }

  protected constructor(x: number, y: number, image: HTMLImageElement) {
    this._image = image;
    this._x = x;
    this._y = y;
    this._w = 0;
    this._h = 0;
    this._angle = 0;
    this._isHitted = false;
    this._w = this._image.width;
    this._h = this._image.height;
  }
}

export default Sprite;

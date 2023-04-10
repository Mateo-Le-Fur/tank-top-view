abstract class Sprite {
  protected _id: number;

  protected _x: number;

  protected _y: number;

  protected _w: number;

  protected _h: number;

  protected _angle: number;

  protected _image: HTMLImageElement;

  protected _speed: number;

  protected _isHitted: boolean;

  protected _life: number;

  protected _damage: number;

  protected _lastPosX: number;

  protected _lastSpeed: number;

  protected _sx: number;

  protected _sy: number;

  public get lastSpeed(): number {
    return this._lastSpeed;
  }
  public set lastSpeed(value: number) {
    this._lastSpeed = value;
  }
  public get lastPosX(): number {
    return this._lastPosX;
  }
  public set lastPosX(value: number) {
    this._lastPosX = value;
  }
  private _lastPosY: number;
  public get lastPosY(): number {
    return this._lastPosY;
  }
  public set lastPosY(value: number) {
    this._lastPosY = value;
  }

  get id(): number {
    return this._id;
  }

  get x(): number {
    return this._x;
  }

  get y(): number {
    return this._y;
  }

  get w() {
    return this._w;
  }

  get h() {
    return this._h;
  }

  get angle(): number {
    return this._angle;
  }

  get speed() {
    return this._speed;
  }

  public set speed(value: number) {
    this._speed = value;
  }

  get isHitted() {
    return this._isHitted;
  }

  get life() {
    return this._life;
  }

  get damage() {
    return this._damage;
  }

  set x(value: number) {
    this._x = value;
  }

  set y(value: number) {
    this._y = value;
  }

  set isHitted(value: boolean) {
    this._isHitted = value;
  }

  set life(value: number) {
    this._life = value;
  }

  protected constructor(image: HTMLImageElement) {
    this._id = 10;
    this._x = 0;
    this._y = 0;
    this._sx = 0;
    this._sy = 0;
    this._lastPosX = this._x;
    this._lastPosY = this._y;
    this._w = 0;
    this._h = 0;
    this._angle = 0;
    this._image = image;
    this._speed = 1;
    this._lastSpeed = this._speed;
    this._isHitted = false;
    this._life = 100;
    this._damage = 10;
  }

  abstract update(): void;

  abstract draw(ctx: CanvasRenderingContext2D): void;

  posX(value: number) {
    this._x = value;
    return this;
  }
  posY(value: number) {
    this._y = value;
    return this;
  }

  setSx(value: number) {
    this._sx = value;
    return this;
  }
  setSy(value: number) {
    this._sy = value;
    return this;
  }

  width(value: number) {
    this._w = value;
    return this;
  }
  height(value: number) {
    this._h = value;
    return this;
  }
  setAngle(value: number) {
    this._angle = value;
    return this;
  }
  setImage(value: HTMLImageElement) {
    this._image = value;
    return this;
  }
  setSpeed(value: number) {
    this._speed = value;
    return this;
  }
  setDamage(value: number) {
    this._damage = value;
    return this;
  }
  setLife(value: number) {
    this._life = value;
    return this;
  }
}

export default Sprite;

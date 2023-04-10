import Sprite from './Sprite';
import { Camera } from './Camera';

class Shot extends Sprite {
  private _type: string;
  private _maxRange: number;
  public get maxRange(): number {
    return this._maxRange;
  }

  get type() {
    return this._type;
  }

  get damage() {
    return this._damage;
  }

  constructor(
    public image: HTMLImageElement,
    private _camera: Camera,
    private _firedX: number,
    private _firedY: number
  ) {
    super(image);
    this._type = 'hero';
    this._maxRange = 1000;
  }

  setType(value: string): this {
    this._type = value;
    return this;
  }

  rangeLimitReached(): boolean {
    return (
      Math.sqrt(
        (this.x - this._firedX) * (this.x - this._firedX) +
          (this._y - this._firedY) * (this._y - this._firedY)
      ) > this._maxRange
    );
  }

  move() {
    const forceX = Math.cos(this._angle) * this._speed;
    const forceY = Math.sin(this._angle) * this._speed;

    this._x += forceX;
    this._y += forceY;
  }

  update() {
    this.move();
  }

  draw(ctx: CanvasRenderingContext2D) {
    const x = this._x - this._camera.x;
    const y = this._y - this._camera.y;

    const angle = this._type === 'hero' ? this._angle + Math.PI / 2 : this._angle;

    ctx.save();
    ctx.translate(x + this._w / 2, y + this._h / 2);
    ctx.rotate(angle);
    ctx.translate(-x - this._w / 2, -y - this._h / 2);
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

  calculateAngle(entityType: string): number {
    switch (entityType) {
      case 'hero':
        return this._angle;
      case 'enemy':
        // L'angle de l'ennemi est déjà en radian puisqu'il est calculé avec Math.atan2
        return this._angle;
      default:
        return this._angle;
    }
  }
}

export default Shot;

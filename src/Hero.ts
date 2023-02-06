import Sprite from './Sprite';
import GameMap from './Map';
import Shots from './Shots';

class Hero extends Sprite {
  private _up: boolean;

  private _right: boolean;

  private _left: boolean;

  private _speed: number;

  private _angleSpeed: number;

  private _lastPosX: number;

  private _lastPosY: number;

  private _life: number;

  private _spawnProtect: boolean;

  get life() {
    return this._life;
  }

  set life(value) {
    this._life = value;
  }

  constructor(x: number, y: number, src: HTMLImageElement) {
    super(x, y, src);

    this._speed = 1;
    this._angleSpeed = 1;
    this._life = 100;

    this._up = false;
    this._right = false;
    this._left = false;
    this._lastPosX = 0;
    this._lastPosY = 0;
    this._spawnProtect = false;

    window.addEventListener('keydown', this.keysPressed.bind(this), false);
    window.addEventListener('keyup', this.keysReleased.bind(this), false);
  }

  keysPressed(e: KeyboardEvent) {
    switch (e.key) {
      case 'z':
        this._up = true;
        break;
      case 'd':
        this._right = true;
        break;
      case 'q':
        this._left = true;
        break;
      default:
    }
  }

  keysReleased(e: KeyboardEvent) {
    switch (e.key) {
      case 'z':
        this._up = false;
        break;
      case 'd':
        this._right = false;
        break;
      case 'q':
        this._left = false;
        break;
      default:
    }
  }

  checkSpawnCollision(map: GameMap) {
    const check = map.checkMapCollision(this);

    if (check.collide) {
      this._spawnProtect = true;
      setTimeout(() => {
        this._spawnProtect = false;
      }, 2000);
    }
  }

  decreaseLifePoint(shoot: Shots) {
    if (!shoot.isHitted) {
      this._life -= shoot.damage;
      shoot.isHitted = true;
    }
  }

  move(map: GameMap) {
    if (this._up) {
      const mapCollision = map.checkMapCollision(this);
      const isOutsideMap = map.checkIfEntityOutsideMap(this._x, this._y);

      mapCollision.muddy ? this._speed = 0.5 : this._speed = 1;

      if ((isOutsideMap || mapCollision.collide) && !this._spawnProtect) {
        this._x = this._lastPosX;
        this._y = this._lastPosY;
      } else {
        this._lastPosX = this._x;
        this._lastPosY = this._y;
      }

      const angle = this._angle * (Math.PI / 180);
      const forceX = Math.cos(angle) * this._speed;
      const forceY = Math.sin(angle) * this._speed;

      this._x += forceX;
      this._y += forceY;
    }

    if (this._right) {
      this._angle += this._angleSpeed;
    }
    if (this._left) {
      this._angle -= this._angleSpeed;
    }

    if (this._angle > 360 || this._angle < -360) this._angle = 0;
  }

  draw(ctx: CanvasRenderingContext2D) {
    let ratio = this._life / 100;

    if (ratio <= 0) ratio = 0;

    ctx.save();
    ctx.strokeRect(this._x, this._y - 15, this._w, this._h / 3);
    ctx.fillStyle = '#32CD32';
    ctx.fillRect(this._x, this._y - 15, this._w * ratio, this._h / 3);
    ctx.translate(this._x + this._w / 2, this._y + this._h / 2);
    ctx.rotate(this._angle * (Math.PI / 180));
    ctx.translate(-this._x - this._w / 2, -this._y - this._h / 2);
    ctx.drawImage(this._image, this._x, this._y, this._w, this._h);
    ctx.restore();
  }
}

export default Hero;

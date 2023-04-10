import { SpriteInterface } from './interfaces/SpriteInterface';

export class Camera {
  private _x: number;

  private _sprite: SpriteInterface | null;

  private _up: boolean;

  private _right: boolean;

  private _left: boolean;

  private _down: boolean;

  public get sprite(): SpriteInterface | null {
    return this._sprite;
  }

  public get x(): number {
    return this._x;
  }
  public set x(v: number) {
    this._x = v;
  }

  private _y: number;
  public get y(): number {
    return this._y;
  }
  public set y(v: number) {
    this._x = v;
  }

  private _centerX: number;

  private _centerY: number;

  constructor(private _canvasWidth: number, private _canvasHeight: number) {
    this._x = 0;
    this._y = 0;
    this._centerX = this._canvasWidth / 2;
    this._centerY = this._canvasHeight / 2;
    this._up = false;
    this._right = false;
    this._left = false;
    this._down = false;

    this._sprite = null;

    window.addEventListener('keydown', this.keysPressed.bind(this), false);
    window.addEventListener('keyup', this.keysReleased.bind(this), false);
  }

  bind(sprite: SpriteInterface) {
    this._sprite = sprite;

    this._x = this._sprite.x - this._centerX;
    this._y = this._sprite.y - this._centerY;
  }

  update(): void {
    if (this._up) {
      this._y -= 10;
    } else if (this._right) {
      this._x += 10;
    } else if (this._down) {
      this._y += 10;
    } else if (this._left) {
      this._x -= 10;
    } else {
      this._x = this._sprite!.x - this._centerX;
      this._y = this._sprite!.y - this._centerY;
    }
  }

  keysPressed(e: KeyboardEvent) {
    switch (e.key) {
      case 'ArrowUp':
        this._up = true;
        break;
      case 'ArrowRight':
        this._right = true;
        break;
      case 'ArrowDown':
        this._down = true;
        break;
      case 'ArrowLeft':
        this._left = true;
        break;
      default:
    }
  }

  keysReleased(e: KeyboardEvent) {
    switch (e.key) {
      case 'ArrowUp':
        this._up = false;
        break;
      case 'ArrowRight':
        this._right = false;
        break;
      case 'ArrowDown':
        this._down = false;
        break;
      case 'ArrowLeft':
        this._left = false;
        break;
      default:
    }
  }
}

import Sprite from './Sprite';
import GameMap from './Map';
import Shot from './Shot';
import ImageLoader from './ImageLoader';
import { Barrel } from './Barrel';
import Smoke from './Smoke';
import InputHandler from './InputHandler';

class Hero extends Sprite {
  private _angleSpeed: number;

  private _detectionRadius: number;

  private _mouseX: number;

  private _mouseY: number;

  private _canvasRect: DOMRect | undefined;

  get detectionRadius() {
    return this._detectionRadius;
  }

  constructor(
    public image: HTMLImageElement,
    private _inputHandler: InputHandler,
    private _barrel: Barrel,
    private _map: GameMap
  ) {
    super(image);
    this._angleSpeed = 2;
    this._mouseX = 0;
    this._mouseY = 0;
    this._canvasRect = undefined;

    this._detectionRadius = 500;

    const canvas = document.querySelector('canvas')!;
    canvas.addEventListener('mousemove', (e) => {
      this._canvasRect = canvas.getBoundingClientRect();
      this._mouseX = e.clientX - this._canvasRect.left + this._map.camera.x;
      this._mouseY = e.clientY - this._canvasRect.top + this._map.camera.y;
    });
  }

  move() {
    const angle = this._angle * (Math.PI / 180);
    const forceX = Math.sin(angle) * this._speed;
    const forceY = Math.cos(angle) * this._speed;

    this._x += forceX;
    this._y -= forceY;

    if (this._inputHandler.up) {
      this._speed += 0.04;
      this._speed > 4 ? (this._speed = 4) : (this._speed += 0.04);
    }

    if (this._inputHandler.left) {
      this._angle += this._angleSpeed;
    }

    if (this._inputHandler.right) {
      this._angle -= this._angleSpeed;
    }

    if (!this._inputHandler.up) {
      this._speed <= 0 ? (this._speed = 0) : (this._speed -= 0.03);
    }

    if (this._angle > 360 || this._angle < -360) this._angle = 0;
  }

  shot(shots: Shot[], smokes: Smoke[]) {
    const shell = ImageLoader.getInstance().getTexture('bulletGreenSilver_outline.png');

    if (!shell) return;

    const posX = this._x + this._w / 2 - shell.w / 2;
    const posY = this._y + this._h / 2 - shell.h / 2;

    const shoot = new Shot(this._image, this._map.camera, posX, posY)
      .setType('hero')
      .posX(posX)
      .posY(posY)
      .setSx(shell.x)
      .setSy(shell.y)
      .width(shell.w)
      .height(shell.h)
      .setAngle(this._barrel.angle)
      .setSpeed(35)
      .setDamage(50);

    shots.push(shoot);

    const smoke = new Smoke(this.image, this._map.camera, 6)
      .posX(this._barrel.x - this._barrel.w)
      .posY(this._barrel.y)
      .setAngle(this._barrel.angle);

    smokes.push(smoke);
  }

  update() {
    this.move();
    this._barrel.attach(this);
    this._barrel.rotate(this._mouseX, this._mouseY);
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    let lifeBarRatio = this._life / 100;

    const x = this._x - this._map.camera.x;
    const y = this._y - this._map.camera.y;

    if (lifeBarRatio <= 0) lifeBarRatio = 0;

    // ctx.strokeRect(x, y - 35, this._w, this._h / 3);
    // ctx.fillStyle = '#32CD32';
    // ctx.fillRect(x, y - 35, this._w * lifeBarRatio, this._h / 3);

    ctx.translate(x + this._w / 2, y + this._h / 2);
    ctx.rotate(this._angle * (Math.PI / 180));
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

    this._barrel.draw(ctx);
  }
}

export default Hero;

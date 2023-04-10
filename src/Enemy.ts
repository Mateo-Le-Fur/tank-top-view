import Sprite from './Sprite';
import Shot from './Shot';
import { getRandomInt } from './utils/getRandomInt';
import ImageLoader from './ImageLoader';
import Hero from './Hero';
import GameMap from './Map';
import { Camera } from './Camera';

class Enemy extends Sprite {
  private _isMoving: boolean;
  public get isMoving(): boolean {
    return this._isMoving;
  }
  public set isMoving(value: boolean) {
    this._isMoving = value;
  }
  private _cooldownFire: boolean;

  constructor(
    public image: HTMLImageElement,
    private _hero: Hero,
    private _shots: Shot[],
    private _camera: Camera
  ) {
    super(image);
    this._isMoving = false;
    this._cooldownFire = false;
    this._life = 100;
  }

  enterInHeroArea(hero: Hero): boolean {
    const heroX = hero.x;
    const heroY = hero.y;
    return (
      Math.sqrt(
        (this.x - heroX) * (this.x - heroX) + (this._y - heroY) * (this._y - heroY)
      ) < hero.detectionRadius
    );
  }

  shoot(): void {
    if (!this._cooldownFire) {
      const shell = ImageLoader.getInstance().getSprite('shell')!.image;

      const posX = this.x + (this._w - shell.width) / 2;
      const posY = this._y + (this._h - shell.height) / 2;

      const shot = new Shot(shell, this._camera, this._x, this._y)
        .setType('enemy')
        .posX(posX)
        .posY(posY)
        .width(shell.width)
        .height(shell.height)
        .setAngle(this.angle)
        .setSpeed(8)
        .setDamage(0)
        .setLife(0);

      this._shots.push(shot);

      this._cooldownFire = true;
      this._isMoving = false;

      setTimeout(() => (this._cooldownFire = false), getRandomInt(2500, 5000));
    }
  }

  move() {
    if (this.enterInHeroArea(this._hero)) {
      this._isMoving = true;

      this._angle = Math.atan2(
        this._hero.y + this._hero.h / 2 - this._y - this._h / 2,
        this._hero.x + this._hero.w / 2 - this._x - this._w / 2
      );
      const forceX = Math.cos(this._angle) * this._speed;
      const forceY = Math.sin(this._angle) * this._speed;
      this._x += forceX;
      this._y += forceY;

      this.shoot();
    }
  }

  update(): void {
    this.move();
  }

  draw(ctx: CanvasRenderingContext2D) {
    const tileSize = 128;
    const visibleTilesX = ctx.canvas.width / tileSize;
    const visibleTilesY = ctx.canvas.height / tileSize;

    const distX = Math.abs(this._camera.x / tileSize - this._x / tileSize);
    const distY = Math.abs(this._camera.y / tileSize - this._y / tileSize);

    if (distX <= visibleTilesX && distX >= 0) {
      if (distY <= visibleTilesY && distY >= 0) {
        let lifeBarRatio = this._life / 100;

        if (lifeBarRatio <= 0) lifeBarRatio = 0;

        const x = this._x - this._camera.x;
        const y = this._y - this._camera.y;

        ctx.save();

        // ctx.strokeRect(x, y - 15, this._w, this._h / 3);
        // ctx.fillStyle = '#32CD32';
        // ctx.fillRect(x, y - 15, this._w * lifeBarRatio, this._h / 3);

        ctx.translate(x + this._w / 2, y + this._h / 2);
        ctx.rotate(this._angle);
        ctx.translate(-x - this._w / 2, -y - this._h / 2);
        ctx.drawImage(this._image, x, y, this.w, this.h);

        ctx.restore();
      }
    }
  }
}

export default Enemy;

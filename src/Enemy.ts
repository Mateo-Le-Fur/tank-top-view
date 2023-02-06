import Sprite from './Sprite';
import Shots from './Shots';
import { getRandomInt } from './utils/getRandomInt';
import ImageLoader from './ImageLoader';
import GameMap from './Map';

class Enemy extends Sprite {
  private _speed: number;

  private _isMoving: boolean;

  private _cooldownFire: boolean;

  private _life: number;

  constructor(x: number, y: number, src: HTMLImageElement) {
    super(x, y, src);

    this._speed = 0.3;
    this._isMoving = false;
    this._cooldownFire = false;
    this._life = 100;
  }

  static spawn(map: GameMap, imageLoader: ImageLoader, ennemies: Enemy[]) {
    for (let i = 0; i < 50; i += 1) {
      const x = getRandomInt(map.mapWidth / 3, map.mapWidth * 3);
      const y = getRandomInt(0, map.mapHeight * 2);
      ennemies.push(new Enemy(x, y, imageLoader.getSprite('enemy')!.image));
    }
  }

  update(heroX: number, heroY: number, ennemies: Enemy[]): void {
    // On vérifie si l'ennemi doit être supprimé
    const enemyIndex = ennemies.findIndex((enemy) => enemy._life <= 0);
    if (enemyIndex !== -1) {
      ennemies.splice(enemyIndex, 1);
    }
    // calcul de l'angle entre le héros et l'ennemi
    this._angle = Math.atan2(heroY - this._y, heroX - this._x);
    const forceX = Math.cos(this._angle) * this._speed;
    const forceY = Math.sin(this._angle) * this._speed;

    /* L'ennemi se dirige vers le héros si la distance qui les sépare est supérieur à 400
     * sinon il s'arrête et tire */
    const distanceBetweenHeroAndEnemy = 400;
    if (Math.abs(this._x - heroX) > distanceBetweenHeroAndEnemy) {
      this._x += forceX;
      this._y += forceY;
      this._isMoving = true;
    } else {
      this._isMoving = false;
    }
  }

  decreaseLifePoint(shoot: Shots) {
    if (!shoot.isHitted) {
      this._life -= shoot.damage;
      shoot.isHitted = true;
    }
  }

  shoot(shootsArray: Shots[], imageLoader: ImageLoader): void {
    if (!this._isMoving && !this._cooldownFire) {
      const shell = imageLoader.getSprite('shell')!.image;

      const posX = this._x + (this._w - shell.width) / 2;
      const posY = this._y + (this._h - shell.height) / 2;

      const shoot = new Shots({
        type: 'enemy',
        x: posX,
        y: posY,
        angle: this._angle,
        speed: 0.5,
        damage: 30,
        src: shell,
      });

      shootsArray.push(shoot);

      this._cooldownFire = true;
      // L'ennemi attend entre 2.5 et 5 secondes avant de tirer de nouveau
      setTimeout(() => this._cooldownFire = false, getRandomInt(2500, 5000));
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    // ratio de la barre de vie
    let ratio = this._life / 100;

    if (ratio <= 0) ratio = 0;

    ctx.save();

    // barre de vie
    ctx.strokeRect(this._x, this._y - 15, this._w, this._h / 3);
    ctx.fillStyle = '#32CD32';
    ctx.fillRect(this._x, this._y - 15, this._w * ratio, this._h / 3);

    ctx.translate(this._x + this._w / 2, this._y + this._h / 2);
    ctx.rotate(this._angle);
    ctx.translate(-this._x - this._w / 2, -this._y - this._h / 2);
    ctx.drawImage(this._image, this._x, this._y, this._w, this._h);
    ctx.restore();
  }
}

export default Enemy;

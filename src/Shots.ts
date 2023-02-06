import Sprite from './Sprite';
import GameMap from './Map';
import { ShotInterface } from './interfaces/ShotInterface';

class Shots extends Sprite {
  private _speed: number;

  private _type: string;

  private _damage: number;

  get type() {
    return this._type;
  }

  get damage() {
    return this._damage;
  }

  constructor(shot: ShotInterface) {
    super(shot.x, shot.y, shot.src);
    this._speed = shot.speed;
    this._angle = shot.angle;
    this._type = shot.type;
    this._damage = shot.damage;
  }

  update(map: GameMap, shots: Shots[]) {
    // On vérifie si un tir doit être supprimé
    const shotIndex = shots.findIndex((shot) => shot._isHitted);
    if (shotIndex !== -1) {
      shots.splice(shotIndex, 1);
    }
    const angle = this.calculateAngle(this._type);
    const forceX = Math.cos(angle) * this._speed;
    const forceY = Math.sin(angle) * this._speed;

    this._x += forceX;
    this._y += forceY;

    const checkIfShootIsOutsideMap = map.checkIfEntityOutsideMap(this._x, this._y);
    if (checkIfShootIsOutsideMap) {
      this._isHitted = true;
    }

    const checkIfMapCollision = map.checkMapCollision(this);

    if (checkIfMapCollision.collide) {
      this._isHitted = true;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this._x + this._w / 2, this._y + this._h / 2);
    ctx.rotate(this.calculateAngle(this._type));
    ctx.translate(-this._x - this._w / 2, -this._y - this._h / 2);
    ctx.drawImage(this._image, this._x, this._y, this._w, this._h);
    ctx.restore();
  }

  calculateAngle(entityType: string): number {
    switch (entityType) {
      case 'hero':
        return this._angle * (Math.PI / 180);
      case 'enemy':
        // L'angle de l'ennemi est déjà en radian puisqu'il est calculé avec Math.atan2
        return this._angle;
      default:
        return this._angle;
    }
  }
}

export default Shots;

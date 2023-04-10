import Enemy from './Enemy';
import Game from './Game';
import Hero from './Hero';
import Shot from './Shot';
import { SpriteInterface } from './interfaces/SpriteInterface';
import GameMap from './Map';
import Explosion from './Explosion';
import ImageLoader from './ImageLoader';
import Smoke from './Smoke';

export class SpriteProcessor {
  public get map(): GameMap {
    return this._map;
  }
  public get smokes(): Smoke[] {
    return this._smokes;
  }
  public get explosions(): Explosion[] {
    return this._explosions;
  }
  public get shots(): Shot[] {
    return this._shots;
  }
  public get enemies(): Enemy[] {
    return this._enemies;
  }
  public get heros(): Hero[] {
    return this._heros;
  }

  constructor(
    private _heros: Hero[],
    private _enemies: Enemy[],
    private _shots: Shot[],
    private _explosions: Explosion[],
    private _smokes: Smoke[],
    private _map: GameMap
  ) {}

  checkHit(shot: Shot, enemy: Enemy, hero: Hero) {
    if (shot.type === 'hero' && Game.collide(shot, enemy)) {
      this.decreaseLifePoints(enemy, shot);
    } else if (shot.type === 'enemy' && Game.collide(shot, hero)) {
      this.decreaseLifePoints(hero, shot);
    }
  }

  decreaseLifePoints(sprite: SpriteInterface, shot: Shot) {
    if (!shot.isHitted) {
      sprite.life -= shot.damage;
      shot.isHitted = true;
    }
  }

  checkIfSpriteSouldBeDelete() {
    for (let i = this._enemies.length - 1; i >= 0; i--) {
      const enemy = this._enemies[i];
      if (enemy.life <= 0) {
        const spriteExplosion = ImageLoader.getInstance().getSprite('explosion')?.image!;
        const explosion = new Explosion(spriteExplosion, this._map.camera, 8)
          .posX(enemy.x - enemy.w / 2)
          .posY(enemy.y - enemy.h / 2);
        this._explosions.push(explosion);

        this.deleteSprite(i, this._enemies);
      }
    }

    for (let i = this._heros.length - 1; i >= 0; i--) {
      const hero = this._heros[i];
      if (hero.life <= 0) {
        this.deleteSprite(i, this._heros);
      }
    }

    for (let i = this._smokes.length - 1; i >= 0; i--) {
      const smoke = this._smokes[i];
      if (smoke.frame >= smoke.nbFrame - 1) {
        this.deleteSprite(i, this._smokes);
      }
    }

    for (let i = this._shots.length - 1; i >= 0; i--) {
      const shot = this._shots[i];
      if (shot.isHitted || shot.rangeLimitReached()) {
        const explosion = new Explosion(
          ImageLoader.getInstance().getSprite('explosion2')?.image!,
          this._map.camera,
          8
        )
          .posX(shot.x - shot.w / 2)
          .posY(shot.y - shot.h / 2);
        this._explosions.push(explosion);
        this.deleteSprite(i, this._shots);
      }
    }

    for (let i = this._explosions.length - 1; i >= 0; i--) {
      const explosion = this._explosions[i];
      if (explosion.frame >= explosion.nbFrame - 1) {
        this.deleteSprite(i, this._explosions);
      }
    }
  }

  deleteSprite(index: number, sprites: SpriteInterface[]): void {
    sprites.splice(index, 1);
  }

  saveLastPos(sprite: SpriteInterface): void {
    sprite.lastPosX = sprite.x;
    sprite.lastPosY = sprite.y;
  }

  reposition(sprite: SpriteInterface, shot: boolean): void {
    if (shot) {
      sprite.isHitted = true;
      return;
    }

    sprite.speed = 0;
    sprite.x = sprite.lastPosX;
    sprite.y = sprite.lastPosY;
  }

  collideWidth(
    sprite: any,
    posX: any,
    posY: any,
    tileWidth: any,
    tileHeight: any,
    compensation: any
  ): boolean {
    return (
      sprite.x < posX + tileWidth - compensation &&
      sprite.x + sprite.w > posX + compensation &&
      sprite.y < posY + tileHeight - compensation &&
      sprite.h + sprite.y > posY + compensation
    );
  }

  shotCollideMap(sprite: SpriteInterface) {
    if (this.checkMapCollision(sprite, true)) {
      sprite.isHitted = true;
    }
  }

  checkMapCollision(sprite: SpriteInterface, shot: boolean = false): void | boolean {
    const { startX, startY, endX, endY } = this._map.dynamicMapLoading();

    for (let i = startY; i < endY; i++) {
      for (let j = startX; j < endX; j++) {
        const tile = this._map.grid[i][j];
        const tileWidth = tile.w;
        const tileHeight = tile.h;

        const posX = j * this._map.tileSize;
        const posY = i * this._map.tileSize;

        const compensation = 30;

        if (tile.collide) {
          if (
            this.collideWidth(sprite, posX, posY, tileWidth, tileHeight, compensation)
          ) {
            this.reposition(sprite, shot);
          }
        }

        if (tile.muddy) {
        } else {
        }
      }
    }

    this.checkIfEntityOutsideMap(sprite, shot);

    this.saveLastPos(sprite);
  }

  checkIfEntityOutsideMap(sprite: SpriteInterface, shot: boolean = false): boolean {
    if (sprite.x > this._map.mapWidth - sprite.w) this.reposition(sprite, shot);
    if (sprite.x < 0) this.reposition(sprite, shot);

    if (sprite.y > this._map.mapHeight - sprite.h) this.reposition(sprite, shot);
    if (sprite.y < 0) this.reposition(sprite, shot);

    return false;
  }
}

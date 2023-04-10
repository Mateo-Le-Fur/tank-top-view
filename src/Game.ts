import GameMap from './Map';
import Hero from './Hero';
import Enemy from './Enemy';
import Shots from './Shot';
import { SpriteInterface } from './interfaces/SpriteInterface';
import { getRandomInt } from './utils/getRandomInt';
import ImageLoader from './ImageLoader';
import { SpriteProcessor } from './SpriteProcessor';
import { Camera } from './Camera';
import Explosion from './Explosion';
import { Menu } from './Menu';
import Smoke from './Smoke';

class Game {
  private _mapCanvas: HTMLCanvasElement;
  private _ctx: CanvasRenderingContext2D;
  private _gameover: boolean;
  private _map: GameMap;
  private _heros: Hero[];
  private _enemies: Enemy[];
  private _explosions: Explosion[];
  private _shots: Shots[];
  private _smokes: Smoke[];
  private _camera: Camera;

  constructor(private _menu: Menu, private _spriteProcessor: SpriteProcessor) {
    this._mapCanvas = document.querySelector('canvas')!;
    this._ctx = this._mapCanvas.getContext('2d')!;
    this._gameover = false;
    this._map = this._spriteProcessor.map;
    this._heros = this._spriteProcessor.heros;
    this._enemies = this._spriteProcessor.enemies;
    this._explosions = this._spriteProcessor.explosions;
    this._shots = this._spriteProcessor.shots;
    this._smokes = this._spriteProcessor.smokes;
    this._camera = this._spriteProcessor.map.camera;
  }

  static collide(shot: Shots, sprite: SpriteInterface) {
    if (!sprite || !shot) return;

    const dx = shot.x - sprite.x;
    const dy = shot.y - sprite.y;

    if (Math.abs(dx) < shot.w / 2 + sprite.w / 2) {
      if (Math.abs(dy) < shot.h / 2 + sprite.h / 2) {
        return true;
      }
    }
    return false;
  }

  async load(): Promise<void> {
    // chargement de la map

    const map = this._map.generateRandomMap();

    if (!map) return;

    this._camera.bind(this._heros[0]);

    this._mapCanvas.width = window.innerWidth;
    this._mapCanvas.height = window.innerHeight;

    this.spawnEnemies();

    window.addEventListener('click', () => {
      this._heros[0].shot(this._shots, this._smokes);
    });
  }

  spawnEnemies() {
    const spriteEnemy = ImageLoader.getInstance().getSprite('enemy')!.image;
    for (let i = 0; i < this._menu.settings.nbEnemies; i++) {
      const x = getRandomInt(0, this._map.mapWidth);
      const y = getRandomInt(0, this._map.mapHeight);
      const enemy = new Enemy(spriteEnemy, this._heros[0], this._shots, this._camera)
        .posX(x)
        .posY(y)
        .width(spriteEnemy.width)
        .height(spriteEnemy.height)
        .setSpeed(1);

      this._enemies.push(enemy);
    }
  }

  showFps(fps: number) {
    this._ctx.fillStyle = 'White';
    this._ctx.font = 'normal 16pt Arial';
    this._ctx.fillText(Math.round(fps) + ' fps', 20, 20);
  }

  loop(): void {
    // this._mapCanvas.width = window.innerWidth;
    // this._mapCanvas.height = window.innerHeight;

    this._camera.update();

    this._shots.forEach((shot: Shots) => {
      shot.update();
      this._spriteProcessor.shotCollideMap(shot);

      this._enemies.forEach((enemy) => {
        this._spriteProcessor.checkHit(shot, enemy, this._heros[0]);
      });
    });

    this._heros.forEach((hero) => {
      hero.update();
      this._spriteProcessor.checkMapCollision(hero);
    });

    this._enemies.forEach((enemy) => {
      enemy.update();
      if (enemy.isMoving) this._spriteProcessor.checkMapCollision(enemy);
    });

    this._spriteProcessor.checkIfSpriteSouldBeDelete();
  }

  draw(fps: number) {
    this._ctx.clearRect(0, 0, this._mapCanvas.width, this._mapCanvas.height);

    this._map.drawMap(this._ctx);

    this._explosions.forEach((explosion) => explosion.draw(this._ctx));

    this._shots.forEach((shoot) => shoot.draw(this._ctx));

    this._heros.forEach((hero) => hero.draw(this._ctx));

    this._smokes.forEach((smoke) => smoke.draw(this._ctx));

    this._enemies.forEach((enemy) => enemy.draw(this._ctx));

    this.showFps(fps);
  }
}

export default Game;

import GameMap from './Map';
import Hero from './Hero';
import Enemy from './Enemy';
import { getRandomInt } from './utils/getRandomInt';
import Shots from './Shots';
import ImageLoader from './ImageLoader';

const imageLoader = new ImageLoader();

// chargement des sprites
async function loadSprites() {
  await imageLoader.load('./src/images/tankE.png', 'enemy');
  await imageLoader.load('./src/images/obus.png', 'shell');
  await imageLoader.load('./src/images/tank.png', 'hero');
}

class Game {
  private _mapCanvas: HTMLCanvasElement;

  private _ctx: CanvasRenderingContext2D;

  private _app: HTMLBodyElement | null;

  private _map: GameMap;

  private _hero: Hero;

  private _enemies: Enemy[];

  private _shots: Shots[];

  private _gameover: boolean;

  private _width: number;

  private _height: number;

  constructor() {
    this._app = document.querySelector('#app');
    this._mapCanvas = document.createElement('canvas');
    this._ctx = this._mapCanvas.getContext('2d')!;
    this._width = 0;
    this._height = 0;
    this._map = new GameMap();
    this._enemies = [];
    this._shots = [];
    this._gameover = false;

    this._hero = new Hero(100, 100, imageLoader.getSprite('hero')!.image);
  }

  // test de collision entre deux entities
  static collide(shoot: Shots, entity: Hero | Enemy) {
    const dx = shoot.x - entity.x;
    const dy = shoot.y - entity.y;

    if (Math.abs(dx) < shoot.w / 2 + entity.w / 2) {
      if (Math.abs(dy) < shoot.h / 2 + entity.h / 2) {
        return true;
      }
    }
    return false;
  }

  restart() {
    this._gameover = false;

    this._enemies = [];
    this._shots = [];
    this._hero = new Hero(100, 100, imageLoader.getSprite('hero')!.image);
    this._hero.checkSpawnCollision(this._map);
    Enemy.spawn(this._map, imageLoader, this._enemies);
  }

  async load(): Promise<void> {
    // chargement de la map
    await this._map.loadMap();
    const map = this._map.generateRandomMap();

    if (!map) return;

    // On vérifie si le héros n'entre pas en collision avec une tuile lorsqu'il apparait
    this._hero.checkSpawnCollision(this._map);

    this._mapCanvas.width = this._map.mapWidth;
    this._mapCanvas.height = this._map.mapHeight;
    this._app?.appendChild(this._mapCanvas);

    // spawn des ennemies
    Enemy.spawn(this._map, imageLoader, this._enemies);

    window.addEventListener('click', async () => {
      const shell = imageLoader.getSprite('shell')!.image;

      const heroW = this._hero.w;
      const heroH = this._hero.h;
      const shellW = shell.width;
      const shellH = shell.height;
      const { angle } = this._hero;

      const posX = this._hero.x + (heroW - shellW) / 2;
      const posY = this._hero.y + (heroH - shellH) / 2;

      const shoot = new Shots({
        type: 'hero',
        x: posX,
        y: posY,
        angle,
        speed: 10,
        damage: 50,
        src: shell,
      });
      this._shots.push(shoot);
    });
  }

  update(): void {
    if (this._gameover) this.restart();

    this._ctx.clearRect(0, 0, this._width, this._height);

    // Déplacement du héros
    this._hero.move(this._map);

    // déplacement des ennemies
    if (this._enemies.length) {
      this._enemies.forEach((enemy) => {
        // l'ennemi se déplace
        enemy.update(this._hero, this._enemies);

        // Tire d'un ennemi
        enemy.shoot(this._shots, imageLoader);
      });
    }

    // gestion des tires
    if (this._shots.length) {
      this._shots.forEach((shoot: Shots) => {
        shoot.update(this._map, this._shots);

        // Gestions des tires sur les ennemies
        this._enemies.forEach((enemy: Enemy) => {
          // On vérifie si le tir à toucher l'ennemi
          if (shoot.type === 'hero' && Game.collide(shoot, enemy)) {
            enemy.decreaseLifePoint(shoot);
            // On vérifie si le tir à toucher le héros
          } else if (shoot.type === 'enemy' && Game.collide(shoot, this._hero)) {
            this._hero.decreaseLifePoint(shoot);

            if (this._hero.life <= 0) {
              this._gameover = true;
            }
          }
        });
      });
    }
  }

  draw() {
    // map
    this._map.drawMap(this._ctx);

    // affichage du hero
    this._hero.draw(this._ctx);

    // affichage des enemies
    if (this._enemies.length) {
      this._enemies.forEach((enemy) => enemy.draw(this._ctx));
    }

    // affichage des tires
    if (this._shots.length) {
      this._shots.forEach((shoot) => shoot.draw(this._ctx));
    }
  }
}

(async () => {
  await loadSprites();

  const game = new Game();

  await game.load();

  async function draw() {
    game.update();
    game.draw();
    window.requestAnimationFrame(draw);
  }

  await draw();
})();

export default Game;

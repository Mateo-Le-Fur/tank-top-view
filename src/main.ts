import 'reflect-metadata';
import { Barrel } from './Barrel';
import { Camera } from './Camera';
import Enemy from './Enemy';
import Explosion from './Explosion';
import Game from './Game';
import Hero from './Hero';
import ImageLoader from './ImageLoader';
import GameMap from './Map';
import { Menu } from './Menu';
import Shots from './Shot';
import Smoke from './Smoke';
import { SpriteProcessor } from './SpriteProcessor';
import InputHandler from './InputHandler';

let lastRenderTime = 0;
let fps = 0;
const times: number[] = [];
const maxFPS = 60;
const frameInterval = 1000 / maxFPS;

const menu = new Menu(main).display();

async function loadSprites(imageLoader: ImageLoader, path: string) {
  await imageLoader.load(`${path}/tankE.png`, 'enemy');
  await imageLoader.load(`${path}/obus.png`, 'shell');
  await imageLoader.load(`${path}/tank.png`, 'hero');
  await imageLoader.load(`${path}/treeLarge.png`, 'tree');
  await imageLoader.load(`${path}/explosion.png`, 'explosion');
  await imageLoader.load(`${path}/explosion-2.png`, 'explosion2');
  await imageLoader.load(`${path}/sheet_tanks.png`, 'sheetTanks');
}

async function main(): Promise<void> {
  const enemies: Enemy[] = [];
  const shots: Shots[] = [];
  const heros: Hero[] = [];
  const explosions: Explosion[] = [];
  const smokes: Smoke[] = [];

  const canvasWidth = window.innerWidth;
  const canvasHeight = window.innerHeight;

  console.log(canvasWidth, canvasHeight);
  const imageLoader = ImageLoader.getInstance();

  await loadSprites(imageLoader, './src/images');
  const spriteSheet = imageLoader.getSprite('sheetTanks')!.image;
  const heroSprite = imageLoader.getTexture('tankGreen_outline.png')!;
  const spriteBarrel = imageLoader.getTexture('barrelGreen_outline.png')!;

  const camera = new Camera(canvasWidth, canvasHeight);
  const map = new GameMap(
    menu.settings.mapWidth,
    menu.settings.mapHeight,
    spriteSheet,
    camera
  );

  const inputHandler = new InputHandler();

  const barrel = new Barrel(spriteSheet, camera)
    .setSx(spriteBarrel.x)
    .setSy(spriteBarrel.y)
    .width(spriteBarrel.w)
    .height(spriteBarrel.h);

  const hero = new Hero(spriteSheet, inputHandler, barrel, map)
    .posX((menu.settings.mapWidth * 128) / 2)
    .posY((menu.settings.mapHeight * 128) / 2)
    .setSx(heroSprite.x)
    .setSy(heroSprite.y)
    .width(heroSprite.w)
    .height(heroSprite.h)
    .setSpeed(0);
  heros.push(hero);

  const spriteProcessor = new SpriteProcessor(
    heros,
    enemies,
    shots,
    explosions,
    smokes,
    map
  );
  const game = new Game(menu, spriteProcessor);

  await game.load();

  async function run(currentTime: number): Promise<void> {
    const deltaTime = currentTime - lastRenderTime;

    if (deltaTime >= frameInterval) {
      const now = performance.now();
      if (times.length > 0 && times[0] <= now - 1000) {
        times.shift();
      }
      times.push(now);
      fps = times.length;

      if (!menu.checkVisibility()) {
        game.loop();
        game.draw(fps);
      }

      lastRenderTime = currentTime - (deltaTime % frameInterval);
    }

    requestAnimationFrame(run);
  }

  await run(0);
}

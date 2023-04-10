export interface SpriteInterface {
  id: number;
  x: number;
  y: number;
  lastPosX: number;
  lastPosY: number;
  h: number;
  w: number;
  angle: number;
  speed: number;
  lastSpeed: number;
  image: HTMLImageElement;
  isHitted: boolean;
  damage: number;
  life: number;
}

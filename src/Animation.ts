import Sprite from './Sprite';
import { AnimationInterface } from './interfaces/AminamtionInterface';

export class Animation extends Sprite {
  private _nbFrames: number;
  private _frames: number;
  private _frameCount: number;
  private _spriteAnimations: any[];

  constructor(
    public image: HTMLImageElement,
    _nbFrames: number,
    private _animations: AnimationInterface[],
    private _nbStates?: number,
    private _spriteWidth?: number,
    private _spriteHeight?: number
  ) {
    super(image);

    this._spriteAnimations = [];
    this._nbFrames = this._animations?.length ?? _nbFrames;
    this._frames = 0;
    this._frameCount = 0;

    for (let i = 0; i < this._animations?.length; i++) {
      const frames: { pos: any[] } = {
        pos: [],
      };
      const state = this._animations[i];
      for (let j = 0; j < state.frames; j++) {
        const posX = j * this._spriteHeight!;
        const posY = i * this._spriteWidth!;
        frames.pos.push({ x: posX, y: posY });
      }

      this._spriteAnimations[i] = frames;
    }
  }

  update(): void {}
  draw(ctx: CanvasRenderingContext2D, state?: number): void {
    this._frameCount++;
    if (this._frameCount % 3 === 0) {
      this._frames++;
    }
  }
}

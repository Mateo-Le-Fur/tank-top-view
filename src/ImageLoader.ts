import type { SpriteInterface } from './interfaces/SpriteInterface';

class ImageLoader {
  protected _sprites: SpriteInterface[];

  get sprites() {
    return this._sprites;
  }

  constructor() {
    this._sprites = [];
  }

  load(src: string, type: string): Promise<SpriteInterface> {
    return new Promise((resolve) => {
      const image = new Image();
      image.onload = () => {
        const imageLoaded = { image, type };
        resolve(imageLoaded);
        this._sprites.push(imageLoaded);
      };
      image.src = src;
    });
  }

  getSprite(type: string) {
    return this._sprites.find((image) => image.type === type);
  }
}

export default ImageLoader;

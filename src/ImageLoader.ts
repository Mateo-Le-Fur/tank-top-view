import sheetTanks from './sheet_tanks.json';

export type Image = {
  image: HTMLImageElement;
  type: string;
};

class ImageLoader {
  private static instance: ImageLoader;

  protected _sprites: Image[];
  private _sheetTanks: {
    TextureAtlas: {
      SubTexture: {
        _name: string;
        _x: string;
        _y: string;
        _width: string;
        _height: string;
      }[];
      _imagePath: string;
    };
  };

  get sprites() {
    return this._sprites;
  }

  private constructor() {
    this._sprites = [];
    this._sheetTanks = sheetTanks;
  }

  public static getInstance(): ImageLoader {
    if (!ImageLoader.instance) {
      ImageLoader.instance = new ImageLoader();
    }
    return ImageLoader.instance;
  }

  load(src: string, type: string): Promise<Image> {
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

  getSprite(type: string): Image | undefined {
    return this._sprites.find((image) => image.type === type);
  }

  getTexture(name: string) {
    const texture = this._sheetTanks.TextureAtlas.SubTexture.find(
      (texture) => texture._name === name
    );

    if (texture) {
      return {
        ...texture,
        name: Number(texture?._name),
        x: Number(texture?._x),
        y: Number(texture?._y),
        w: Number(texture?._width),
        h: Number(texture?._height),
      };
    }
  }
}

export default ImageLoader;

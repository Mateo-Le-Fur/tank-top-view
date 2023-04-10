export default class InputHandler {
  private _up: boolean;
  public get up(): boolean {
    return this._up;
  }
  public set up(value: boolean) {
    this._up = value;
  }
  private _right: boolean;
  public get right(): boolean {
    return this._right;
  }
  public set right(value: boolean) {
    this._right = value;
  }
  private _left: boolean;
  public get left(): boolean {
    return this._left;
  }
  public set left(value: boolean) {
    this._left = value;
  }

  constructor() {
    this._up = false;
    this._right = false;
    this._left = false;
    window.addEventListener('keydown', (e) => {
      switch (e.key) {
        case 'z':
          this._up = true;
          break;
        case 'q':
          this._right = true;
          break;
        case 'd':
          this._left = true;
          break;
        default:
          break;
      }
    });

    window.addEventListener('keyup', (e) => {
      switch (e.key) {
        case 'z':
          this._up = false;
          break;
        case 'q':
          this._right = false;
          break;
        case 'd':
          this._left = false;
          break;
        default:
          break;
      }
    });
  }
}

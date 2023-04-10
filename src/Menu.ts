export class Menu {
  private _menu: HTMLDivElement;
  private _restart: boolean;
  private _settings: { mapWidth: number; mapHeight: number; nbEnemies: number };
  public get settings(): { mapWidth: number; mapHeight: number; nbEnemies: number } {
    return this._settings;
  }

  private _playElem: HTMLLIElement;
  private _settingsElem: HTMLImageElement;
  private _buttonElem: HTMLButtonElement;
  public get restart(): boolean {
    return this._restart;
  }
  public set restart(value: boolean) {
    this._restart = value;
  }
  constructor(private _main: () => Promise<void>) {
    this._menu = document.querySelector('.menu')!;
    this._playElem = document.querySelector('.play')!;
    this._settingsElem = document.querySelector('.settings')!;
    this._buttonElem = document.querySelector('button')!;

    this._restart = false;
    this._settings = {
      mapWidth: 50,
      mapHeight: 50,
      nbEnemies: 25,
    };

    // window.addEventListener('keydown', async (e) => {
    //   if (e.key === 'Escape') {
    //     if (this._menu.style.visibility === 'visible') {
    //       await this.hidde();
    //     } else {
    //       this.display();
    //     }
    //   }
    // });

    this._playElem.addEventListener('click', this.play.bind(this));

    this._settingsElem.addEventListener('click', this.displaySettings.bind(this));

    this._buttonElem.addEventListener('click', this.saveSettings.bind(this));
  }

  async play() {
    this.hidde();
    if (!this.restart) await this._main();
    console.log('play');
    this._playElem.innerText = 'Rejouer';
    this._restart = true;
  }

  displaySettings() {
    const itemsElem: HTMLUListElement = document.querySelector('.items')!;
    itemsElem.style.display = 'none';

    const formSettingsElem: HTMLFormElement = document.querySelector('.form-settings')!;
    formSettingsElem.style.display = 'flex';
  }

  saveSettings(e: Event) {
    e.preventDefault();
    const target = e.target as HTMLButtonElement;

    const form = <HTMLFormElement>target.parentElement;

    const formData = new FormData(form);

    // @ts-ignore
    const data = Object.fromEntries(formData);

    this._settings = {
      mapWidth: Number(data.width),
      mapHeight: Number(data.height),
      nbEnemies: Number(data.enemies),
    };

    form.style.display = 'none';

    const itemsElem: HTMLUListElement = document.querySelector('.items')!;
    itemsElem.style.display = 'block';
  }

  checkVisibility() {
    return this._menu.style.visibility === 'visible' ? true : false;
  }

  display(): this {
    this._menu.style.visibility = 'visible';
    return this;
  }

  hidde(): this {
    this._menu.style.visibility = 'hidden';
    return this;
  }
}

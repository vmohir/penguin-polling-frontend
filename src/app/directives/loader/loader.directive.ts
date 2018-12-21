import { Directive, ElementRef, Input, SimpleChanges, OnChanges } from '@angular/core';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[loader]',
  exportAs: 'loader'
})
export class LoaderDirective implements OnChanges {
  readonly possibleClasses: { [key: string]: string[] } = {
    big: ['big-loader'],
    bg: ['bg-loader'],
    bgDark: ['bg-loader-dark'],
    accent: ['accent-loader'],
    third: ['third-loader'],
    circle: ['bg-loader-circle'],
    inline: ['loader-inline'],
    inlineBig: ['loader-inline-lg'],
    inlineWhite: ['loader-inline-white'],
    button: ['loader-inline', 'loader-inline-white'],
    matSelect: ['loader-inline', 'loader-inline-white']
  };

  @Input('loader')
  loader: LoaderConfig;

  // $loaderChanged = new BehaviorSubject<boolean>(false);
  private _is: boolean = false;
  get is() {
    return this._is;
  }
  set is(value) {
    this._is = value;
    this.setLoaderClass();
    // this.$loaderChanged.next(this._is);
  }
  private setLoaderClass() {
    if (this.is === true) this.elm.classList.add('loader');
    else if (this.is === false) this.elm.classList.remove('loader');
  }

  private elm: HTMLElement;
  constructor(elm: ElementRef<HTMLElement>) {
    this.elm = elm.nativeElement;
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.loader && this.loader) {
      this.config();
      if (typeof this.loader === 'object' && this.loader.externalLoader != undefined) {
        this.is = !!this.loader.externalLoader;
      }
    }
  }
  private config() {
    if (typeof this.loader === 'string') {
      if (this.possibleClasses[this.loader]) this.loader = { [this.loader]: true };
      else this.loader = {};
    }

    const allClasses = Object.values(this.possibleClasses).reduce((classes, curr) => [...classes, ...curr], []);
    this.elm.classList.remove(...allClasses);

    const loaderClasses: string[] = this.getClasses(this.loader);
    this.elm.classList.add(...loaderClasses);
  }

  private getClasses(loaderConfig: _LoaderConfig): string[] {
    return Object.keys(loaderConfig)
      .reduce<string[]>((classes, curr) => {
        return [...classes, ...this.possibleClasses[curr]];
      }, [])
      .filter(x => x != undefined);
  }
}

export type LoaderConfig = _LoaderConfig & { externalLoader?: boolean };
interface _LoaderConfig {
  bg?: boolean;
  bgDark?: boolean;
  accent?: boolean;
  big?: boolean;
  is?: boolean;
  circle?: boolean;
  inline?: boolean;
  inlineWhite?: boolean;
  inlineBig?: boolean;
  button?: boolean;
}

export class LocalStorageService {
  constructor(private name: string) {}

  private allKeysSaved: string[] = [];
  private get prefix(): string {
    return `${this.name}_.._`;
  }
  private getKey(name) {
    return `${this.prefix}${name}`;
  }

  set(localStorageName: string, value) {
    const localStorageKey = this.getKey(localStorageName);
    this.allKeysSaved.push(localStorageKey);

    if (value != undefined) localStorage.setItem(localStorageKey, JSON.stringify(value));
    else localStorage.removeItem(localStorageKey);
  }
  get(localStorageName: string): any {
    const localStorageKey = this.getKey(localStorageName);
    return this.parseData(localStorage.getItem(localStorageKey)) || undefined;
  }

  private parseData(data: string) {
    if (!data) return null;
    // console.log(data);
    let parsed;
    try {
      parsed = JSON.parse(data);
    } catch (error) {
      return data;
    }
    // console.log(parsed);
    return parsed;
  }

  clear() {
    this.allKeysSaved.forEach(key => localStorage.removeItem(key));
  }
}

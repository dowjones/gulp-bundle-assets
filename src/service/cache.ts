class Cache {
  protected _cache: {};

  get(key: string): any {
    return this._cache[key];
  }

  set(key: string, value: any): void {
    this._cache[key] = value;
  }
}

// Node's require caches the value assigned to module.exports, so this actually works.
module.exports = new Cache();
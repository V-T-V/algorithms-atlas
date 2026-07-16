// Cache-Aside · 实现
export interface CacheAsideHooks {
  onHit?: (key: string) => void;
  onMiss?: (key: string) => void;
  onFill?: (key: string) => void;
  onInvalidate?: (key: string) => void;
}
export class CacheAside<K, V> {
  private cache = new Map<K, V>();
  constructor(
    private loader: (key: K) => V,
    private hooks: CacheAsideHooks = {},
  ) {}
  get(key: K): V {
    if (this.cache.has(key)) {
      this.hooks.onHit?.(String(key));
      return this.cache.get(key)!;
    }
    this.hooks.onMiss?.(String(key));
    const v = this.loader(key);
    this.cache.set(key, v);
    this.hooks.onFill?.(String(key));
    return v;
  }
  invalidate(key: K): void {
    this.cache.delete(key);
    this.hooks.onInvalidate?.(String(key));
  }
  size(): number {
    return this.cache.size;
  }
}

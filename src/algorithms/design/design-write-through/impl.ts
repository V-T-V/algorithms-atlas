// Write-Through · 实现
export interface WriteThroughHooks {
  onWrite?: (key: string) => void;
  onRead?: (key: string, hit: boolean) => void;
}
export class WriteThroughCache<K, V> {
  private cache = new Map<K, V>();
  private store = new Map<K, V>();
  constructor(private hooks: WriteThroughHooks = {}) {}
  write(key: K, value: V): void {
    this.store.set(key, value);
    this.cache.set(key, value);
    this.hooks.onWrite?.(String(key));
  }
  read(key: K): V | undefined {
    const hit = this.cache.has(key);
    this.hooks.onRead?.(String(key), hit);
    return this.cache.get(key);
  }
}

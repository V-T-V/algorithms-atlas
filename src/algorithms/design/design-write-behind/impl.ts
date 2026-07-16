// Write-Behind · 实现
export interface WriteBehindHooks {
  onWriteCache?: (key: string) => void;
  onFlush?: (key: string) => void;
}
export class WriteBehindCache<K, V> {
  private cache = new Map<K, V>();
  private dirty = new Set<K>();
  private store = new Map<K, V>();
  constructor(private hooks: WriteBehindHooks = {}) {}
  write(key: K, value: V): void {
    this.cache.set(key, value);
    this.dirty.add(key);
    this.hooks.onWriteCache?.(String(key));
  }
  read(key: K): V | undefined {
    return this.cache.get(key);
  }
  async flush(flushFn: (key: K, value: V) => Promise<void>): Promise<number> {
    let n = 0;
    for (const k of this.dirty) {
      const v = this.cache.get(k);
      if (v !== undefined) {
        await flushFn(k, v);
        this.store.set(k, v);
        this.hooks.onFlush?.(String(k));
        n++;
      }
    }
    this.dirty.clear();
    return n;
  }
  dirtyCount(): number {
    return this.dirty.size;
  }
}

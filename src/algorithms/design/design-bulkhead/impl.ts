// 舱壁隔离 · 实现
export interface BulkheadHooks {
  onAcquire?: (pool: string, inFlight: number) => void;
  onReject?: (pool: string) => void;
  onRelease?: (pool: string, inFlight: number) => void;
}
export class Bulkhead {
  private inFlight = new Map<string, number>();
  constructor(private hooks: BulkheadHooks = {}) {}
  async runInPool<T>(pool: string, maxConcurrent: number, fn: () => Promise<T>): Promise<T> {
    const cur = this.inFlight.get(pool) ?? 0;
    if (cur >= maxConcurrent) {
      this.hooks.onReject?.(pool);
      throw new Error(`pool ${pool} full`);
    }
    this.inFlight.set(pool, cur + 1);
    this.hooks.onAcquire?.(pool, cur + 1);
    try {
      return await fn();
    } finally {
      const after = (this.inFlight.get(pool) ?? 1) - 1;
      this.inFlight.set(pool, after);
      this.hooks.onRelease?.(pool, after);
    }
  }
}

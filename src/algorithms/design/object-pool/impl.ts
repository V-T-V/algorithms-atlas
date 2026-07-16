// =============================================================================
// 对象池模式 · 纯算法实现
// ObjectPool<T>：预创建 capacity 个对象（由 factory 生成），
//   acquire() 借出，release(obj) 归还（先 reset）。
// 借空时按 policy：'reject' 抛错；'grow' 动态扩张（不超过 maxSize）。
// =============================================================================

export interface PoolHooks<T> {
  onAcquire?: (obj: T, freeAfter: number, inUseAfter: number) => void;
  onRelease?: (obj: T, freeAfter: number, inUseAfter: number) => void;
  onGrow?: (newSize: number) => void;
  onReject?: () => void;
}

export type ExhaustionPolicy = 'reject' | 'grow';

export interface PoolStats {
  capacity: number;
  inUse: number;
  free: number;
  totalAcquired: number;
  totalReleased: number;
  totalGrown: number;
  totalRejected: number;
}

/**
 * 泛型对象池。
 * @param factory 创建新对象的工厂
 * @param reset   归还时的重置函数（可空）
 * @param capacity 初始容量
 * @param maxSize  最大容量（grow 策略上限，默认 = capacity）
 * @param policy   借空策略
 */
export class ObjectPool<T> {
  private free: T[] = [];
  private inUse = new Set<T>();
  private totalAcquired = 0;
  private totalReleased = 0;
  private totalGrown = 0;
  private totalRejected = 0;
  private currentCapacity: number;
  private readonly hooks: PoolHooks<T>;

  constructor(
    private readonly factory: () => T,
    private readonly reset: ((obj: T) => void) | undefined,
    capacity: number,
    private readonly maxSize: number = capacity,
    private readonly policy: ExhaustionPolicy = 'reject',
    hooks: PoolHooks<T> = {},
  ) {
    if (capacity <= 0) throw new RangeError('capacity must be positive');
    if (maxSize < capacity) throw new RangeError('maxSize must be >= capacity');
    this.currentCapacity = capacity;
    this.hooks = hooks;
    for (let i = 0; i < capacity; i++) this.free.push(factory());
  }

  /** 借出一个对象。空则按策略处理。 */
  acquire(): T {
    if (this.free.length === 0) {
      if (this.policy === 'grow' && this.currentCapacity < this.maxSize) {
        const newObj = this.factory();
        this.free.push(newObj);
        this.currentCapacity += 1;
        this.totalGrown += 1;
        this.hooks.onGrow?.(this.currentCapacity);
      } else {
        this.totalRejected += 1;
        this.hooks.onReject?.();
        throw new Error('pool exhausted');
      }
    }
    const obj = this.free.pop()!;
    this.inUse.add(obj);
    this.totalAcquired += 1;
    this.hooks.onAcquire?.(obj, this.free.length, this.inUse.size);
    return obj;
  }

  /** 归还对象（先 reset）。 */
  release(obj: T): void {
    if (!this.inUse.has(obj)) return; // 未借出，忽略
    this.inUse.delete(obj);
    this.reset?.(obj);
    this.free.push(obj);
    this.totalReleased += 1;
    this.hooks.onRelease?.(obj, this.free.length, this.inUse.size);
  }

  get freeCount(): number {
    return this.free.length;
  }
  get inUseCount(): number {
    return this.inUse.size;
  }
  get capacity(): number {
    return this.currentCapacity;
  }

  stats(): PoolStats {
    return {
      capacity: this.currentCapacity,
      inUse: this.inUse.size,
      free: this.free.length,
      totalAcquired: this.totalAcquired,
      totalReleased: this.totalReleased,
      totalGrown: this.totalGrown,
      totalRejected: this.totalRejected,
    };
  }
}

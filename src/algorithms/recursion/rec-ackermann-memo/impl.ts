// 记忆化阿克曼函数 · 实现

export interface AckHooks {
  onCall?: (m: number, n: number, depth: number) => void;
  onMemoHit?: (m: number, n: number) => void;
  onMemoStore?: (m: number, n: number, value: bigint) => void;
}

const key = (m: number, n: bigint): string => `${m},${n}`;

/** 记忆化 Ackermann，返回 bigint 以支持大数。 */
export class AckermannMemo {
  private memo = new Map<string, bigint>();
  private maxDepth = 0;
  private callCount = 0;
  private hitCount = 0;

  constructor(private hooks: AckHooks = {}) {}

  compute(m: number, n: bigint, depth = 0): bigint {
    this.callCount++;
    if (depth > this.maxDepth) this.maxDepth = depth;
    this.hooks.onCall?.(m, Number(n), depth);
    const k = key(m, n);
    const cached = this.memo.get(k);
    if (cached !== undefined) {
      this.hitCount++;
      this.hooks.onMemoHit?.(m, Number(n));
      return cached;
    }
    let result: bigint;
    if (m === 0) result = n + 1n;
    else if (n === 0n) result = this.compute(m - 1, 1n, depth + 1);
    else result = this.compute(m - 1, this.compute(m, n - 1n, depth + 1), depth + 1);
    this.memo.set(k, result);
    this.hooks.onMemoStore?.(m, Number(n), result);
    return result;
  }

  get stats(): { calls: number; hits: number; size: number; maxDepth: number } {
    return {
      calls: this.callCount,
      hits: this.hitCount,
      size: this.memo.size,
      maxDepth: this.maxDepth,
    };
  }
}

export function ackermannMemo(m: number, n: number, hooks: AckHooks = {}): bigint {
  return new AckermannMemo(hooks).compute(m, BigInt(n));
}

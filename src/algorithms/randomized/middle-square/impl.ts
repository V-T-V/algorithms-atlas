// =============================================================================
// 平方取中法（Middle-Square Method）· 纯算法实现
// n 位十进制种子 → 平方（2n 位）→ 取中间 n 位 → 下一个数。
// 零 DOM 依赖，可独立单测。通过「钩子」暴露每一步。
// =============================================================================

/** 事件钩子。 */
export interface MiddleSquareHooks {
  /** 每生成一个新值时触发（含平方结果、取出的中间位）。 */
  onNext?: (value: number, squared: number, padded: string) => void;
  /** 检测到收敛（如 0）或循环时触发。 */
  onCycle?: (value: number) => void;
}

/**
 * 平方取中法生成器（n 位十进制）。
 */
export class MiddleSquare {
  /** 位数 n（十进制）。 */
  readonly digits: number;
  private state: number;
  private readonly seen = new Set<number>();

  constructor(seed: number = 6752, digits: number = 4) {
    if (digits < 2) throw new Error('位数 n 必须 ≥ 2');
    this.digits = digits;
    const max = Math.pow(10, digits);
    this.state = ((seed % max) + max) % max;
  }

  /** 取下一个 n 位数。 */
  next(): number {
    const n = this.digits;
    const max = Math.pow(10, n);
    const squared = this.state * this.state;
    // 平方结果补足 2n 位（前补 0）
    const padded = String(squared).padStart(2 * n, '0');
    // 取中间 n 位：从第 (n/2) 位起取 n 位
    const start = Math.floor(n / 2);
    const middle = padded.substring(start, start + n);
    const value = Number(middle) % max;
    this.state = value;
    return value;
  }

  /** 生成 count 个值，可选钩子；检测到循环/收敛时提前停止。 */
  generate(count: number, hooks: MiddleSquareHooks = {}): number[] {
    const out: number[] = [];
    for (let i = 0; i < count; i++) {
      const prev = this.state;
      if (this.seen.has(prev) || prev === 0) {
        hooks.onCycle?.(prev);
        break;
      }
      this.seen.add(prev);
      const value = this.next();
      const squared = prev * prev;
      const padded = String(squared).padStart(2 * this.digits, '0');
      hooks.onNext?.(value, squared, padded);
      out.push(value);
      if (value === 0) {
        hooks.onCycle?.(0);
        break;
      }
    }
    return out;
  }

  /** 当前状态（便于观察）。 */
  get current(): number {
    return this.state;
  }
}

/** 便捷：用给定种子生成序列。 */
export function generateMiddleSquareSequence(
  seed: number,
  digits: number,
  count: number,
  hooks: MiddleSquareHooks = {},
): number[] {
  const gen = new MiddleSquare(seed, digits);
  return gen.generate(count, hooks);
}

/** 计算序列的周期长度（到首次重复或收敛）。 */
export function findCycleLength(seed: number, digits: number, maxIter: number = 10000): number {
  const gen = new MiddleSquare(seed, digits);
  const seen = new Map<number, number>(); // value → step
  let step = 0;
  let cur = seed % Math.pow(10, digits);
  seen.set(cur, step);
  while (step < maxIter) {
    cur = gen.next();
    step++;
    if (seen.has(cur)) {
      return step - seen.get(cur)!;
    }
    seen.set(cur, step);
    if (cur === 0) return 1;
  }
  return -1; // 未在 maxIter 内找到
}

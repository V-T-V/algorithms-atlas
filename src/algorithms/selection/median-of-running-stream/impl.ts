// 滑动窗口中位数（双堆 + 懒删除）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过钩子暴露窗口每步与中位数。

/** 事件钩子。 */
export interface WindowMedianHooks {
  /** 窗口滑动到 [start, end]（含两端），给出当前窗口内中位数。 */
  onWindow?: (start: number, end: number, median: number) => void;
  /** 插入新元素 value。 */
  onInsert?: (value: number, heap: 'lower' | 'upper') => void;
  /** 触发一次平衡（rebalance 后两堆大小）。 */
  onRebalance?: (lowerSize: number, upperSize: number) => void;
  /** 懒删除触发：从某堆顶弹出了过期元素。 */
  onEvict?: (value: number, heap: 'lower' | 'upper') => void;
}

export interface WindowMedianResult {
  /** 每个窗口的中位数序列。奇数 k 直接为元素值；偶数 k 为两中值平均。 */
  medians: number[];
  /** 窗口个数。 */
  count: number;
}

class Heap<T> {
  private readonly a: T[] = [];
  constructor(private readonly cmp: (x: T, y: T) => number) {}
  get size(): number {
    return this.a.length;
  }
  peek(): T | undefined {
    return this.a[0];
  }
  push(x: T): void {
    this.a.push(x);
    this.up(this.a.length - 1);
  }
  pop(): T | undefined {
    const top = this.a[0];
    const last = this.a.pop();
    if (this.a.length > 0 && last !== undefined) {
      this.a[0] = last;
      this.down(0);
    }
    return top;
  }
  private up(i: number): void {
    const x = this.a[i]!;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (this.cmp(this.a[p]!, x) > 0) {
        this.a[i] = this.a[p]!;
        i = p;
      } else break;
    }
    this.a[i] = x;
  }
  private down(i: number): void {
    const n = this.a.length;
    const x = this.a[i]!;
    while (true) {
      const l = i * 2 + 1;
      const r = l + 1;
      let best = i;
      let bestV = x;
      if (l < n && this.cmp(this.a[l]!, bestV) < 0) {
        best = l;
        bestV = this.a[l]!;
      }
      if (r < n && this.cmp(this.a[r]!, bestV) < 0) {
        best = r;
        bestV = this.a[r]!;
      }
      if (best === i) break;
      this.a[i] = this.a[best]!;
      i = best;
    }
    this.a[i] = x;
  }
}

/**
 * 滑动窗口中位数。
 *
 * @param arr 数据流（数组）
 * @param k 窗口大小（>=1）
 * @param hooks 可选事件钩子
 * @returns 每个窗口的中位数序列
 */
export function windowMedian(
  arr: readonly number[],
  k: number,
  hooks: WindowMedianHooks = {},
): WindowMedianResult {
  const n = arr.length;
  if (k < 1) throw new RangeError(`k 必须 >=1，收到 ${k}`);
  if (n === 0 || k > n) return { medians: [], count: 0 };

  // lower: 最大堆（存较小一半）；upper: 最小堆（存较大一半）
  const lower = new Heap<number>((a, b) => b - a);
  const upper = new Heap<number>((a, b) => a - b);
  const delayed = new Map<number, number>(); // 待懒删除的值 → 计数
  let lowerSize = 0;
  let upperSize = 0;

  const prune = (h: Heap<number>, isLower: boolean): void => {
    while (h.size > 0) {
      const top = h.peek()!;
      const cnt = delayed.get(top) ?? 0;
      if (cnt > 0) {
        h.pop();
        delayed.set(top, cnt - 1);
        if (isLower) lowerSize--;
        else upperSize--;
        hooks.onEvict?.(top, isLower ? 'lower' : 'upper');
      } else break;
    }
  };

  const balance = (): void => {
    if (lowerSize > upperSize + 1) {
      const v = lower.pop()!;
      lowerSize--;
      upper.push(v);
      upperSize++;
      prune(lower, true);
    } else if (upperSize > lowerSize) {
      const v = upper.pop()!;
      upperSize--;
      lower.push(v);
      lowerSize++;
      prune(upper, false);
    }
    hooks.onRebalance?.(lowerSize, upperSize);
  };

  const insert = (v: number): void => {
    if (lower.size === 0 || v <= (lower.peek() ?? -Infinity)) {
      lower.push(v);
      lowerSize++;
      hooks.onInsert?.(v, 'lower');
    } else {
      upper.push(v);
      upperSize++;
      hooks.onInsert?.(v, 'upper');
    }
    prune(lower, true);
    prune(upper, false);
    balance();
  };

  const remove = (v: number): void => {
    delayed.set(v, (delayed.get(v) ?? 0) + 1);
    if (v <= (lower.peek() ?? -Infinity)) lowerSize--;
    else upperSize--;
    prune(lower, true);
    prune(upper, false);
    balance();
  };

  const medians: number[] = [];
  for (let i = 0; i < n; i++) {
    insert(arr[i]!);
    const start = i - k + 1;
    if (start >= 0) {
      prune(lower, true);
      prune(upper, false);
      const med =
        k % 2 === 1 ? (lower.peek() ?? 0) : ((lower.peek() ?? 0) + (upper.peek() ?? 0)) / 2;
      medians.push(med);
      hooks.onWindow?.(start, i, med);
      // 离开窗口的元素标记懒删除
      remove(arr[start]!);
    }
  }
  return { medians, count: medians.length };
}

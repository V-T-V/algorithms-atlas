// =============================================================================
// 树状数组 区间更新版 BIT2（差分 BIT）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 实现：用差分数组 + 树状数组，支持「区间加」+「单点查询」。
//   - 与 ds/fenwick-tree（单点加 + 前缀和）互为对偶：本版本支持区间加、单点查。
//   - rangeAdd(l, r, v)：等价于 diff[l]+=v, diff[r+1]-=v（差分），用 BIT 维护。
//   - pointQuery(i)：查询原数组 a[i] = 前缀和 diff[1..i]。
//   - 区间加 O(log n)，单点查 O(log n)。
// =============================================================================

/** 差分 BIT 操作过程中的事件钩子。任一可选。 */
export interface BIT2Hooks {
  /** 区间加：经过下标 i（1-based），delta 为施加的增量。 */
  onRangeStep?: (i: number, delta: number) => void;
  /** 单点查询：汇总下标 i（1-based）。 */
  onQueryStep?: (i: number) => void;
}

/**
 * 树状数组（区间更新版 / 差分 BIT）。
 * 内部 1-based 维护差分数组的 BIT。支持「区间加」与「单点查询」。
 */
export class BinaryIndexedTree2 {
  /** BIT 数组（1-based，下标 0 不用），维护差分。 */
  private bit: number[];
  readonly n: number;

  constructor(size: number) {
    if (size < 0) size = 0;
    this.n = size;
    this.bit = new Array<number>(size + 1).fill(0);
  }

  /** 由初值数组构造（用 rangeAdd 逐项初始化，O(n log n)）。 */
  static fromArray(values: readonly number[]): BinaryIndexedTree2 {
    const t = new BinaryIndexedTree2(values.length);
    for (let i = 0; i < values.length; i++) t.rangeAdd(i + 1, i + 1, values[i]!);
    return t;
  }

  private lowbit(i: number): number {
    return i & -i;
  }

  /** 内部：单点对差分数组下标 idx 加 delta。 */
  private add(idx: number, delta: number, hooks: BIT2Hooks): void {
    for (let i = idx; i <= this.n; i += this.lowbit(i)) {
      this.bit[i] = (this.bit[i] ?? 0) + delta;
      hooks.onRangeStep?.(i, delta);
    }
  }

  /** 区间加 v：闭区间 [l, r]（1-based）。 */
  rangeAdd(l: number, r: number, v: number, hooks: BIT2Hooks = {}): void {
    if (l < 1 || l > this.n || r < 1 || r > this.n || l > r) return;
    this.add(l, v, hooks);
    if (r + 1 <= this.n) this.add(r + 1, -v, hooks);
  }

  /** 单点查询：a[idx]（1-based）= diff 前缀和。 */
  pointQuery(idx: number, hooks: BIT2Hooks = {}): number {
    if (idx < 1 || idx > this.n) return 0;
    let sum = 0;
    for (let i = idx; i > 0; i -= this.lowbit(i)) {
      sum += this.bit[i] ?? 0;
      hooks.onQueryStep?.(i);
    }
    return sum;
  }

  /** 还原整个原数组（用于断言/渲染），O(n log n)。 */
  toArray(): number[] {
    const out: number[] = [];
    for (let i = 1; i <= this.n; i++) out.push(this.pointQuery(i));
    return out;
  }

  /** 内部 BIT 数组副本（1-based，含未用下标 0）。 */
  toBitArray(): number[] {
    return [...this.bit];
  }
}

/**
 * 便利函数：构造差分 BIT，返回实例。
 */
export function binaryIndexedTree2(
  values: readonly number[],
  _hooks: BIT2Hooks = {},
): BinaryIndexedTree2 {
  return BinaryIndexedTree2.fromArray(values);
}

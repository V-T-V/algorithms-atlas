// =============================================================================
// 爬楼梯（Staircase Ways）· 纯算法实现
// 经典 1/2 步爬楼梯：到第 n 阶的方法数 ways(n) = ways(n-1) + ways(n-2)，
// 即「平移后的斐波那契」。基线 ways(0)=1（站原地算一种），ways(1)=1。
// 提供朴素递归 + 记忆化两个版本对比。零 DOM 依赖，可独立单测。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选。 */
export interface StaircaseHooks {
  /** 进入 ways(k) 子问题。 */
  onRecurse?: (k: number, depth: number) => void;
  /** 记忆化命中（ways(k) 已缓存）。 */
  onMemoHit?: (k: number, value: number) => void;
  /** 记忆化写入缓存。 */
  onMemoStore?: (k: number, value: number) => void;
  /** 得到 ways(k) 的结果。 */
  onSolve?: (k: number, value: number) => void;
}

/**
 * 朴素递归：到第 n 阶的方法数（每次可走 1 或 2 步）。
 * ways(0)=1, ways(1)=1, ways(n)=ways(n-1)+ways(n-2)。
 * 时间 O(2^n)，空间 O(n)。
 *
 * @param n 阶数（非负整数）
 * @param hooks 可选事件钩子
 * @param depth 内部用：当前递归深度
 */
export function staircaseWays(n: number, hooks: StaircaseHooks = {}, depth: number = 0): number {
  if (!Number.isInteger(n) || n < 0) {
    throw new RangeError(`staircaseWays 要求非负整数，收到 ${n}`);
  }
  hooks.onRecurse?.(n, depth);
  if (n <= 1) {
    hooks.onSolve?.(n, 1);
    return 1;
  }
  const v = staircaseWays(n - 1, hooks, depth + 1) + staircaseWays(n - 2, hooks, depth + 1);
  hooks.onSolve?.(n, v);
  return v;
}

/**
 * 记忆化递归版：用外部 memo（Map<number, number>）避免重复计算。
 * 时间 O(n)，空间 O(n)。
 *
 * @param n 阶数（非负整数）
 * @param memo 可选外部缓存（多调用复用同一 Map）
 * @param hooks 可选事件钩子
 * @param depth 内部用：当前递归深度
 */
export function staircaseWaysMemo(
  n: number,
  memo: Map<number, number> = new Map(),
  hooks: StaircaseHooks = {},
  depth: number = 0,
): number {
  if (!Number.isInteger(n) || n < 0) {
    throw new RangeError(`staircaseWaysMemo 要求非负整数，收到 ${n}`);
  }
  if (memo.has(n)) {
    hooks.onMemoHit?.(n, memo.get(n)!);
    return memo.get(n)!;
  }
  hooks.onRecurse?.(n, depth);
  let v: number;
  if (n <= 1) {
    v = 1;
  } else {
    v =
      staircaseWaysMemo(n - 1, memo, hooks, depth + 1) +
      staircaseWaysMemo(n - 2, memo, hooks, depth + 1);
  }
  memo.set(n, v);
  hooks.onMemoStore?.(n, v);
  hooks.onSolve?.(n, v);
  return v;
}

/** 生成到第 0..n 阶的方法数序列（迭代版，用于展示/断言）。 */
export function staircaseSequence(n: number): number[] {
  if (!Number.isInteger(n) || n < 0) {
    throw new RangeError(`staircaseSequence 要求非负整数，收到 ${n}`);
  }
  const seq: number[] = [];
  let a = 1; // ways(0)
  let b = 1; // ways(1)
  for (let i = 0; i <= n; i++) {
    if (i === 0) seq.push(1);
    else if (i === 1) seq.push(1);
    else {
      const c = a + b;
      seq.push(c);
      a = b;
      b = c;
    }
  }
  return seq;
}

// =============================================================================
// 第 k 个斐波那契数查找（K-th Fibonacci）· 纯算法实现
// 用迭代 O(k) 求第 k 个斐波那契数（F(0)=0, F(1)=1）。
// 零 DOM 依赖，可独立单测。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface KFibHooks {
  /** 计算出第 i 项的值。 */
  onStep?: (i: number, value: number) => void;
  /** 计算完成。 */
  onDone?: (k: number, value: number) => void;
}

/**
 * 求第 k 个斐波那契数（从 0 起：F(0)=0, F(1)=1, F(2)=1, ...）。
 * @param k 非负整数
 * @returns F(k)
 */
export function kFib(k: number, hooks: KFibHooks = {}): number {
  if (k < 0 || !Number.isInteger(k)) {
    hooks.onDone?.(k, NaN);
    return NaN;
  }
  if (k === 0) {
    hooks.onStep?.(0, 0);
    hooks.onDone?.(0, 0);
    return 0;
  }
  if (k === 1) {
    hooks.onStep?.(0, 0);
    hooks.onStep?.(1, 1);
    hooks.onDone?.(1, 1);
    return 1;
  }
  let prev = 0;
  let cur = 1;
  hooks.onStep?.(0, 0);
  hooks.onStep?.(1, 1);
  for (let i = 2; i <= k; i++) {
    const next = prev + cur;
    prev = cur;
    cur = next;
    hooks.onStep?.(i, cur);
  }
  hooks.onDone?.(k, cur);
  return cur;
}

/** 判断 x 是否为斐波那契数（用迭代生成直到 >= x）。 */
export function isFib(x: number, hooks: KFibHooks = {}): boolean {
  if (x < 0) return false;
  if (x === 0) {
    hooks.onStep?.(0, 0);
    hooks.onDone?.(0, 0);
    return true;
  }
  if (x === 1) {
    hooks.onStep?.(0, 0);
    hooks.onStep?.(1, 1);
    hooks.onDone?.(1, 1);
    return true;
  }
  let prev = 0;
  let cur = 1;
  let i = 1;
  hooks.onStep?.(0, 0);
  hooks.onStep?.(1, 1);
  while (cur < x) {
    const next = prev + cur;
    prev = cur;
    cur = next;
    i++;
    hooks.onStep?.(i, cur);
  }
  const res = cur === x;
  hooks.onDone?.(i, cur);
  return res;
}

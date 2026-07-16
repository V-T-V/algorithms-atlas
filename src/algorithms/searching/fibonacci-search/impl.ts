// =============================================================================
// 斐波那契搜索 Fibonacci Search · 纯算法实现
// 在**有序数组**中查找目标，用斐波那契数划分子区间（避免除法、对缓存友好）。
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface FibonacciSearchHooks {
  /** 每次探测：在偏移 offset 处、探测下标 i，给出当前斐波那契阶 fibM。 */
  onProbe?: (offset: number, i: number, fibM: number) => void;
  /** 比较结果：dir='left' 去左子区间，'right' 去右，'hit' 命中。 */
  onCompare?: (i: number, value: number, dir: 'left' | 'right' | 'hit') => void;
  /** 缩小区间：偏移从 oldOff 变为 newOff（去右时才推进）。 */
  onShrink?: (oldOff: number, newOff: number, dir: 'left' | 'right') => void;
  /** 查找结束，给出结果（命中下标，或 -1）。 */
  onDone?: (foundIndex: number) => void;
}

/**
 * 生成前若干项斐波那契数（从 F(0)=0, F(1)=1 起），直到最后一项 ≥ maxN。
 */
export function fibsUpTo(maxN: number): number[] {
  const fib = [0, 1];
  while (fib[fib.length - 1]! < maxN) {
    fib.push(fib[fib.length - 1]! + fib[fib.length - 2]!);
  }
  return fib;
}

/**
 * 斐波那契搜索：在**升序**数组中查找 target 的下标；不存在返回 -1。
 *
 * 与二分同构，但用斐波那契数 F(k) 划分子区间，而非 1/2。维护三个连续的斐波那契数：
 *   `fibMm2 = F(k-2)`, `fibMm1 = F(k-1)`, `fibM = F(k)`（fibM = fibMm1 + fibMm2）。
 *
 * 流程：\n
 * 1. 找最小的 k 使 `F(k) ≥ n`，初始化三个斐波那契数；`offset = -1`（区间左端的前一位）\n
 * 2. 当 `fibM > 1`：\n
 *    - 探测 `i = min(offset + fibMm2, n-1)`\n
 *    - `a[i] < target` → 去右：`offset = i`；将三数整体降一阶\n
 *      （新 fibM = fibMm1 − fibMm2，新 fibMm1 = fibMm2，新 fibMm2 = 新 fibM − 新 fibMm1）\n
 *      —— 这一步等价于「丢掉左段，对右段长度为 fibMm1 的子问题继续做」\n
 *    - `a[i] > target` → 去左：offset 不变；三数整体降两阶\n
 *      （新 fibM = fibMm2，新 fibMm1 = fibMm1 − fibMm2，新 fibMm2 = 2·fibMm2 − fibMm1）\n
 *    - 相等 → 命中 i\n
 * 3. 收尾：若 `fibMm1 == 1`（即还剩一个候选），再比一次 `a[offset+1]`\n
 *
 * 特点：**只做加减、不做除法**；划分子区间偏向 1/3 处而非中点，在某些硬件上对缓存更友好。
 * 平均 / 最坏 `O(log n)`。
 *
 * @param arr 升序数组
 * @param target 目标值
 * @param hooks 可选事件钩子
 */
export function fibonacciSearch(
  arr: readonly number[],
  target: number,
  hooks: FibonacciSearchHooks = {},
): number {
  const n = arr.length;
  if (n === 0) {
    hooks.onDone?.(-1);
    return -1;
  }

  // 找最小的 k 使 fibM = F(k) ≥ n
  const fib = fibsUpTo(n);
  let k = 2;
  while (fib[k]! < n) k++;
  let fibMm2 = fib[k - 2]!; // F(k-2)
  let fibMm1 = fib[k - 1]!; // F(k-1)
  let fibM = fib[k]!; // F(k)
  let offset = -1;

  // 让循环正常推进：fibMm2 可能由于「去右」后为 0，但 min 夹到 n-1 保证 i 合法
  while (fibM > 1) {
    const i = Math.min(offset + fibMm2, n - 1);
    hooks.onProbe?.(offset + 1, i, fibM);
    const v = arr[i]!;

    if (v < target) {
      hooks.onCompare?.(i, v, 'right');
      // 去右：丢掉左段（长 fibMm2），在右段（长 fibMm1）上继续
      const oldOff = offset + 1;
      fibM = fibMm1;
      fibMm1 = fibMm2;
      fibMm2 = fibM - fibMm1;
      offset = i;
      hooks.onShrink?.(oldOff, offset + 1, 'right');
    } else if (v > target) {
      hooks.onCompare?.(i, v, 'left');
      // 去左：丢掉右段（长 fibMm1），在左段（长 fibMm2）上继续
      fibM = fibMm2;
      fibMm1 = fibMm1 - fibMm2;
      fibMm2 = fibM - fibMm1;
      hooks.onShrink?.(offset + 1, offset + 1, 'left');
    } else {
      hooks.onCompare?.(i, v, 'hit');
      hooks.onDone?.(i);
      return i;
    }
  }

  // 收尾：还剩一个候选元素 offset+1
  if (fibMm1 === 1 && offset + 1 < n) {
    const i = offset + 1;
    hooks.onProbe?.(offset + 1, i, 1);
    const v = arr[i]!;
    if (v === target) {
      hooks.onCompare?.(i, v, 'hit');
      hooks.onDone?.(i);
      return i;
    }
    hooks.onCompare?.(i, v, v < target ? 'right' : 'left');
  }

  hooks.onDone?.(-1);
  return -1;
}

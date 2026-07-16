// =============================================================================
// 斐波那契搜索（Fibonacci Search）· 纯算法实现
// 用斐波那契数划分区间，只靠加减。零 DOM 依赖，可独立单测。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface FibonacciSearchHooks {
  /** 初始化：找到斐波那契序号 k。 */
  onInit?: (k: number) => void;
  /** 在偏移 offset 处用 fibM 偏移探测下标 i。 */
  onProbe?: (i: number, offset: number, fibM: number) => void;
  /** 缩小到左 / 右子区间。 */
  onShrink?: (direction: 'left' | 'right' | 'drop') => void;
  /** 查找结束：命中下标或 -1。 */
  onDone?: (foundIndex: number) => void;
}

/** 返回前几个斐波那契数，直到 >= limit。保证至少有 [0,1,1]。 */
function fibUntil(limit: number): { fibs: number[]; k: number } {
  const fibs = [0, 1, 1];
  while (fibs[fibs.length - 1]! < limit) {
    fibs.push(fibs[fibs.length - 1]! + fibs[fibs.length - 2]!);
  }
  return { fibs, k: fibs.length - 1 };
}

/**
 * 斐波那契搜索：在**升序**数组中查找 target，返回其下标；不存在返回 -1。
 * 时间 O(log n)，空间 O(1)。
 *
 * @param arr 升序数组
 * @param target 目标值
 * @param hooks 可选的事件钩子
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

  // 找到最小的 k 使 F(k) >= n
  const { fibs, k } = fibUntil(n);
  hooks.onInit?.(k);

  // fibM = F(k-2), fib1 = F(k-1), fibK = F(k)
  let fibM = fibs[Math.max(0, k - 2)]!;
  let fib1 = fibs[Math.max(0, k - 1)]!;
  let fibK = fibs[k]!;
  let offset = -1;

  while (fibK > 1) {
    // i 取 min(offset + fibM, n-1)
    const i = Math.min(offset + fibM, n - 1);
    hooks.onProbe?.(i, offset, fibM);

    if (arr[i]! < target) {
      // 右移：丢掉 F(k-2) 偏移
      hooks.onShrink?.('right');
      fibK = fib1;
      fib1 = fibM;
      fibM = fibK - fib1;
      offset = i;
    } else if (arr[i]! > target) {
      // 左移：保留 offset，丢掉 F(k-1)
      hooks.onShrink?.('left');
      fibK = fibM;
      fib1 = fib1 - fibM;
      fibM = fibK - fib1;
    } else {
      hooks.onDone?.(i);
      return i;
    }
  }

  // 检查最后一个元素
  if (fib1 === 1 && offset + 1 < n && arr[offset + 1]! === target) {
    hooks.onShrink?.('drop');
    hooks.onDone?.(offset + 1);
    return offset + 1;
  }

  hooks.onDone?.(-1);
  return -1;
}

export { fibUntil };

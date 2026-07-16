// 迭代版 Ackermann（栈模拟）· 纯算法实现

/** 事件钩子。 */
export interface AckIterHooks {
  /** 栈状态变化（给出当前栈深与栈顶 m,n）。 */
  onStep?: (stackSize: number, topM: number, topN: number) => void;
  /** 一次归约应用（给出应用的规则编号）。 */
  onReduce?: (rule: 1 | 2 | 3) => void;
  /** 完成（给出结果）。 */
  onResult?: (value: number) => void;
}

/**
 * 迭代版 Ackermann：用栈模拟递归。
 *
 * @param m 第一参数（>=0）
 * @param n 第二参数（>=0）
 * @param maxSteps 安全上限（默认 1e7）
 * @param hooks 可选事件钩子
 * @returns A(m,n)
 */
export function ackermannIter(
  m: number,
  n: number,
  maxSteps: number = 10_000_000,
  hooks: AckIterHooks = {},
): number {
  if (!Number.isInteger(m) || m < 0 || !Number.isInteger(n) || n < 0) {
    throw new RangeError(`参数须为非负整数: m=${m}, n=${n}`);
  }
  // 栈：每个元素是一个「待求的 m 值」，n 值用「当前值」携带
  const stack: number[] = [m];
  let cur = n;
  let steps = 0;

  while (stack.length > 0) {
    if (steps++ > maxSteps) throw new RangeError(`超过步数上限 ${maxSteps}`);
    const top = stack[stack.length - 1]!;
    hooks.onStep?.(stack.length, top, cur);

    if (top === 0) {
      // 规则1：A(0,n) = n+1
      stack.pop();
      cur = cur + 1;
      hooks.onReduce?.(1);
    } else if (cur === 0) {
      // 规则2：A(m,0) = A(m-1,1)
      stack[stack.length - 1] = top - 1;
      cur = 1;
      hooks.onReduce?.(2);
    } else {
      // 规则3：A(m,n) = A(m-1, A(m,n-1))
      // 等价于：压入 m-1（待求），当前层 m 不变但 n 减 1
      stack[stack.length - 1] = top - 1; // 这是「外层」A(m-1, ?) 的 m
      stack.push(top); // 内层 A(m, n-1) 的 m
      cur = cur - 1;
      hooks.onReduce?.(3);
    }
  }
  hooks.onResult?.(cur);
  return cur;
}

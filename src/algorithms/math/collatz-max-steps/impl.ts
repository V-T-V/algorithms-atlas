// =============================================================================
// Collatz 最大步数统计
// 记忆化计算每个数的 Collatz 步数（n→1 所需步数）。
// 记录保持者：步数严格大于所有更小整数步数的数。
// =============================================================================

export interface CollatzMaxHooks {
  onCompute?: (n: number, steps: number) => void;
  onRecord?: (value: number, steps: number) => void;
  onResult?: (records: Array<{ value: number; steps: number }>) => void;
}

export interface CollatzMaxResult {
  /** 记录保持者序列（步数严格递增）。 */
  records: Array<{ value: number; steps: number }>;
  /** [1, limit] 中步数最大的数。 */
  best: { value: number; steps: number };
  /** 步数表 steps[i] = i 的步数。 */
  stepsTable: number[];
}

export function collatzStepsMemo(limit: number, hooks: CollatzMaxHooks = {}): CollatzMaxResult {
  if (limit < 1) {
    hooks.onResult?.([]);
    return { records: [], best: { value: 0, steps: 0 }, stepsTable: [] };
  }
  const steps = new Array<number>(limit + 1).fill(0);
  steps[1] = 0;

  // 计算单个数（用缓存；途中超过 limit 的中间值不缓存）
  const compute = (n: number): number => {
    if (n <= limit && steps[n]! > 0) return steps[n]!;
    // 迭代到落到已知范围
    const stack: number[] = [];
    let cur = n;
    while (true) {
      if (cur <= limit && steps[cur]! > 0) break;
      if (cur === 1) {
        steps[1] = 0;
        break;
      }
      stack.push(cur);
      cur = cur % 2 === 0 ? cur / 2 : 3 * cur + 1;
    }
    let base = cur <= limit ? steps[cur]! : 0;
    while (stack.length > 0) {
      const v = stack.pop()!;
      base += 1;
      if (v <= limit) steps[v] = base;
    }
    return steps[n]!;
  };

  const records: Array<{ value: number; steps: number }> = [];
  let bestSteps = -1;
  let bestValue = 0;
  for (let i = 1; i <= limit; i++) {
    const s = compute(i);
    hooks.onCompute?.(i, s);
    if (s > bestSteps) {
      bestSteps = s;
      bestValue = i;
      records.push({ value: i, steps: s });
      hooks.onRecord?.(i, s);
    }
  }

  hooks.onResult?.(records);
  return { records, best: { value: bestValue, steps: bestSteps }, stepsTable: steps };
}

/** 单个数的 Collatz 步数（无记忆化，独立计算）。 */
export function collatzStepCount(n: number): number {
  if (n < 1) return 0;
  let cur = n;
  let s = 0;
  const GUARD = 1e7;
  while (cur !== 1 && s < GUARD) {
    cur = cur % 2 === 0 ? cur / 2 : 3 * cur + 1;
    s++;
  }
  return s;
}

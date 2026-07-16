// =============================================================================
// 凸优化DP / 凸壳技巧（Convex Hull Trick）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 用途：优化形如 dp[i] = min/max_{j<i} ( m[j]*x[i] + b[j] ) 的 1D1D DP。
// 本实现：单调队列维护下凸壳，x[i] 单调递增，求最小值。
// =============================================================================

/** 一条直线 y = m*x + b，附带的来源下标 j。 */
export interface Line {
  m: number; // 斜率
  b: number; // 截距
  j: number; // 来源 dp 下标（用于回溯/说明）
}

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface ConvexHullTrickHooks {
  /** 向凸壳加入一条直线。 */
  onAddLine?: (line: Line, size: number) => void;
  /** 弹出栈顶（不再有效的）直线。 */
  onPopLine?: (line: Line, size: number) => void;
  /** 在 x 处查询最优直线（返回下标在 hull 中的位置及值）。 */
  onQuery?: (x: number, line: Line, val: number, i: number) => void;
}

/** 计算直线 l3 是否「无用」（其交点是否让 l2 变冗余）。 */
function isRedundant(l1: Line, l2: Line, l3: Line): boolean {
  // (b1-b3)/(m3-m1) >= (b1-b2)/(b2-m1) 用交叉乘避免浮点
  return (l3.b - l1.b) * (l2.m - l1.m) >= (l2.b - l1.b) * (l3.m - l1.m);
}

/**
 * 凸壳技巧：给定候选直线集合 lines（每条 y=m*x+b），
 * 对每个查询 x（按升序）求 `min(lines[j].m * x + lines[j].b)`。
 *
 * 约定：候选直线的斜率 m 按**递减**给出（求下凸壳 / 最小值）。
 * 查询 x 按**递增**给出 → 用单调指针 O(1) 摊销取最优。
 *
 * @param lines 候选直线（斜率递减；通常对应 dp 转移的来源）
 * @param queries 查询点 x 数组（递增）
 * @param hooks 可选事件钩子
 * @returns 每个 x 的最小函数值，及取得该值的来源直线（j 下标）。
 */
export function convexHullTrick(
  lines: readonly Line[],
  queries: readonly number[],
  hooks: ConvexHullTrickHooks = {},
): Array<{ val: number; from: Line }> {
  const hull: Line[] = [];
  const addLine = (line: Line): void => {
    while (hull.length >= 2 && isRedundant(hull[hull.length - 2]!, hull[hull.length - 1]!, line)) {
      const popped = hull.pop()!;
      hooks.onPopLine?.(popped, hull.length);
    }
    hull.push(line);
    hooks.onAddLine?.(line, hull.length);
  };

  for (const ln of lines) addLine(ln);

  const out: Array<{ val: number; from: Line }> = [];
  let ptr = 0;
  for (let i = 0; i < queries.length; i++) {
    const x = queries[i]!;
    // 弹出不再最优的队首（x 单调增）
    while (ptr + 1 < hull.length && evalAt(hull[ptr + 1]!, x) <= evalAt(hull[ptr]!, x)) ptr++;
    const best = hull[ptr]!;
    const val = evalAt(best, x);
    hooks.onQuery?.(x, best, val, i);
    out.push({ val, from: best });
  }
  return out;
}

function evalAt(line: Line, x: number): number {
  return line.m * x + line.b;
}

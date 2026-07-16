// =============================================================================
// Collatz 步数统计 · 纯算法实现
// Collatz（3n+1）猜想：n 偶则除 2，奇则 3n+1，最终回到 1。
// 本实现计算从 n 到 1 所需的步数与轨迹。
// 注意：与 misc/collatz-conjecture 区分，这里聚焦「步数」与轨迹展示。
// =============================================================================

export interface CollatzHooks {
  onStep?: (cur: number, step: number) => void;
  onResult?: (steps: number, trajectory: number[]) => void;
}

export interface CollatzResult {
  steps: number;
  trajectory: number[];
}

export function collatzSteps(n: number, hooks: CollatzHooks = {}): CollatzResult {
  if (!Number.isInteger(n) || n <= 0) {
    hooks.onResult?.(0, []);
    return { steps: 0, trajectory: [] };
  }
  const traj: number[] = [n];
  let cur = n;
  let step = 0;
  // 安全上限避免无限循环（虽猜想保证终止，但理论上未证）
  const GUARD = 1e7;
  while (cur !== 1 && step < GUARD) {
    if (cur % 2 === 0) cur = cur / 2;
    else cur = 3 * cur + 1;
    step++;
    traj.push(cur);
    hooks.onStep?.(cur, step);
  }
  hooks.onResult?.(step, traj);
  return { steps: step, trajectory: traj };
}

/** 计算 1..n 中步数最大的数（记录保持者）。 */
export function collatzMaxSteps(n: number): { value: number; steps: number } {
  let bestV = 1;
  let bestS = 0;
  for (let i = 1; i <= n; i++) {
    const { steps } = collatzSteps(i);
    if (steps > bestS) {
      bestS = steps;
      bestV = i;
    }
  }
  return { value: bestV, steps: bestS };
}

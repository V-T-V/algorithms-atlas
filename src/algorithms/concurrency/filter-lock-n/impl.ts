// =============================================================================
// n 线程过滤锁（Filter Lock）· 纯算法实现（步骤序列模拟）
// level[i] in [0..n-1], victim[L] in [0..n-1]。
// 线程 i 从 L=1 开始逐层推进；每层写 victim[L]=i 并等待直到
//   不存在 k!=i 使 level[k]>=L && victim[L]==i。
// =============================================================================

/** 步骤事件。 */
export interface FilterLockStep {
  /** 线程 id。 */
  thread: number;
  /** 'enterLevel' 尝试进入下一层（或穿过当前层）；'critical' 在临界区；'exit' 离开。 */
  action: 'enterLevel' | 'critical' | 'exit';
}

/** 事件钩子。 */
export interface FilterLockHooks {
  /** 线程 t 写 level[t]=L。 */
  onLevel?: (thread: number, level: number) => void;
  /** 线程 t 写 victim[L]=t。 */
  onVictim?: (thread: number, level: number) => void;
  /** 线程 t 在层 L 等待（因为有人 k 使 level[k]>=L 且 victim[L]==t）。给出冲突者集合。 */
  onWait?: (thread: number, level: number, conflictWith: number[]) => void;
  /** 线程 t 穿过层 L（进入下一层）。 */
  onPass?: (thread: number, level: number) => void;
  /** 线程 t 进入临界区。 */
  onEnter?: (thread: number) => void;
  /** 线程 t 离开临界区（level[t]=0）。 */
  onLeave?: (thread: number) => void;
}

/** 状态。 */
export interface FilterLockState {
  /** level[i]，0 表示空闲。 */
  level: number[];
  /** victim[L]。 */
  victim: number[];
  /** 各线程阶段：'idle'|'climbing'|'critical'。 */
  phase: string[];
  /** 当前在临界区的线程集合。 */
  inCritical: number[];
}

/**
 * 判断线程 t 在层 L 是否需要等待：
 * 存在 k!=t 使 level[k] >= L && victim[L] == t。
 */
function mustWait(
  level: number[],
  victim: number[],
  t: number,
  L: number,
): { wait: boolean; conflict: number[] } {
  const conflict: number[] = [];
  for (let k = 0; k < level.length; k++) {
    if (k === t) continue;
    if (level[k]! >= L) conflict.push(k);
  }
  const wait = conflict.length > 0 && victim[L] === t;
  return { wait, conflict };
}

/**
 * 按步骤序列推进过滤锁模拟。
 * 假设：n 个线程，level 数组长度 n，victim 数组长度 n。
 */
export function simulateFilterLock(
  n: number,
  steps: FilterLockStep[],
  hooks: FilterLockHooks = {},
): FilterLockState[] {
  const level = new Array<number>(n).fill(0);
  const victim = new Array<number>(n).fill(-1);
  const phase = new Array<string>(n).fill('idle');
  const inCritical: number[] = [];
  const snaps: FilterLockState[] = [];

  const snap = (): FilterLockState => ({
    level: [...level],
    victim: [...victim],
    phase: [...phase],
    inCritical: [...inCritical],
  });

  for (const step of steps) {
    const t = step.thread;
    if (step.action === 'enterLevel') {
      phase[t] = 'climbing';
      const L = level[t]! + 1; // 下一层
      if (L >= n) {
        // 已到顶层，进入临界区
        phase[t] = 'critical';
        inCritical.push(t);
        hooks.onEnter?.(t);
      } else {
        level[t] = L;
        hooks.onLevel?.(t, L);
        victim[L] = t;
        hooks.onVictim?.(t, L);
        const { wait, conflict } = mustWait(level, victim, t, L);
        if (wait) {
          hooks.onWait?.(t, L, conflict);
          // 保持在该层（不穿过），等待下次 enterLevel 重试
        } else {
          hooks.onPass?.(t, L);
          // 若已到顶层 n-1 之后即临界
          if (L === n - 1) {
            phase[t] = 'critical';
            inCritical.push(t);
            hooks.onEnter?.(t);
          }
        }
      }
    } else if (step.action === 'critical') {
      if (inCritical.includes(t)) phase[t] = 'critical';
    } else {
      // exit
      level[t] = 0;
      phase[t] = 'idle';
      const idx = inCritical.indexOf(t);
      if (idx >= 0) inCritical.splice(idx, 1);
      hooks.onLeave?.(t);
    }
    snaps.push(snap());
  }

  return snaps;
}

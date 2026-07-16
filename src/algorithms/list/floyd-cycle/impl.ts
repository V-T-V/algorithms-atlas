// =============================================================================
// Floyd 环检测（Floyd's Cycle Detection / 龟兔赛跑）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」暴露 slow/fast 指针每一步。
// =============================================================================

/** 把当前位置映射到下一个位置的「单步转移」函数（如链表 next 指针、函数图）。 */
export type NextFn = (pos: number) => number;

/** 算法执行过程中的事件钩子。任一可选。 */
export interface FloydHooks {
  /** 慢/快指针各走一步后的新位置（快指针每次走两步）。 */
  onStep?: (slow: number, fast: number) => void;
  /** 两指针相遇（检测到环）。meet = 相遇位置。 */
  onMeet?: (meet: number) => void;
  /** 找到环入口。 */
  onEntry?: (entry: number) => void;
}

export interface FloydResult {
  /** 是否存在环。 */
  hasCycle: boolean;
  /** 环入口位置；无环时为 -1。 */
  entry: number;
}

/**
 * Floyd 龟兔赛跑环检测。
 * @param start 起始位置
 * @param next  单步转移函数（约定 -1 表示终止/链尾）
 * @param hooks 可选事件钩子
 *
 * 分两阶段：
 *  - 阶段一：slow 每次走 1 步，fast 每次走 2 步；若两者相遇则有环。
 *  - 阶段二：把 slow 重置到 start，两者同速前进，相遇点即环入口。
 */
export function floydCycle(start: number, next: NextFn, hooks: FloydHooks = {}): FloydResult {
  const isTerm = (p: number): boolean => p < 0;

  // 阶段一：检测
  let slow = next(start);
  let fast = next(next(start));
  let meet = -1;
  let guard = 0;
  while (!isTerm(slow) && !isTerm(fast)) {
    hooks.onStep?.(slow, fast);
    if (slow === fast) {
      meet = slow;
      hooks.onMeet?.(meet);
      break;
    }
    slow = next(slow);
    fast = next(next(fast));
    if (++guard > 1_000_000) break; // 安全阀
  }

  if (meet === -1) {
    return { hasCycle: false, entry: -1 };
  }

  // 阶段二：找入口
  slow = start;
  guard = 0;
  while (slow !== fast) {
    hooks.onStep?.(slow, fast);
    slow = next(slow);
    fast = next(fast);
    if (++guard > 1_000_000) break;
  }
  hooks.onEntry?.(slow);
  return { hasCycle: true, entry: slow };
}

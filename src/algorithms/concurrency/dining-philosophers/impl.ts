// =============================================================================
// 哲学家就餐（Dining Philosophers）· 纯算法实现（确定性调度模拟）
// 零 DOM 依赖，可独立单测。用「资源分级」策略避免死锁，通过「钩子」暴露状态变化。
// =============================================================================

export type PhilosopherState = 'thinking' | 'hungry' | 'eating';

/** 算法执行过程中的事件钩子。任一可选。 */
export interface DiningHooks {
  /** 哲学家 i 开始思考。 */
  onThink?: (i: number) => void;
  /** 哲学家 i 饿了（想要叉子）。 */
  onHungry?: (i: number) => void;
  /** 哲学家 i 拿起叉子 fork。 */
  onPick?: (i: number, fork: number) => void;
  /** 哲学家 i 开始就餐（已拿到两把叉子）。 */
  onEat?: (i: number) => void;
  /** 哲学家 i 放下叉子 fork。 */
  onPut?: (i: number, fork: number) => void;
}

export interface DiningResult {
  /** 完成的就餐轮数（每个哲学家就餐一次算一轮）。 */
  roundsCompleted: number;
  /** 是否全程无死锁（资源分级保证为 true）。 */
  deadlockFree: boolean;
}

/**
 * 资源分级（资源排序）策略避免死锁：
 * 哲学家 i 的两把叉子编号为 i（左）和 (i+1)%n（右）。
 * 约定**先拿编号小的叉子，再拿编号大的**——打破「循环等待」条件。
 *
 * 这里用一个**确定性轮转调度**模拟：每「轮」让一个哲学家走完
 * hungry → pick(low) → pick(high) → eat → put(low) → put(high) → thinking 的全过程，
 * 之后再思考、轮到下一位。每个哲学家各就餐 `meals` 次。
 *
 * @param n 哲学家/叉子数量（n >= 2）
 * @param meals 每个哲学家就餐次数
 * @param hooks 可选事件钩子
 */
export function diningPhilosophers(
  n: number,
  meals: number,
  hooks: DiningHooks = {},
): DiningResult {
  if (n < 2) {
    return { roundsCompleted: 0, deadlockFree: true };
  }
  // forkHeld[fork] = 当前持有者哲学家编号，-1 = 空闲
  const forkHeld: number[] = new Array(n).fill(-1);

  const forksOf = (i: number): [number, number] => {
    const left = i;
    const right = (i + 1) % n;
    // 资源分级：始终先取编号小的
    return left < right ? [left, right] : [right, left];
  };

  let roundsCompleted = 0;
  // 轮转调度：依次让哲学家 0,1,...,n-1,0,1,... 就餐，直到每人吃完 meals 次
  const eaten = new Array(n).fill(0);
  let totalMeals = n * meals;

  while (totalMeals > 0) {
    for (let i = 0; i < n && totalMeals > 0; i++) {
      if (eaten[i]! >= meals) continue;

      // 饿了
      hooks.onHungry?.(i);
      const [low, high] = forksOf(i);
      // 拿编号小的叉子
      forkHeld[low] = i;
      hooks.onPick?.(i, low);
      // 拿编号大的叉子
      forkHeld[high] = i;
      hooks.onPick?.(i, high);
      // 就餐
      hooks.onEat?.(i);
      eaten[i]!++;
      totalMeals--;
      // 放下叉子（按反序）
      forkHeld[high] = -1;
      hooks.onPut?.(i, high);
      forkHeld[low] = -1;
      hooks.onPut?.(i, low);
      // 思考
      hooks.onThink?.(i);
      roundsCompleted++;
    }
  }

  return { roundsCompleted, deadlockFree: true };
}

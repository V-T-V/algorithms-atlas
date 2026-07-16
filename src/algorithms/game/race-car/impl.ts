// =============================================================================
// 赛车（Race Car, LeetCode 818）· 纯算法实现
// BFS 在 (position, speed) 状态空间求最短指令数。
// =============================================================================

/** 算法执行过程中的事件钩子。 */
export interface RaceCarHooks {
  /** 从某状态 (pos, speed) 出发扩展。 */
  onExpand?: (pos: number, speed: number, steps: number) => void;
  /** 找到目标，给出最短步数。 */
  onDone?: (target: number, steps: number) => void;
}

/**
 * 赛车：求到达 target 的最短指令数。
 *
 * @param target 目标位置（非负整数）
 * @param hooks 可选事件钩子
 * @returns 最短指令数
 */
export function raceCar(target: number, hooks: RaceCarHooks = {}): number {
  if (target === 0) return 0;
  // BFS
  // 状态：(position, speed)。位置范围限制在 [-(bound), 2*bound] 内剪枝。
  const bound = Math.max(target * 2, 4);
  const start = '0,1';
  const visited = new Set<string>([start]);
  // 队列存 [pos, speed]
  const queue: Array<{ pos: number; speed: number }> = [{ pos: 0, speed: 1 }];
  let steps = 0;

  while (queue.length > 0) {
    const sz = queue.length;
    for (let i = 0; i < sz; i++) {
      const { pos, speed } = queue.shift()!;
      hooks.onExpand?.(pos, speed, steps);
      if (pos === target) {
        hooks.onDone?.(target, steps);
        return steps;
      }
      // 指令 A
      const aPos = pos + speed;
      const aSpeed = speed * 2;
      if (Math.abs(aPos) <= bound) {
        const key = `${aPos},${aSpeed}`;
        if (!visited.has(key)) {
          visited.add(key);
          queue.push({ pos: aPos, speed: aSpeed });
        }
      }
      // 指令 R
      const rSpeed = speed > 0 ? -1 : 1;
      const key = `${pos},${rSpeed}`;
      if (!visited.has(key)) {
        visited.add(key);
        queue.push({ pos, speed: rSpeed });
      }
    }
    steps++;
  }
  return -1; // 不应到达
}

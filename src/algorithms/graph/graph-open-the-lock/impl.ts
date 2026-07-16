// =============================================================================
// 打开转盘锁 · 纯算法实现（BFS）
// =============================================================================

export interface OpenLockHooks {
  onVisit?: (state: string, dist: number) => void;
  onResult?: (steps: number) => void;
}

export function openLock(deadends: string[], target: string, hooks: OpenLockHooks = {}): number {
  const dead = new Set(deadends);
  const start = '0000';
  if (dead.has(start)) {
    hooks.onResult?.(-1);
    return -1;
  }
  if (start === target) {
    hooks.onVisit?.(start, 0);
    hooks.onResult?.(0);
    return 0;
  }
  const visited = new Set<string>([start]);
  const queue: Array<[string, number]> = [[start, 0]];
  while (queue.length > 0) {
    const [state, dist] = queue.shift()!;
    for (const next of neighbors(state)) {
      if (visited.has(next) || dead.has(next)) continue;
      if (next === target) {
        hooks.onVisit?.(next, dist + 1);
        hooks.onResult?.(dist + 1);
        return dist + 1;
      }
      visited.add(next);
      hooks.onVisit?.(next, dist + 1);
      queue.push([next, dist + 1]);
    }
  }
  hooks.onResult?.(-1);
  return -1;
}

function neighbors(state: string): string[] {
  const res: string[] = [];
  const arr = state.split('');
  for (let i = 0; i < 4; i++) {
    const d = Number(arr[i]);
    const up = (d + 1) % 10;
    const down = (d + 9) % 10;
    const saved = arr[i]!;
    arr[i] = String(up);
    res.push(arr.join(''));
    arr[i] = String(down);
    res.push(arr.join(''));
    arr[i] = saved;
  }
  return res;
}

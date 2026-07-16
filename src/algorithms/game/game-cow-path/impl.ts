// 奶牛路径 · 实现 (deterministic doubling, competitive ratio 9)
export interface CowPathHooks {
  onProbe?: (dir: 1 | -1, dist: number, total: number) => void;
  onFound?: (dir: 1 | -1, total: number) => void;
}
export function cowPath(
  target: number,
  hooks: CowPathHooks = {},
): { total: number; dir: 1 | -1; ratio: number } {
  const opt = Math.abs(target);
  let step = 1,
    total = 0,
    dir: 1 | -1 = 1;
  for (;;) {
    // go right
    total += step;
    hooks.onProbe?.(1, step, total);
    if (target >= 0 && target <= step) {
      dir = 1;
      hooks.onFound?.(dir, total + (step - target));
      total = total + (step - target) - step + target;
      break;
    }
    total += step; // back to origin
    // go left
    total += step * 2;
    hooks.onProbe?.(-1, step * 2, total);
    if (target < 0 && -target <= step * 2) {
      dir = -1;
      hooks.onFound?.(dir, total + (step * 2 + target));
      total = total + (step * 2 + target) - (step * 2 + target);
      break;
    }
    total += step * 2; // back to origin
    step *= 2;
    if (step > 1e9) break;
  }
  const walked = total > 0 ? total : opt * 9;
  return { total: walked, dir, ratio: walked / opt };
}

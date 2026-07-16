// =============================================================================
// 困惑数 II · 纯算法实现 (LeetCode 1088)
// 用 0/1/6/8/9 回溯构造所有 ≤ n 的数，旋转后与原值不同即「困惑数」。
// =============================================================================
export interface BtConfusingNumber2Hooks {
  onCandidate?: (value: number, rotated: number) => void;
  onConfusing?: (value: number) => void;
}

const DIGITS = [0, 1, 6, 8, 9];
const ROTATE: Record<number, number> = { 0: 0, 1: 1, 6: 9, 8: 8, 9: 6 };

function rotate(n: number): number {
  let original = n;
  let r = 0;
  while (original > 0) {
    r = r * 10 + ROTATE[original % 10]!;
    original = Math.floor(original / 10);
  }
  return r;
}

export function btConfusingNumber2(n: number, hooks: BtConfusingNumber2Hooks = {}): number {
  let count = 0;

  const backtrack = (cur: number): void => {
    if (cur > n) return;
    if (cur > 0) {
      const rot = rotate(cur);
      hooks.onCandidate?.(cur, rot);
      if (rot !== cur) {
        count++;
        hooks.onConfusing?.(cur);
      }
    }
    for (const d of DIGITS) {
      const next = cur * 10 + d;
      if (next === 0) continue; // 避免无限递归在 0
      if (next > n) continue;
      backtrack(next);
    }
  };

  backtrack(0);
  return count;
}

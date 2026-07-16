// =============================================================================
// 编辑距离 + 回溯
// =============================================================================

export type EditOp = 'keep' | 'replace' | 'delete' | 'insert';

export interface EditDistHooks {
  onCell?: (i: number, j: number, val: number, op: EditOp) => void;
  onDone?: (dist: number) => void;
}

export interface EditDistResult {
  distance: number;
  ops: EditOp[];
}

export function editDistBacktrack(
  s1: string,
  s2: string,
  hooks: EditDistHooks = {},
): EditDistResult {
  const n = s1.length;
  const m = s2.length;
  const dp: number[][] = Array.from({ length: n + 1 }, (_, i) =>
    Array.from({ length: m + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0)),
  );
  const choice: EditOp[][] = Array.from({ length: n + 1 }, () =>
    new Array<EditOp>(m + 1).fill('keep'),
  );
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      if (s1[i - 1] === s2[j - 1]) {
        dp[i]![j] = dp[i - 1]![j - 1]!;
        choice[i]![j] = 'keep';
      } else {
        const replace = dp[i - 1]![j - 1]! + 1;
        const del = dp[i - 1]![j]! + 1;
        const ins = dp[i]![j - 1]! + 1;
        const best = Math.min(replace, del, ins);
        dp[i]![j] = best;
        choice[i]![j] = best === replace ? 'replace' : best === del ? 'delete' : 'insert';
      }
      hooks.onCell?.(i, j, dp[i]![j]!, choice[i]![j]!);
    }
  }
  // 回溯
  const ops: EditOp[] = [];
  let i = n;
  let j = m;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && choice[i]![j] === 'keep') {
      ops.push('keep');
      i--;
      j--;
    } else if (i > 0 && j > 0 && choice[i]![j] === 'replace') {
      ops.push('replace');
      i--;
      j--;
    } else if (i > 0 && (j === 0 || choice[i]![j] === 'delete')) {
      ops.push('delete');
      i--;
    } else {
      ops.push('insert');
      j--;
    }
  }
  ops.reverse();
  hooks.onDone?.(dp[n]![m]!);
  return { distance: dp[n]![m]!, ops };
}

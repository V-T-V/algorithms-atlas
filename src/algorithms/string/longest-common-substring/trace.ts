// =============================================================================
// 最长公共子串 · 录制帧序列
// setGrid 展示 (n+1)×(m+1) DP 矩阵；setAux 展示当前最优子串。
// =============================================================================

import type { BarRole, Cell, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { longestCommonSubstring, type LcsHooks } from './impl.ts';

export const DEFAULT_INPUT: { a: string; b: string } = { a: 'abcdef', b: 'zcdem' };

/** 录制演示帧序列。 */
export function buildTrace(input: { a: string; b: string } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { a, b } = input;
  const n = a.length;
  const m = b.length;
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array<number>(m + 1).fill(0));
  let ci = -1;
  let cj = -1;
  let bestLen = 0;
  let bestEndA = -1;
  let roleTip: BarRole = 'default';

  const render = (note: { zh: string; en: string }): void => {
    const rows: Array<Array<string | number | undefined>> = [['', 'ε', ...Array.from(b)]];
    const roles: Record<string, BarRole> = {};
    if (ci >= 0) roles[`${ci},${cj}`] = roleTip;
    for (let i = 0; i <= n; i++) {
      const row: Array<string | number | undefined> = [i === 0 ? 'ε' : a[i - 1]!];
      for (let j = 0; j <= m; j++) row.push(dp[i]![j]!);
      rows.push(row);
    }
    const grid: Cell[][] = rec.gridFrom(rows, roles);
    const sub = bestLen > 0 ? a.slice(bestEndA - bestLen + 1, bestEndA + 1) : '-';
    rec
      .begin(note)
      .setGrid(grid)
      .setAux([
        { label: 'a', value: a },
        { label: 'b', value: b },
        { label: 'best', value: sub, role: 'final' },
      ])
      .commit();
    roleTip = 'default';
  };

  render({ zh: `公共子串 DP：${a} vs ${b}`, en: `Common substring DP: ${a} vs ${b}` });

  const hooks: LcsHooks = {
    onCell: (i, j, val) => {
      dp[i]![j] = val;
      ci = i;
      cj = j;
      roleTip = val > 0 ? 'compare' : 'default';
    },
    onBest: (len, endA) => {
      bestLen = len;
      bestEndA = endA;
      roleTip = 'final';
      render({ zh: `新最长 = ${len}`, en: `New best = ${len}` });
    },
    onDone: () => {},
  };

  longestCommonSubstring(a, b, hooks);

  ci = -1;
  render({
    zh: `完成：最长公共子串 '${a.slice(bestEndA - bestLen + 1, bestEndA + 1)}'`,
    en: `Done: '${a.slice(bestEndA - bestLen + 1, bestEndA + 1)}'`,
  });
  return rec.build();
}

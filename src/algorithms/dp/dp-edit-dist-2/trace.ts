// =============================================================================
// Damerau-Levenshtein 距离 · 录制帧序列
import type { Cell, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { damerauLevenshtein, type DamerauHooks } from './impl.ts';

export const DEFAULT_S1 = 'ca';
export const DEFAULT_S2 = 'abc';

export function buildTrace(s1: string = DEFAULT_S1, s2: string = DEFAULT_S2): Frame[] {
  const rec = new TraceRecorder();
  const n = s1.length;
  const m = s2.length;
  const grid: number[][] = Array.from({ length: n + 1 }, () => new Array<number>(m + 1).fill(0));
  for (let i = 0; i <= n; i++) grid[i]![0] = i;
  for (let j = 0; j <= m; j++) grid[0]![j] = j;
  let pi = -1;
  let pj = -1;
  let lastSwap = false;
  let ans = 0;

  const render = (note: { zh: string; en: string }): void => {
    const rows: Cell[][] = grid.map((row, i) =>
      row.map((v, j) => ({
        v: String(v),
        role: (i === pi && j === pj
          ? lastSwap
            ? 'swap'
            : 'pivot'
          : i === 0 || j === 0
            ? 'frontier'
            : 'default') as Cell['role'],
      })),
    );
    rec
      .begin(note)
      .setGrid(rows)
      .setAux([
        { label: 's1', value: s1, role: 'frontier' },
        { label: 's2', value: s2, role: 'frontier' },
        { label: '当前操作', value: lastSwap ? '交换' : '常规', role: 'pivot' },
      ])
      .commit();
  };

  render({ zh: `初始化`, en: `Init` });

  const hooks: DamerauHooks = {
    onSwap: () => {
      lastSwap = true;
    },
    onCell: (i, j, v) => {
      grid[i]![j] = v;
      pi = i;
      pj = j;
      render({
        zh: `dp[${i}][${j}]=${v}${lastSwap ? '(含交换)' : ''}`,
        en: `dp[${i}][${j}]=${v}${lastSwap ? ' (swap)' : ''}`,
      });
      lastSwap = false;
    },
    onDone: (d) => {
      ans = d;
      pi = -1;
      pj = -1;
      render({ zh: `距离=${d}`, en: `distance=${d}` });
    },
  };

  damerauLevenshtein(s1, s2, hooks);

  rec
    .begin({ zh: `完成：${ans}`, en: `Done: ${ans}` })
    .setAux([{ label: 'Damerau 距离', value: String(ans), role: 'final' }])
    .commit();

  return rec.build();
}

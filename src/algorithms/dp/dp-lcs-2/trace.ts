// =============================================================================
// 最短公共超序列 · 录制帧序列
import type { Cell, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { scsLength, type ScsHooks } from './impl.ts';

export const DEFAULT_S1 = 'AGGTAB';
export const DEFAULT_S2 = 'GXTXAYB';

export function buildTrace(s1: string = DEFAULT_S1, s2: string = DEFAULT_S2): Frame[] {
  const rec = new TraceRecorder();
  const n = s1.length;
  const m = s2.length;
  const grid: number[][] = Array.from({ length: n + 1 }, () => new Array<number>(m + 1).fill(0));
  for (let i = 0; i <= n; i++) grid[i]![m] = n - i;
  for (let j = 0; j <= m; j++) grid[0]![j] = m - j;
  let pi = -1;
  let pj = -1;
  let ans = 0;

  const render = (note: { zh: string; en: string }): void => {
    const rows: Cell[][] = grid.map((row, i) =>
      row.map((v, j) => ({
        v: String(v),
        role: (i === pi && j === pj
          ? 'pivot'
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
      ])
      .commit();
  };

  render({ zh: `初始化边界`, en: `Init borders` });

  const hooks: ScsHooks = {
    onCell: (i, j, v) => {
      grid[i]![j] = v;
      pi = i;
      pj = j;
      render({ zh: `dp[${i}][${j}]=${v}`, en: `dp[${i}][${j}]=${v}` });
    },
    onDone: (l) => {
      ans = l;
      pi = -1;
      pj = -1;
      render({ zh: `SCS 长度=${l}`, en: `SCS length=${l}` });
    },
  };

  scsLength(s1, s2, hooks);

  rec
    .begin({ zh: `完成：${ans}`, en: `Done: ${ans}` })
    .setAux([{ label: 'SCS 长度', value: String(ans), role: 'final' }])
    .commit();

  return rec.build();
}

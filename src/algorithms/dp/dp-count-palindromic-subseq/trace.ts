// =============================================================================
// 回文子序列计数 · 录制帧序列
import type { Cell, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { countPalindromicSubseq, type CountPalinSubseqHooks } from './impl.ts';

export const DEFAULT_S = 'abba';

export function buildTrace(s: string = DEFAULT_S): Frame[] {
  const rec = new TraceRecorder();
  const n = s.length;
  const grid: number[][] = Array.from({ length: n }, () => new Array<number>(n).fill(0));
  let pi = -1;
  let pj = -1;
  let ans = 0;

  const render = (note: { zh: string; en: string }): void => {
    const rows: Cell[][] = grid.map((row, i) =>
      row.map((v, j) => ({
        v: i <= j ? String(v) : '',
        role: (i === pi && j === pj ? 'pivot' : i === j ? 'frontier' : 'default') as Cell['role'],
      })),
    );
    rec
      .begin(note)
      .setGrid(rows)
      .setAux([{ label: '当前区间', value: pi < 0 ? '-' : `[${pi},${pj}]`, role: 'pivot' }])
      .commit();
  };

  render({ zh: `s="${s}"`, en: `s="${s}"` });

  const hooks: CountPalinSubseqHooks = {
    onCell: (i, j, val) => {
      grid[i]![j] = val;
      pi = i;
      pj = j;
      render({ zh: `dp[${i}][${j}]=${val}`, en: `dp[${i}][${j}]=${val}` });
    },
    onDone: (t) => {
      ans = t;
      pi = -1;
      pj = -1;
      render({ zh: `总数=${t}`, en: `total=${t}` });
    },
  };

  countPalindromicSubseq(s, hooks);

  rec
    .begin({ zh: `完成：${ans}`, en: `Done: ${ans}` })
    .setAux([{ label: '回文子序列数', value: String(ans), role: 'final' }])
    .commit();

  return rec.build();
}

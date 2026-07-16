// =============================================================================
// 编辑距离 · 录制帧序列
import type { Cell, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { editDistBacktrack, type EditDistHooks, type EditDistResult } from './impl.ts';

export const DEFAULT_INPUT = { s1: 'horse', s2: 'ros' };

export function buildTrace(input: { s1: string; s2: string } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { s1, s2 } = input;
  const n = s1.length;
  const m = s2.length;
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array<number>(m + 1).fill(0));
  for (let i = 0; i <= n; i++) dp[i]![0] = i;
  for (let j = 0; j <= m; j++) dp[0]![j] = j;
  let cur = { i: 0, j: 0 };
  let ans: EditDistResult = { distance: 0, ops: [] };

  const snap = (note: { zh: string; en: string }): void => {
    const grid: Cell[][] = dp.map((row, i) =>
      row.map((v, j) => ({
        v: String(v),
        role: i === cur.i && j === cur.j ? 'compare' : 'default',
      })),
    );
    rec
      .begin(note)
      .setGrid(grid)
      .setAux([
        { label: 's1', value: s1, role: 'frontier' },
        { label: 's2', value: s2, role: 'frontier' },
      ])
      .commit();
  };

  snap({ zh: `s1=${s1} → s2=${s2}`, en: `s1=${s1} → s2=${s2}` });

  const hooks: EditDistHooks = {
    onCell: (i, j, val) => {
      dp[i]![j] = val;
      cur = { i, j };
      snap({
        zh: `dp[${i}][${j}]=${val}`,
        en: `dp[${i}][${j}]=${val}`,
      });
    },
    onDone: (d) => {
      ans = { distance: d, ops: ans.ops };
    },
  };

  ans = editDistBacktrack(s1, s2, hooks);

  rec
    .begin({
      zh: `距离=${ans.distance} 操作=${ans.ops.join('→')}`,
      en: `dist=${ans.distance} ops=${ans.ops.join('>')}`,
    })
    .setAux([{ label: '操作序列', value: ans.ops.join(' '), role: 'final' }])
    .commit();

  return rec.build();
}

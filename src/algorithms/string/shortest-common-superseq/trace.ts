// =============================================================================
// 最短公共超序列 · 录制帧序列
// setGrid 展示 LCS 长度矩阵；setAux 展示回溯构造的超序列。
// =============================================================================

import type { BarRole, Cell, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { shortestCommonSuperseq, type ScsHooks } from './impl.ts';

export const DEFAULT_INPUT: { a: string; b: string } = { a: 'abac', b: 'cab' };

/** 录制演示帧序列。 */
export function buildTrace(input: { a: string; b: string } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { a, b } = input;
  const n = a.length;
  const m = b.length;
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array<number>(m + 1).fill(0));
  let ci = -1;
  let cj = -1;
  let btI = -1;
  let btJ = -1;
  let roleTip: BarRole = 'default';
  const builtRev: string[] = [];

  const render = (note: { zh: string; en: string }): void => {
    const rows: Array<Array<string | number | undefined>> = [['', 'ε', ...Array.from(b)]];
    const roles: Record<string, BarRole> = {};
    if (ci >= 0) roles[`${ci},${cj}`] = roleTip;
    if (btI >= 0) roles[`${btI},${btJ}`] = 'final';
    for (let i = 0; i <= n; i++) {
      const row: Array<string | number | undefined> = [i === 0 ? 'ε' : a[i - 1]!];
      for (let j = 0; j <= m; j++) row.push(dp[i]![j]!);
      rows.push(row);
    }
    const grid: Cell[][] = rec.gridFrom(rows, roles);
    rec
      .begin(note)
      .setGrid(grid)
      .setAux([
        { label: 'a', value: a },
        { label: 'b', value: b },
        { label: 'superseq', value: [...builtRev].reverse().join('') || '-', role: 'final' },
      ])
      .commit();
    roleTip = 'default';
  };

  render({ zh: `最短公共超序列：${a} / ${b}`, en: `SCS: ${a} / ${b}` });

  const hooks: ScsHooks = {
    onCell: (i, j, val) => {
      dp[i]![j] = val;
      ci = i;
      cj = j;
    },
    onBacktrack: (i, j, ch) => {
      btI = i;
      btJ = j;
      builtRev.push(ch);
      roleTip = 'final';
      render({ zh: `回溯放入 '${ch}'`, en: `Backtrack put '${ch}'` });
    },
    onDone: () => {},
  };

  shortestCommonSuperseq(a, b, hooks);

  ci = -1;
  btI = -1;
  render({ zh: '完成', en: 'Done' });
  return rec.build();
}

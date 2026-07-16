// =============================================================================
// 第二类 Stirling 数 · 录制帧序列
// 通过 stirling2 的钩子，把填表过程录成 Frame[]。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { stirling2, type Stirling2Hooks } from './impl.ts';

export const DEFAULT_INPUT = { n: 5, k: 3 };

/** 录制演示帧序列：填 S(i, j) 表。 */
export function buildTrace(input: { n: number; k: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { n, k } = input;

  // 当前表格快照：rows[i][j]
  const grid: Array<Array<string | number | undefined>> = [];
  for (let i = 0; i <= n; i++) {
    grid.push(new Array(k + 1).fill(undefined));
    grid[i]![0] = i === 0 ? 1 : 0;
  }
  // 表头
  const header = ['n\\k', ...Array.from({ length: k + 1 }, (_, j) => String(j))];

  const snapshot = (note: { zh: string; en: string }, hi: number, hj: number): void => {
    const roles: Record<string, BarRole> = {};
    if (hi >= 0) roles[`${hi},${hj}`] = 'compare';
    const rows = [
      header,
      ...grid.map((r, i) => [String(i), ...r] as Array<string | number | undefined>),
    ];
    rec.begin(note).setGrid(rec.gridFrom(rows, roles)).commit();
  };

  snapshot(
    {
      zh: `填表 S(n,k)：把 n 个元素分成 k 个非空集合`,
      en: `Fill S(n,k): partition n elements into k non-empty sets`,
    },
    -1,
    -1,
  );

  const hooks: Stirling2Hooks = {
    onCell: (i, j, value) => {
      grid[i]![j] = Number(value);
      snapshot(
        {
          zh: `S(${i},${j}) = ${j}·S(${i - 1},${j}) + S(${i - 1},${j - 1}) = ${value}`,
          en: `S(${i},${j}) = ${j}·S(${i - 1},${j}) + S(${i - 1},${j - 1}) = ${value}`,
        },
        i,
        j,
      );
    },
  };

  const dp = stirling2(n, k, hooks);

  rec
    .begin({ zh: `结果：S(${n},${k}) = ${dp[n]![k]}`, en: `Result: S(${n},${k}) = ${dp[n]![k]}` })
    .setGrid(
      rec.gridFrom([
        header,
        ...grid.map((r, i) => [String(i), ...r] as Array<string | number | undefined>),
      ]),
    )
    .commit();

  return rec.build();
}

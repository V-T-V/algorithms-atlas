// =============================================================================
// Damerau-Levenshtein 距离 · 录制帧序列
// 用 setGrid 展示 (la+1)×(lb+1) 的 DP 矩阵，当前格高亮（交换时特殊色）。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { damerau, type DamerauHooks } from './impl.ts';

export const DEFAULT_INPUT: { a: string; b: string } = {
  a: 'CA',
  b: 'ABC',
};

const roleOf = (op: string): BarRole =>
  op === 'match'
    ? 'compare'
    : op === 'replace'
      ? 'warn'
      : op === 'insert'
        ? 'frontier'
        : op === 'delete'
          ? 'swap'
          : op === 'swap'
            ? 'pivot'
            : 'default';

/** 录制演示帧序列。 */
export function buildTrace(input: { a: string; b: string } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { a, b } = input;
  const la = a.length;
  const lb = b.length;
  let ci = -1;
  let cj = -1;
  let lastOp = 'default';

  const dp: number[][] = Array.from({ length: la + 1 }, (_, i) =>
    Array.from({ length: lb + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0)),
  );

  const render = (
    note: { zh: string; en: string },
    extraRoles: Record<string, BarRole> = {},
  ): void => {
    const rows: Array<Array<string | number | undefined>> = [['', 'ε', ...Array.from(b)]];
    const roles: Record<string, BarRole> = { ...extraRoles };
    if (ci >= 0) roles[`${ci},${cj}`] = roleOf(lastOp);
    for (let i = 0; i <= la; i++) {
      const row: Array<string | number | undefined> = [i === 0 ? 'ε' : a[i - 1]!];
      for (let j = 0; j <= lb; j++) row.push(dp[i]![j]!);
      rows.push(row);
    }
    rec.begin(note).setGrid(rec.gridFrom(rows, roles)).commit();
  };

  render({ zh: `把 "${a}" 变成 "${b}"：初始化边界`, en: `Turn "${a}" into "${b}": init borders` });

  const hooks: DamerauHooks = {
    onSource: (i, j, op) => {
      ci = i;
      cj = j;
      lastOp = op;
    },
    onCell: (i, j, cost) => {
      dp[i]![j] = cost;
      ci = i;
      cj = j;
      render({
        zh: `dp[${i}][${j}] = ${cost}（来自 ${lastOp}）`,
        en: `dp[${i}][${j}] = ${cost} (from ${lastOp})`,
      });
    },
  };

  damerau(a, b, hooks);

  ci = la;
  cj = lb;
  lastOp = 'final';
  render(
    { zh: `完成：距离 = ${dp[la]![lb]!}`, en: `Done: distance = ${dp[la]![lb]!}` },
    { [`${la},${lb}`]: 'final' },
  );

  return rec.build();
}

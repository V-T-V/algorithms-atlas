// =============================================================================
// 单纯形法（线性规划）· 录制帧序列
// setGrid 展示单纯形表，setAux 展示当前基与目标值。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { simplexMethod, demoProblem, type SimplexHooks } from './impl.ts';

export const DEFAULT_INPUT = { useDemo: true };

export function buildTrace(_input: { useDemo?: boolean } = {}): Frame[] {
  const rec = new TraceRecorder();
  const { A, b, c, expectZ } = demoProblem();

  const snapshot = (
    note: { zh: string; en: string },
    tableau: number[][] | null,
    iter: number,
    obj: number,
  ) => {
    rec.begin(note);
    if (tableau) {
      const n = c.length;
      const m = A.length;
      const header = [
        '',
        ...Array.from({ length: n }, (_, j) => `x${j + 1}`),
        ...Array.from({ length: m }, (_, j) => `s${j + 1}`),
        'RHS',
      ];
      const rows: Array<Array<string | number | undefined>> = [header];
      rows.push(['z', ...tableau[0]!.slice(0, n + m + 1).map((v) => v.toFixed(1))]);
      for (let i = 1; i <= m; i++) {
        rows.push([`s${i}`, ...tableau[i]!.slice(0, n + m + 1).map((v) => v.toFixed(1))]);
      }
      rec.setGrid(rows.map((row) => row.map((v) => ({ v, role: 'default' as BarRole }))));
    }
    rec.setAux([
      { label: '迭代', value: String(iter), role: 'pivot' as BarRole },
      { label: '当前 z', value: obj.toFixed(2), role: 'final' as BarRole },
      { label: '理论最优', value: expectZ.toFixed(2), role: 'compare' as BarRole },
    ]);
    rec.commit();
  };

  snapshot(
    { zh: `初始单纯形表：max ${c.join('x+')}x`, en: `Initial tableau: max ${c.join('x+')}x` },
    null,
    0,
    0,
  );

  const hooks: SimplexHooks = {
    onPivot: (iter, pivotRow, pivotCol, tableau) => {
      snapshot(
        {
          zh: `第 ${iter + 1} 次旋转：进基列 ${pivotCol}，离基行 ${pivotRow}`,
          en: `Pivot ${iter + 1}: entering col ${pivotCol}, leaving row ${pivotRow}`,
        },
        tableau,
        iter + 1,
        -tableau[0]!.at(-1)!,
      );
    },
  };

  const result = simplexMethod(A, b, c, {}, hooks);

  // 终态
  rec
    .begin({
      zh: result.optimal
        ? `最优解 x=[${result.solution.map((v) => v.toFixed(2)).join(', ')}]，z=${result.optimalValue.toFixed(2)}（${result.iterations} 次旋转）`
        : `未达最优`,
      en: result.optimal
        ? `Optimal x=[${result.solution.map((v) => v.toFixed(2)).join(', ')}], z=${result.optimalValue.toFixed(2)} (${result.iterations} pivots)`
        : `Not optimal`,
    })
    .setBars(
      result.solution.map((v, i) => ({
        value: v,
        role: 'final' as BarRole,
        label: `x${i + 1}=${v.toFixed(1)}`,
      })),
    )
    .setAux([
      { label: '最优 z', value: result.optimalValue.toFixed(2), role: 'final' as BarRole },
      { label: '理论最优', value: expectZ.toFixed(2), role: 'compare' as BarRole },
    ])
    .commit();

  return rec.build();
}

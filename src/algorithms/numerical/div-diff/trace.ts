// =============================================================================
// 差商 · 录制帧序列
// 演示差商表的逐阶填充；setGrid 展示整张三角表，末帧标出对角线。
// =============================================================================

import type { BarRole, Cell, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { divDiff, type DivDiffHooks } from './impl.ts';

// 用 y = x² 做演示：x=[0,1,2,3], y=[0,1,4,9]
export const DEFAULT_INPUT = {
  xs: [0, 1, 2, 3],
  ys: [0, 1, 4, 9],
};

/** 录制演示帧序列。 */
export function buildTrace(input: { xs: number[]; ys: number[] } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { xs, ys } = input;
  const n = xs.length;

  // 差商表 table[i][k] = f[xi..xi+k]，未填处用空串；第 0 列为 y
  const table: Cell[][] = ys.map((y) => [{ v: y.toFixed(4), role: 'pivot' as BarRole }]);
  for (let i = 0; i < n; i++)
    for (let k = 1; k < n; k++) table[i]!.push({ v: '', role: 'default' });

  const renderGrid = (
    note: { zh: string; en: string },
    highlight?: { i: number; k: number },
  ): void => {
    if (highlight)
      table[highlight.i]![highlight.k] = { ...table[highlight.i]![highlight.k], role: 'frontier' };
    rec
      .begin(note)
      .setGrid(table.map((row) => row.map((c) => ({ v: c.v, role: c.role }))))
      .commit();
  };

  renderGrid({
    zh: `初始：第 0 列为函数值 y（共 ${n} 个节点）`,
    en: `Init: column 0 holds y-values (${n} nodes)`,
  });

  const hooks: DivDiffHooks = {
    onCell: (i, k, value) => {
      table[i]![k] = { v: value.toFixed(4), role: 'frontier' };
      renderGrid({
        zh: `计算 f[x${i - k}..x${i}] = (${table[i]![k - 1]!.v || '?'} − ${table[i - 1]![k - 1]!.v || '?'}) / (x${i} − x${i - k}) = ${value.toFixed(4)}`,
        en: `Compute f[x${i - k}..x${i}] = ${value.toFixed(4)}`,
      });
      table[i]![k] = { v: value.toFixed(4), role: 'compare' };
    },
  };

  const coef = divDiff(xs, ys, hooks);

  // 标出对角线
  for (let k = 0; k < n; k++) table[k]![k] = { v: coef[k]!.toFixed(4), role: 'final' };
  rec
    .begin({
      zh: `完成：对角线系数 = ${coef.map((c) => c.toFixed(4)).join(', ')}（牛顿插值系数）`,
      en: `Done: diagonal coefficients = ${coef.map((c) => c.toFixed(4)).join(', ')}`,
    })
    .setGrid(table)
    .setAux(
      coef.map((c, k) => ({
        label: `f[x0..x${k}]`,
        value: c.toFixed(6),
        role: 'final' as BarRole,
      })),
    )
    .commit();

  return rec.build();
}

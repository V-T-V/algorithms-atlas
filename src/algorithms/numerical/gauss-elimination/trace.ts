// =============================================================================
// 高斯消元 · 录制帧序列
// 用 setGrid 展示增广矩阵（主元=pivot，消元行=compare，结果列=final），
// setAux 展示当前阶段与解。
// 默认演示：解 3×3 方程组。
//   2x +  y -  z =  8
//   -3x -  y + 2z = -11
//   -2x +  y + 2z = -3
// 解：x=2, y=3, z=-1
// =============================================================================

import type { BarRole, Cell, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { gaussElimination, type GaussHooks } from './impl.ts';

export const DEFAULT_INPUT: number[][] = [
  [2, 1, -1, 8],
  [-3, -1, 2, -11],
  [-2, 1, 2, -3],
];

/** 把数值格式化为网格单元显示文本。 */
function fmt(v: number): string {
  if (Number.isInteger(v)) return String(v);
  return v.toFixed(3);
}

/** 把当前矩阵 + 高亮信息画成网格。 */
function gridSnapshot(
  M: readonly (readonly number[])[],
  opts: {
    pivot?: [number, number]; // [row, col]
    eliminateRows?: number[]; // 正在消元的行
    finalCol?: boolean; // 最后一列标 final
  },
): Cell[][] {
  const elimSet = new Set(opts.eliminateRows ?? []);
  const cols = M[0]?.length ?? 0;
  return M.map((row, r) =>
    row.map((v, c) => {
      let role: BarRole = 'default';
      if (opts.pivot && opts.pivot[0] === r && opts.pivot[1] === c) role = 'pivot';
      else if (elimSet.has(r) && c === opts.pivot?.[1]) role = 'compare';
      else if (opts.finalCol && c === cols - 1) role = 'final';
      return { v: fmt(v), role };
    }),
  );
}

/** 录制演示帧序列。 */
export function buildTrace(input: number[][] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  // 维护一份可变矩阵镜像（与 impl 内部演化同步）
  const M: number[][] = input.map((row) => [...row]);
  const n = M.length;
  const cols = M[0]!.length;

  rec
    .begin({
      zh: `增广矩阵 [A | b]：${n}×${n} 方程组`,
      en: `Augmented matrix [A | b]: ${n}×${n} system`,
    })
    .setGrid(gridSnapshot(M, { finalCol: false }))
    .setAux([
      { label: '阶段 / phase', value: '前向消元（部分主元法）', role: 'pivot' },
      { label: '主元策略', value: '选列内绝对值最大者', role: 'compare' },
    ])
    .commit();

  let phase = '前向消元';

  const hooks: GaussHooks = {
    onPivot: (col, pivotRow, pivotValue) => {
      rec
        .begin({
          zh: `第 ${col + 1} 列选主元：第 ${pivotRow + 1} 行，主元 = ${fmt(pivotValue)}`,
          en: `Col ${col + 1} pivot: row ${pivotRow + 1}, pivot = ${fmt(pivotValue)}`,
        })
        .setGrid(gridSnapshot(M, { pivot: [pivotRow, col] }))
        .setAux([
          { label: '阶段 / phase', value: phase, role: 'pivot' },
          { label: '当前列', value: String(col + 1), role: 'compare' },
          { label: '主元值', value: fmt(pivotValue), role: 'pivot' },
        ])
        .commit();
    },
    onEliminate: (col, pivotRow, row, factor) => {
      // 同步更新镜像矩阵：用主元行消去 row 行
      const pivotValue = M[pivotRow]![col]!;
      for (let k = col; k < cols; k++) {
        M[row]![k] = M[row]![k]! - factor * M[pivotRow]![k]!;
      }
      rec
        .begin({
          zh: `用第 ${pivotRow + 1} 行消去第 ${row + 1} 行（系数 ${fmt(factor)}）`,
          en: `Eliminate row ${row + 1} using row ${pivotRow + 1} (factor ${fmt(factor)})`,
        })
        .setGrid(gridSnapshot(M, { pivot: [pivotRow, col], eliminateRows: [row] }))
        .setAux([
          { label: '阶段 / phase', value: phase, role: 'pivot' },
          { label: '消元系数', value: fmt(factor), role: 'compare' },
          { label: '主元', value: fmt(pivotValue), role: 'pivot' },
        ])
        .commit();
    },
  };

  const result = gaussElimination(input, hooks);

  // 回代阶段：上三角矩阵（最后一列标 final）
  phase = '回代';
  rec
    .begin({
      zh: '前向消元完成 → 上三角矩阵，开始回代求各未知数',
      en: 'Forward elimination done → upper triangular, back-substitute',
    })
    .setGrid(gridSnapshot(result.upper, { finalCol: true }))
    .setAux([
      { label: '阶段 / phase', value: phase, role: 'pivot' },
      { label: '是否唯一解', value: result.unique ? '是 yes' : '否 no', role: 'compare' },
    ])
    .commit();

  // 终态：解
  const solAux: Array<{ label: string; value: string; role?: BarRole }> = [];
  if (result.unique) {
    for (let i = 0; i < result.solution.length; i++) {
      solAux.push({
        label: `x_${i + 1}`,
        value: fmt(result.solution[i]!),
        role: 'final' as BarRole,
      });
    }
  } else {
    solAux.push({ label: '结果', value: '无唯一解（奇异）', role: 'warn' as BarRole });
  }
  rec
    .begin({
      zh: result.unique
        ? `求解完成：x = [${result.solution.map((v) => fmt(v)).join(', ')}]`
        : '该方程组无唯一解（矩阵奇异）',
      en: result.unique
        ? `Solved: x = [${result.solution.map((v) => fmt(v)).join(', ')}]`
        : 'No unique solution (singular matrix)',
    })
    .setGrid(gridSnapshot(result.upper, { finalCol: true }))
    .setAux(solAux)
    .commit();

  return rec.build();
}

// =============================================================================
// LU 分解 · 录制帧序列
// =============================================================================

import type { BarRole, Cell, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { luDecomposition, luSolve, type LUHooks } from './impl.ts';

export const DEFAULT_INPUT = {
  A: [
    [2, 1, 1],
    [4, 3, 3],
    [8, 7, 9],
  ],
  b: [4, 10, 24],
};

function gridFrom(M: number[][], highlight?: { i: number; j: number }): Cell[][] {
  return M.map((row, i) =>
    row.map((v, j) => {
      let role: BarRole = 'default';
      if (highlight && highlight.i === i && highlight.j === j) role = 'pivot';
      else if (Math.abs(v) > 1e-12) role = 'final';
      return { v: v.toFixed(3), role };
    }),
  );
}

export function buildTrace(input: { A: number[][]; b: number[] } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { A, b } = input;

  rec
    .begin({
      zh: `对 ${A.length}×${A.length} 矩阵做 LU 分解`,
      en: `LU decompose ${A.length}×${A.length} matrix`,
    })
    .setGrid(gridFrom(A))
    .setAux([{ label: '说明', value: 'Doolittle: L 单位下三角', role: 'pivot' as BarRole }])
    .commit();

  let lastL: number[][] = [];
  let lastU: number[][] = [];
  const hooks: LUHooks = {
    onEntry: (i, j, _value, which) => {
      rec
        .begin({
          zh: `计算 ${which}[${i}][${j}]`,
          en: `Compute ${which}[${i}][${j}]`,
        })
        .setGrid(which === 'L' ? gridFrom(lastL, { i, j }) : gridFrom(lastU, { i, j }))
        .setAux([
          { label: '当前', value: which, role: 'compare' as BarRole },
          { label: '位置', value: `[${i}][${j}]`, role: 'frontier' as BarRole },
        ])
        .commit();
    },
  };

  // 我们需要在 hook 里能访问正在生成的 L/U，故手动控制流程：分两步展示
  const { L, U } = luDecomposition(A, hooks);
  lastL = L;
  lastU = U;

  // 解 Ax = b
  const x = luSolve(A, b);

  rec
    .begin({ zh: `完成：A = L·U`, en: `Done: A = L·U` })
    .setMap([
      {
        key: 'L',
        value: L.map((row) => row.map((v) => v.toFixed(3)).join(',')).join(' | '),
        role: 'final' as BarRole,
      },
      {
        key: 'U',
        value: U.map((row) => row.map((v) => v.toFixed(3)).join(',')).join(' | '),
        role: 'final' as BarRole,
      },
      { key: '解 x', value: x.map((v) => v.toFixed(4)).join(', '), role: 'final' as BarRole },
    ])
    .commit();

  return rec.build();
}

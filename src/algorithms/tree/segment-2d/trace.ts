// 二维线段树 · 录制帧序列
// 演示：在 3×3 矩阵上做单点更新与矩形求和查询，用 grid 展示矩阵、aux 展示查询累加。

import type { Cell, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { segment2d, type Seg2dHooks } from './impl.ts';

export const DEFAULT_INPUT = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];

// 演示查询：全矩阵和 = 45
const DEFAULT_QUERIES = [{ r1: 1, c1: 1, r2: 3, c2: 3 }];

/** 录制演示帧序列。 */
export function buildTrace(
  input: number[][] = DEFAULT_INPUT,
  queries: Array<{ r1: number; c1: number; r2: number; c2: number }> = DEFAULT_QUERIES,
): Frame[] {
  const rec = new TraceRecorder();
  const mat: number[][] = input.map((row) => [...row]);

  const renderGrid = (
    note: { zh: string; en: string },
    query: { r1: number; c1: number; r2: number; c2: number } | null,
    partial = 0,
  ): void => {
    const cells: Cell[][] = mat.map((row, r) =>
      row.map((v, c) => {
        let role: Cell['role'] = 'default';
        if (query) {
          const inR = r + 1 >= query.r1 && r + 1 <= query.r2;
          const inC = c + 1 >= query.c1 && c + 1 <= query.c2;
          if (inR && inC) role = 'compare';
        }
        return { v: String(v), role };
      }),
    );
    rec
      .begin(note)
      .setGrid(cells)
      .setAux([{ label: '累加', value: String(partial), role: partial > 0 ? 'final' : 'default' }])
      .commit();
  };

  renderGrid(
    {
      zh: `初始 ${mat.length}×${mat[0]?.length ?? 0} 矩阵`,
      en: `Initial ${mat.length}x${mat[0]?.length ?? 0} matrix`,
    },
    null,
  );

  let partial = 0;
  const hooks: Seg2dHooks = {
    onQueryNode: (_rl, _rr, _cl, _cr, nodePartial) => {
      partial += nodePartial;
      renderGrid(
        {
          zh: `访问外层行[${_rl},${_rr}]内层列[${_cl},${_cr}]，累加 +${nodePartial} → ${partial}`,
          en: `Visit rows[${_rl},${_rr}] cols[${_cl},${_cr}], add +${nodePartial} -> ${partial}`,
        },
        queries[0] ?? null,
        partial,
      );
    },
  };

  const out = segment2d(mat, queries, hooks);

  rec
    .begin({
      zh: `矩形求和结果 = ${out.join(', ')}`,
      en: `Rectangle sum result = ${out.join(', ')}`,
    })
    .setGrid(
      mat.map((row, r) =>
        row.map((v, c) => {
          const inQ = queries[0]
            ? r + 1 >= queries[0].r1 &&
              r + 1 <= queries[0].r2 &&
              c + 1 >= queries[0].c1 &&
              c + 1 <= queries[0].c2
            : false;
          return { v: String(v), role: inQ ? 'final' : 'default' };
        }),
      ),
    )
    .setAux([{ label: '结果', value: String(out[0] ?? 0), role: 'final' }])
    .commit();

  return rec.build();
}

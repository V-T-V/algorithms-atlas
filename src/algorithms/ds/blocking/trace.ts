// =============================================================================
// 二维分块 · 录制帧序列
// 用 setGrid 展示矩阵：整块取和时标 'frontier'，散块逐格标 'compare'，
// 查询框边界标 'pivot'。setAux 展示块和表。
// =============================================================================

import type { BarRole, Cell, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { Blocking2D, type BlockingHooks } from './impl.ts';

export const DEFAULT_INPUT = {
  // 6x6 矩阵，值 = 行*10+列 便于人眼校验
  matrix: Array.from({ length: 6 }, (_, r) => Array.from({ length: 6 }, (_, c) => r * 10 + c)),
  queries: [
    [0, 0, 5, 5] as [number, number, number, number], // 全矩阵
    [1, 1, 4, 4] as [number, number, number, number], // 跨多块
    [2, 2, 2, 2] as [number, number, number, number], // 单格
  ],
};

/** 录制演示帧序列。 */
export function buildTrace(
  input: {
    matrix: number[][];
    queries?: Array<[number, number, number, number]>;
  } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const b = new Blocking2D(input.matrix);
  const R = b.rows;
  const C = b.cols;

  const renderGrid = (
    note: { zh: string; en: string },
    hot: {
      box?: [number, number, number, number]; // 查询框
      cells?: Set<string>; // 逐格高亮
      blocks?: Set<string>; // 整块高亮 (ri,cj)
    } = {},
  ): void => {
    const grid: Cell[][] = b.mat.map((row, r) =>
      row.map((v, c) => {
        let role: BarRole = 'default';
        const key = `${r},${c}`;
        if (hot.blocks?.has(key)) role = 'frontier';
        if (hot.cells?.has(`${r},${c}`)) role = 'compare';
        // 查询框边界
        if (hot.box) {
          const [r1, c1, r2, c2] = hot.box;
          const onBorder = (r === r1 || r === r2) && c >= c1 && c <= c2 && role === 'default';
          if (onBorder) role = 'pivot';
        }
        return { v: String(v), role };
      }),
    );
    // 整块覆盖：把整块内所有格标 frontier
    if (hot.blocks) {
      for (const bk of hot.blocks) {
        const [ri, cj] = bk.split(',').map((x) => Number(x));
        const rLo = ri! * b.br;
        const rHi = Math.min((ri! + 1) * b.br - 1, R - 1);
        const cLo = cj! * b.bc;
        const cHi = Math.min((cj! + 1) * b.bc - 1, C - 1);
        for (let r = rLo; r <= rHi; r++)
          for (let c = cLo; c <= cHi; c++) {
            if (grid[r]![c]!.role === 'default' || grid[r]![c]!.role === 'pivot') {
              // 不覆盖 pivot 边界
              if (grid[r]![c]!.role !== 'pivot') grid[r]![c]!.role = 'frontier';
            }
          }
      }
    }
    rec
      .begin(note)
      .setGrid(grid)
      .setAux(
        b.blockSum.flatMap((row, ri) =>
          row.map((s, cj) => ({
            label: `B(${ri},${cj})`,
            value: String(s),
            role: (hot.blocks?.has(`${ri},${cj}`) ? 'frontier' : 'default') as BarRole,
          })),
        ),
      )
      .commit();
  };

  renderGrid({
    zh: `建块：${R}×${C}，块 ${b.br}×${b.bc}，共 ${b.blocksR}×${b.blocksC} 块`,
    en: `Built: ${R}x${C}, block ${b.br}x${b.bc}, ${b.blocksR}x${b.blocksC} blocks`,
  });

  const hooks: BlockingHooks = {
    onCell: () => {},
    onBlock: () => {},
  };

  for (const q of input.queries ?? []) {
    const cells = new Set<string>();
    const blocks = new Set<string>();
    const blockHook: BlockingHooks = {
      onCell: (r, c) => cells.add(`${r},${c}`),
      onBlock: (ri, cj) => blocks.add(`${ri},${cj}`),
    };
    renderGrid(
      {
        zh: `查询子矩阵 (${q[0]},${q[1]})-(${q[2]},${q[3]})`,
        en: `Query sub-matrix (${q[0]},${q[1]})-(${q[2]},${q[3]})`,
      },
      { box: q },
    );
    const sum = b.query(q[0], q[1], q[2], q[3], blockHook);
    renderGrid(
      {
        zh: `结果 = ${sum}（整块 ${blocks.size}，散格 ${cells.size}）`,
        en: `Result = ${sum} (blocks ${blocks.size}, cells ${cells.size})`,
      },
      { box: q, cells, blocks },
    );
    void hooks;
  }

  // 终态
  rec
    .begin({
      zh: `完成，共 ${input.queries?.length ?? 0} 次查询`,
      en: `Done, ${input.queries?.length ?? 0} queries`,
    })
    .setGrid(b.mat.map((row) => row.map((v) => ({ v: String(v), role: 'final' as BarRole }))))
    .commit();

  return rec.build();
}

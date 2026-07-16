// 有序矩阵第 k 小 · 录制帧序列

import type { BarRole, Cell, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { kthSmallestMatrix, type KthMatrixHooks } from './impl.ts';

export const DEFAULT_INPUT = {
  matrix: [
    [1, 5, 9],
    [10, 11, 13],
    [12, 13, 15],
  ],
  k: 5,
};

export function buildTrace(input: { matrix: number[][]; k: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { matrix, k } = input;
  const heap: Array<{ r: number; c: number; v: number }> = [];
  const popped: Array<{ r: number; c: number; v: number }> = [];
  let lastPop: { r: number; c: number; v: number } | null = null;

  const render = (note: { zh: string; en: string }): void => {
    const grid: Cell[][] = matrix.map((row, r) =>
      row.map((v, c) => {
        let role: BarRole = 'default';
        if (popped.some((p) => p.r === r && p.c === c)) role = 'sorted';
        if (heap.some((p) => p.r === r && p.c === c)) role = 'frontier';
        if (lastPop && lastPop.r === r && lastPop.c === c) role = 'final';
        return { v, role };
      }),
    );
    const aux = [
      { label: '堆大小', value: String(heap.length), role: 'frontier' as BarRole },
      { label: '已弹出', value: String(popped.length), role: 'sorted' as BarRole },
      { label: '目标 k', value: String(k), role: 'pivot' as BarRole },
      ...heap.map((h) => ({
        label: `(${h.r},${h.c})`,
        value: String(h.v),
        role: 'frontier' as BarRole,
      })),
    ];
    rec.begin(note).setGrid(grid).setAux(aux).commit();
    lastPop = null;
  };

  render({
    zh: `${matrix.length}×${matrix[0]!.length} 有序矩阵，找第 ${k} 小`,
    en: `${matrix.length}×${matrix[0]!.length} matrix, find ${k}-th smallest`,
  });

  const hooks: KthMatrixHooks = {
    onInitHeap: (c) => {
      heap.push({ r: 0, c, v: matrix[0]![c]! });
    },
    onPop: (step, r, c, v) => {
      // 从堆中移除该节点（堆实现内部已弹出）
      const idx = heap.findIndex((h) => h.r === r && h.c === c);
      if (idx >= 0) heap.splice(idx, 1);
      popped.push({ r, c, v });
      lastPop = { r, c, v };
      render({
        zh: `第 ${step} 次弹出：(${r},${c}) = ${v}`,
        en: `Pop #${step}: (${r},${c}) = ${v}`,
      });
    },
    onPush: (r, c, v) => {
      heap.push({ r, c, v });
    },
  };

  const ans = kthSmallestMatrix(matrix, k, hooks);
  const grid: Cell[][] = matrix.map((row) => row.map((v) => ({ v, role: 'sorted' as BarRole })));
  rec
    .begin({ zh: `第 ${k} 小 = ${ans}`, en: `${k}-th smallest = ${ans}` })
    .setGrid(grid)
    .setAux([{ label: '结果', value: String(ans), role: 'final' as BarRole }])
    .commit();

  return rec.build();
}

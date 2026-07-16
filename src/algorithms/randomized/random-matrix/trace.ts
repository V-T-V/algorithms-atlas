// =============================================================================
// 随机矩阵生成 · 录制帧序列
// 用 setGrid（array2d）展示生成的随机矩阵；用 setAux 展示分布参数与统计量。
// =============================================================================

import type { BarRole, Cell, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import {
  randomBernoulliMatrix,
  randomUniformMatrix,
  matMul,
  freivaldsCheck,
  makeRng,
  type Matrix,
  type RandomMatrixHooks,
} from './impl.ts';

export const DEFAULT_INPUT = {
  m: 5,
  n: 5,
  seed: 42,
  // 'bernoulli' | 'uniform'
  kind: 'bernoulli' as 'bernoulli' | 'uniform',
};

interface BuildTraceInput {
  m?: number;
  n?: number;
  seed?: number;
  kind?: 'bernoulli' | 'uniform';
}

/** 把已填充的行渲染为 Cell 网格，未填充行显示 '?'，热行高亮。 */
function gridOf(filled: Matrix, totalRows: number, cols: number, hotRow: number): Cell[][] {
  const grid: Cell[][] = [];
  for (let i = 0; i < totalRows; i++) {
    const row: Cell[] = [];
    for (let j = 0; j < cols; j++) {
      const filledRow = filled[i];
      if (filledRow) {
        const v = filledRow[j]!;
        row.push({
          v: Number.isInteger(v) ? v : Number(v.toFixed(2)),
          role: (i === hotRow ? 'compare' : v === 1 ? 'final' : 'default') as BarRole,
        });
      } else {
        row.push({ v: '?', role: 'default' as BarRole });
      }
    }
    grid.push(row);
  }
  return grid;
}

/** 把完整矩阵渲染为 Cell 网格。 */
function fullGridOf(M: Matrix): Cell[][] {
  return M.map((row) =>
    row.map((v) => ({
      v: Number.isInteger(v) ? v : Number(v.toFixed(2)),
      role: (v === 1 ? 'final' : 'default') as BarRole,
    })),
  );
}

export function buildTrace(input: BuildTraceInput = {}): Frame[] {
  const m = input.m ?? DEFAULT_INPUT.m;
  const n = input.n ?? DEFAULT_INPUT.n;
  const seed = input.seed ?? DEFAULT_INPUT.seed;
  const kind = input.kind ?? DEFAULT_INPUT.kind;

  const rec = new TraceRecorder();
  // 先累积填充结果，供 onRow 回调读取
  const partial: Matrix = [];

  rec
    .begin({
      zh: `生成 ${m}×${n} ${kind === 'bernoulli' ? '伯努利 0/1' : '均匀 [0,1)'} 随机矩阵（种子 ${seed}）`,
      en: `Generate ${m}×${n} ${kind === 'bernoulli' ? 'Bernoulli 0/1' : 'uniform [0,1)'} random matrix (seed ${seed})`,
    })
    .setAux([
      { label: '维度', value: `${m}×${n}`, role: 'pivot' as BarRole },
      {
        label: '分布',
        value: kind === 'bernoulli' ? 'Bernoulli(1/2)' : 'Uniform[0,1)',
        role: 'frontier' as BarRole,
      },
      { label: '种子', value: String(seed), role: 'default' as BarRole },
    ])
    .setGrid(gridOf([], m, n, -1))
    .commit();

  const hooks: RandomMatrixHooks = {
    onRow: (r, row) => {
      partial.push([...row]);
      rec
        .begin({
          zh: `填充第 ${r} 行：[${row.map((x) => (Number.isInteger(x) ? x : x.toFixed(2))).join(', ')}]`,
          en: `Fill row ${r}: [${row.map((x) => (Number.isInteger(x) ? x : x.toFixed(2))).join(', ')}]`,
        })
        .setGrid(gridOf(partial, m, n, r))
        .setAux([
          { label: '当前行', value: String(r), role: 'swap' as BarRole },
          { label: '已填行数', value: String(r + 1), role: 'compare' as BarRole },
        ])
        .commit();
    },
  };

  let M: Matrix;
  if (kind === 'bernoulli') {
    M = randomBernoulliMatrix(m, n, makeRng(seed), hooks);
  } else {
    M = randomUniformMatrix(m, n, 0, 1, makeRng(seed), hooks);
  }

  // 终态：完整矩阵 + Freivalds 自验证（M·I = M）
  const I: Matrix = Array.from({ length: n }, (_, i) =>
    Array.from({ length: n }, (_, j) => (i === j ? 1 : 0)),
  );
  const MI = matMul(M, I);
  const ok = freivaldsCheck(M, I, M, makeRng(seed + 1));

  const ones = M.flat().filter((x) => x === 1).length;
  rec
    .begin({
      zh: `完成：${m}×${n} 矩阵已生成；Freivalds 验证 M·I=M ${ok ? '通过' : '失败'}；1 占比 ${(ones / (m * n)).toFixed(2)}`,
      en: `Done: ${m}×${n} matrix generated; Freivalds M·I=M ${ok ? 'passed' : 'failed'}; fraction of 1s = ${(ones / (m * n)).toFixed(2)}`,
    })
    .setGrid(fullGridOf(M))
    .setAux([
      {
        label: 'M·I=M 验证',
        value: ok ? '通过' : '失败',
        role: (ok ? 'final' : 'warn') as BarRole,
      },
      { label: '1 的个数', value: String(ones), role: 'pivot' as BarRole },
      { label: 'M·I 的 (0,0)', value: String(MI[0]?.[0] ?? 0), role: 'default' as BarRole },
    ])
    .commit();

  return rec.build();
}

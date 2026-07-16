// =============================================================================
// 矩阵快速幂 · 录制帧序列
// 演示用 2x2 矩阵 [[1,1],[1,0]]^n 求斐波那契，用 setAux 展示中间矩阵。
// =============================================================================

import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { matrixPower, type Matrix, type MatrixPowerHooks } from './impl.ts';

export const DEFAULT_INPUT: { A: Matrix; n: number; mod?: number } = {
  A: [
    [1, 1],
    [1, 0],
  ],
  n: 10,
  mod: undefined,
};

const fmt = (m: Matrix): string => m.map((row) => `[${row.join(', ')}]`).join(' ');

export function buildTrace(input: { A: Matrix; n: number; mod?: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { A, n, mod } = input;

  let curResult: Matrix = [];
  let curBase: Matrix = [];
  let curExp = n;
  let lastAction: 'bit' | 'square' | 'multiply' | null = null;

  const auxRows = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setAux([
        {
          label: 'result',
          value: fmt(curResult),
          role: lastAction === 'multiply' ? 'final' : 'default',
        },
        {
          label: 'base',
          value: fmt(curBase),
          role: lastAction === 'square' ? 'compare' : 'frontier',
        },
        { label: 'exp', value: String(curExp), role: 'default' },
      ])
      .commit();
    lastAction = null;
  };

  // 初始 result = I
  const k = A.length;
  curResult = [];
  for (let i = 0; i < k; i++) {
    const row = new Array<number>(k).fill(0);
    row[i] = 1;
    curResult.push(row);
  }
  curBase = A.map((row) => [...row]);
  auxRows({
    zh: `初始化 result=I, base=A, 求 A^${n}`,
    en: `Init result=I, base=A, compute A^${n}`,
  });

  const hooks: MatrixPowerHooks = {
    onBit: (bit) => {
      lastAction = 'bit';
      auxRows({ zh: `指数最低位 = ${bit}`, en: `Lowest bit = ${bit}` });
    },
    onMultiply: (r) => {
      curResult = r;
      lastAction = 'multiply';
      auxRows({ zh: `位为 1：result = result · base`, en: `Bit is 1: result = result · base` });
    },
    onSquare: (b) => {
      curBase = b;
      curExp = Math.floor(curExp / 2);
      lastAction = 'square';
      auxRows({ zh: `base = base · base；指数右移`, en: `base = base · base; shift exp` });
    },
  };

  const ans = matrixPower(A, n, mod, hooks);

  rec
    .begin({ zh: `结果 A^${n} = ${fmt(ans)}`, en: `Result A^${n} = ${fmt(ans)}` })
    .setAux([{ label: '答案', value: fmt(ans), role: 'final' }])
    .commit();

  return rec.build();
}

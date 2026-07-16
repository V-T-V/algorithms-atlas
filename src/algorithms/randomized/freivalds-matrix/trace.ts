// =============================================================================
// Freivalds 矩阵乘法验证 · 录制帧序列
// 用 aux 展示每次试验的 r、Br、A(Br)、Cr 与比较结果。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { freivaldsVerify, matMul, makeBitRng, type Matrix, type FreivaldsHooks } from './impl.ts';

export const DEFAULT_INPUT = {
  A: [
    [2, 1],
    [3, 4],
  ],
  B: [
    [1, 0],
    [2, 3],
  ],
  k: 4,
  seed: 42,
  // 是否故意构造错误的 C（false = 用正确 C，true = 用错误 C）
  wrong: false,
};

interface BuildTraceInput {
  A?: Matrix;
  B?: Matrix;
  C?: Matrix;
  k?: number;
  seed?: number;
  wrong?: boolean;
}

/** 录制演示帧序列。 */
export function buildTrace(input: BuildTraceInput = {}): Frame[] {
  const A = input.A ?? DEFAULT_INPUT.A;
  const B = input.B ?? DEFAULT_INPUT.B;
  const wrong = input.wrong ?? DEFAULT_INPUT.wrong;
  const k = input.k ?? DEFAULT_INPUT.k;
  const seed = input.seed ?? DEFAULT_INPUT.seed;

  // 计算 C：正确或故意错误
  const correctC = matMul(A, B);
  const C = input.C ?? (wrong ? makeWrong(correctC) : correctC);

  const rec = new TraceRecorder();

  const matStr = (M: Matrix): string => M.map((row) => `[${row.join(',')}]`).join(' ');

  rec
    .begin({
      zh: `Freivalds 验证 A·B ?= C（${k} 次试验）。A=${matStr(A)} B=${matStr(B)} C=${matStr(C)}`,
      en: `Freivalds verify A·B ?= C (${k} trials). A=${matStr(A)} B=${matStr(B)} C=${matStr(C)}`,
    })
    .setAux([
      { label: 'A', value: matStr(A), role: 'pivot' as BarRole },
      { label: 'B', value: matStr(B), role: 'pivot' as BarRole },
      { label: 'C（待验证）', value: matStr(C), role: 'compare' as BarRole },
      { label: '试验次数 k', value: String(k), role: 'frontier' as BarRole },
      { label: '错误上界', value: `2^-${k}`, role: 'default' as BarRole },
    ])
    .commit();

  const hooks: FreivaldsHooks = {
    onRandomVector: (t, r) => {
      rec
        .begin({
          zh: `试验 ${t + 1}：随机 0/1 向量 r=[${r.join(',')}]`,
          en: `Trial ${t + 1}: random 0/1 vector r=[${r.join(',')}]`,
        })
        .setAux([
          { label: '试验', value: String(t + 1), role: 'pivot' as BarRole },
          { label: 'r', value: `[${r.join(',')}]`, role: 'swap' as BarRole },
          { label: '步骤', value: '生成 r', role: 'frontier' as BarRole },
        ])
        .commit();
    },
    onBr: (t, br) => {
      rec
        .begin({
          zh: `试验 ${t + 1}：Br=[${br.join(',')}]`,
          en: `Trial ${t + 1}: Br=[${br.join(',')}]`,
        })
        .setAux([
          { label: '试验', value: String(t + 1), role: 'pivot' as BarRole },
          { label: 'Br', value: `[${br.join(',')}]`, role: 'compare' as BarRole },
          { label: '步骤', value: '计算 Br（O(n²)）', role: 'frontier' as BarRole },
        ])
        .commit();
    },
    onCompare: (t, abr, cr, passed) => {
      rec
        .begin({
          zh: `试验 ${t + 1}：A(Br)=[${abr.join(',')}] vs Cr=[${cr.join(',')}] → ${passed ? '相等（通过）' : '不等（发现错误）'}`,
          en: `Trial ${t + 1}: A(Br)=[${abr.join(',')}] vs Cr=[${cr.join(',')}] → ${passed ? 'equal (pass)' : 'differ (error found)'}`,
        })
        .setAux([
          { label: '试验', value: String(t + 1), role: 'pivot' as BarRole },
          { label: 'A(Br)', value: `[${abr.join(',')}]`, role: 'compare' as BarRole },
          { label: 'Cr', value: `[${cr.join(',')}]`, role: 'compare' as BarRole },
          {
            label: '结果',
            value: passed ? 'PASS' : 'FAIL',
            role: (passed ? 'final' : 'warn') as BarRole,
          },
        ])
        .commit();
    },
    onResult: (verified, trialsPassed, total) => {
      rec
        .begin({
          zh: verified
            ? `完成：通过 ${trialsPassed}/${total} 次 → 极可能 A·B=C（错误 ≤ 2^-${total}）`
            : `完成：第 ${trialsPassed + 1} 次试验失败 → 一定 A·B≠C`,
          en: verified
            ? `Done: passed ${trialsPassed}/${total} → very likely A·B=C (error ≤ 2^-${total})`
            : `Done: failed at trial ${trialsPassed + 1} → definitely A·B≠C`,
        })
        .setAux([
          {
            label: '结论',
            value: verified ? '可能正确' : '一定错误',
            role: (verified ? 'final' : 'warn') as BarRole,
          },
          { label: '通过试验数', value: String(trialsPassed), role: 'default' as BarRole },
          { label: '总试验数', value: String(total), role: 'default' as BarRole },
        ])
        .commit();
    },
  };

  freivaldsVerify(A, B, C, k, makeBitRng(seed), hooks);

  return rec.build();
}

/** 构造一个错误的 C：把正确 C 的 (0,0) 加 1。 */
function makeWrong(correct: Matrix): Matrix {
  const c = correct.map((row) => [...row]);
  c[0]![0] = c[0]![0]! + 1;
  return c;
}

export { matMul };
export type { Matrix };

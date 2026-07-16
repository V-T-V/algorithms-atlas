// =============================================================================
// 斐波那契（Binet + 矩阵快速幂）· 录制帧序列
// 对比 Binet 近似与矩阵快速幂精确值；展示快速幂逐次平方。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { fibBinet, fibMatrix, type FibonacciHooks } from './impl.ts';

export const DEFAULT_INPUT = 10;

/** 录制演示帧序列。 */
export function buildTrace(n: number = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();

  rec
    .begin({
      zh: `求 F(${n})。两种方法：Binet 闭式公式（O(1) 浮点近似）与矩阵快速幂（O(log n) 精确）`,
      en: `Compute F(${n}). Two methods: Binet closed form (O(1) float approx) and matrix fast exponentiation (O(log n) exact)`,
    })
    .setAux([
      { label: 'n', value: String(n), role: 'pivot' as BarRole },
      {
        label: 'φ (黄金比)',
        value: ((1 + Math.sqrt(5)) / 2).toFixed(6),
        role: 'compare' as BarRole,
      },
      { label: '方法', value: 'Binet 先行', role: 'frontier' as BarRole },
    ])
    .commit();

  // —— Binet 公式 ——
  const binetHooks: FibonacciHooks = {
    onBinet: (_nn, approx) => {
      rec
        .begin({
          zh: `Binet：F(${n}) = (φ^${n} − ψ^${n})/√5 ≈ ${approx.toFixed(6)} → 取整 ${Math.round(approx)}`,
          en: `Binet: F(${n}) = (φ^${n} − ψ^${n})/√5 ≈ ${approx.toFixed(6)} → rounded ${Math.round(approx)}`,
        })
        .setAux([
          { label: 'n', value: String(n), role: 'pivot' as BarRole },
          { label: 'Binet 近似', value: approx.toFixed(6), role: 'compare' as BarRole },
          { label: '取整', value: String(Math.round(approx)), role: 'final' as BarRole },
        ])
        .commit();
    },
  };
  const binetVal = fibBinet(n, binetHooks);

  // —— 矩阵快速幂 ——
  rec
    .begin({
      zh: `矩阵法：[[1,1],[1,0]]^${n} 的右上角即 F(${n})，用二进制快速幂 O(log n)`,
      en: `Matrix: the top-right of [[1,1],[1,0]]^${n} is F(${n}), via binary fast exponentiation in O(log n)`,
    })
    .setAux([
      { label: 'n', value: String(n), role: 'pivot' as BarRole },
      { label: '二进制 n', value: n.toString(2), role: 'compare' as BarRole },
      { label: '方法', value: '矩阵快速幂', role: 'frontier' as BarRole },
    ])
    .commit();

  const matrixHooks: FibonacciHooks = {
    onMatrixStep: (exp, base, result) => {
      const fmt = (m: [[number, number], [number, number]]) =>
        `[[${m[0][0]}, ${m[0][1]}], [${m[1][0]}, ${m[1][1]}]]`;
      rec
        .begin({
          zh: `exp=${exp}：base 平方 = ${fmt(base)}，result = ${fmt(result)}`,
          en: `exp=${exp}: base squared = ${fmt(base)}, result = ${fmt(result)}`,
        })
        .setAux([
          { label: '当前 exp', value: String(exp), role: 'pivot' as BarRole },
          { label: 'base (平方后)', value: fmt(base), role: 'compare' as BarRole },
          { label: 'result', value: fmt(result), role: 'final' as BarRole },
        ])
        .commit();
    },
    onResult: (_nn, exact) => {
      rec
        .begin({
          zh: `矩阵法完成：F(${n}) = ${exact}（右上角元素）`,
          en: `Matrix done: F(${n}) = ${exact} (top-right element)`,
        })
        .setAux([
          { label: 'F(n) 精确', value: String(exact), role: 'final' as BarRole },
          { label: 'Binet 近似', value: String(binetVal), role: 'compare' as BarRole },
        ])
        .commit();
    },
  };
  const matrixVal = fibMatrix(n, matrixHooks);

  // —— 终态对比 ——
  const match = binetVal === matrixVal;
  rec
    .begin({
      zh: `对比：Binet 取整 = ${binetVal}，矩阵精确 = ${matrixVal}。${match ? '一致（n 较小时 Binet 精确）' : '有差异（n 大时 Binet 浮点误差）'}`,
      en: `Compare: Binet rounded = ${binetVal}, matrix exact = ${matrixVal}. ${match ? 'Match (Binet exact for small n)' : 'Differ (Binet float error for large n)'}`,
    })
    .setAux([
      { label: 'Binet 取整', value: String(binetVal), role: 'compare' as BarRole },
      { label: '矩阵精确', value: String(matrixVal), role: 'final' as BarRole },
      {
        label: '一致性',
        value: match ? '一致 / match' : '不一致 / differ',
        role: (match ? 'final' : 'warn') as BarRole,
      },
      { label: 'n', value: String(n), role: 'pivot' as BarRole },
    ])
    .commit();

  return rec.build();
}

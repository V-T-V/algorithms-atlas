// =============================================================================
// 斐波那契 · 录制帧序列
// 可视化：setBars 渲染前 n 项；setAux 对比三种方法（递归/记忆化/矩阵快速幂）。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import {
  fibRecursive,
  fibMemoized,
  fibMatrix,
  fibonacciSequence,
  type FibonacciHooks,
} from './impl.ts';

export const DEFAULT_INPUT = 10; // fib(10) = 55

/** 录制演示帧序列。 */
export function buildTrace(n: number = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const seq = fibonacciSequence(n);
  let recurseCalls = 0;
  let memoHits = 0;
  let memoStores = 0;
  let matrixSteps = 0;
  let highlightedIndex = -1;

  const renderSeq = (note: { zh: string; en: string }, method: string): void => {
    const roles: BarRole[] = seq.map((_, i) => (i === highlightedIndex ? 'compare' : 'final'));
    rec
      .begin(note)
      .setBars(seq.map((v, i) => ({ value: v, role: roles[i]!, label: `fib(${i})` })))
      .setAux([
        { label: '方法', value: method, role: 'pivot' },
        { label: '目标', value: `fib(${n})`, role: 'pivot' },
        { label: '递归调用次数', value: String(recurseCalls), role: 'compare' },
        { label: '记忆化命中', value: String(memoHits), role: 'frontier' },
        { label: '记忆化写入', value: String(memoStores), role: 'frontier' },
        { label: '矩阵步骤', value: String(matrixSteps), role: 'swap' },
      ])
      .commit();
  };

  rec
    .begin({
      zh: `计算 fib(${n})，三种方法对比`,
      en: `Compute fib(${n}); compare three methods`,
    })
    .setBars(seq.map((v, i) => ({ value: v, role: 'final', label: `fib(${i})` })))
    .setAux([
      { label: '数列', value: seq.join(', '), role: 'final' },
      { label: '目标', value: `fib(${n})`, role: 'pivot' },
    ])
    .commit();

  // —— 方法一：朴素递归 ——
  const hooks1: FibonacciHooks = {
    onRecurse: (k) => {
      recurseCalls++;
      highlightedIndex = k;
    },
    onResult: (m, nn, val) => {
      renderSeq({ zh: `${m}: fib(${nn}) = ${val}`, en: `${m}: fib(${nn}) = ${val}` }, '递归');
    },
  };
  const v1 = fibRecursive(n, hooks1);
  highlightedIndex = n;
  rec
    .begin({
      zh: `方法一 朴素递归：fib(${n}) = ${v1}，共 ${recurseCalls} 次递归调用（指数级）`,
      en: `Method 1 naive recursion: fib(${n}) = ${v1}, ${recurseCalls} calls (exponential)`,
    })
    .setBars(seq.map((v, i) => ({ value: v, role: 'final', label: `fib(${i})` })))
    .setAux([
      { label: '方法一', value: '朴素递归', role: 'pivot' },
      { label: '结果', value: String(v1), role: 'final' },
      { label: '递归调用', value: String(recurseCalls), role: 'warn' },
      { label: '时间复杂度', value: 'O(2^n)', role: 'warn' },
    ])
    .commit();
  highlightedIndex = -1;

  // —— 方法二：记忆化 ——
  const hooks2: FibonacciHooks = {
    onMemoHit: () => memoHits++,
    onMemoStore: () => memoStores++,
    onResult: (m, nn, val) => {
      renderSeq({ zh: `${m}: fib(${nn}) = ${val}`, en: `${m}: fib(${nn}) = ${val}` }, '记忆化');
    },
  };
  const v2 = fibMemoized(n, hooks2);
  rec
    .begin({
      zh: `方法二 记忆化：fib(${n}) = ${v2}，命中 ${memoHits} 次，写入 ${memoStores} 项`,
      en: `Method 2 memoization: fib(${n}) = ${v2}, ${memoHits} hits, ${memoStores} stores`,
    })
    .setBars(seq.map((v, i) => ({ value: v, role: 'final', label: `fib(${i})` })))
    .setAux([
      { label: '方法二', value: '记忆化', role: 'pivot' },
      { label: '结果', value: String(v2), role: 'final' },
      { label: '缓存命中', value: String(memoHits), role: 'frontier' },
      { label: '时间复杂度', value: 'O(n)', role: 'final' },
    ])
    .commit();

  // —— 方法三：矩阵快速幂 ——
  const hooks3: FibonacciHooks = {
    onMatrixStep: () => matrixSteps++,
    onResult: (m, nn, val) => {
      renderSeq({ zh: `${m}: fib(${nn}) = ${val}`, en: `${m}: fib(${nn}) = ${val}` }, '矩阵快速幂');
    },
  };
  const v3 = fibMatrix(n, hooks3);
  rec
    .begin({
      zh: `方法三 矩阵快速幂：fib(${n}) = ${v3}，仅 ${matrixSteps} 步矩阵运算`,
      en: `Method 3 matrix exponentiation: fib(${n}) = ${v3}, only ${matrixSteps} matrix steps`,
    })
    .setBars(seq.map((v, i) => ({ value: v, role: 'final', label: `fib(${i})` })))
    .setAux([
      { label: '方法三', value: '矩阵快速幂', role: 'pivot' },
      { label: '结果', value: String(v3), role: 'final' },
      { label: '矩阵步骤', value: String(matrixSteps), role: 'final' },
      { label: '时间复杂度', value: 'O(log n)', role: 'final' },
    ])
    .commit();

  // 终态
  rec
    .begin({
      zh: `完成：fib(${n}) = ${v1}（三种方法一致）`,
      en: `Done: fib(${n}) = ${v1} (all three methods agree)`,
    })
    .setBars(seq.map((v, i) => ({ value: v, role: 'final', label: `fib(${i})` })))
    .setAux([
      { label: 'fib(n)', value: String(v1), role: 'final' },
      { label: '递归 O(2^n)', value: String(v1), role: 'warn' },
      { label: '记忆化 O(n)', value: String(v2), role: 'final' },
      { label: '矩阵 O(log n)', value: String(v3), role: 'final' },
    ])
    .commit();

  return rec.build();
}

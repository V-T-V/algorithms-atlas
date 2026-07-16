// =============================================================================
// 爬楼梯 · 录制帧序列
// 用 setBars 展示 ways(0..n) 序列，用 setAux 对比朴素递归 vs 记忆化的调用次数。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import {
  staircaseWays,
  staircaseWaysMemo,
  staircaseSequence,
  type StaircaseHooks,
} from './impl.ts';

export const DEFAULT_INPUT = 6;

/** 录制演示帧序列。 */
export function buildTrace(n: number = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const seq = staircaseSequence(n);

  // 朴素递归统计
  let naiveCalls = 0;
  let memoHits = 0;
  let memoStores = 0;
  let highlight = -1;

  const render = (note: { zh: string; en: string }, method: string): void => {
    rec
      .begin(note)
      .setBars(
        seq.map((v, i) => ({
          value: v,
          role: (i === highlight ? 'compare' : i === n ? 'pivot' : 'final') as BarRole,
          label: `ways(${i})=${v}`,
        })),
      )
      .setAux([
        { label: '方法', value: method, role: 'pivot' as BarRole },
        { label: '目标', value: `ways(${n})`, role: 'pivot' as BarRole },
        { label: '朴素调用', value: String(naiveCalls), role: 'warn' as BarRole },
        { label: '记忆化命中', value: String(memoHits), role: 'frontier' as BarRole },
        { label: '记忆化写入', value: String(memoStores), role: 'frontier' as BarRole },
      ])
      .commit();
  };

  rec
    .begin({
      zh: `计算 ways(${n})：到第 ${n} 阶的爬法数（每次 1 或 2 步）`,
      en: `Compute ways(${n}): distinct ways to reach step ${n} (1 or 2 steps each)`,
    })
    .setBars(seq.map((v, i) => ({ value: v, role: 'final' as BarRole, label: `ways(${i})=${v}` })))
    .setAux([
      { label: '序列', value: seq.join(', '), role: 'final' as BarRole },
      { label: '关系', value: 'ways(n)=ways(n-1)+ways(n-2)', role: 'pivot' as BarRole },
    ])
    .commit();

  // —— 朴素递归 ——
  const naiveHooks: StaircaseHooks = {
    onRecurse: (k) => {
      naiveCalls++;
      highlight = k;
    },
    onSolve: (k, v) => {
      render({ zh: `朴素：ways(${k}) = ${v}`, en: `Naive: ways(${k}) = ${v}` }, '朴素递归');
    },
  };
  const v1 = staircaseWays(n, naiveHooks);
  highlight = n;
  rec
    .begin({
      zh: `朴素递归：ways(${n}) = ${v1}，共 ${naiveCalls} 次调用（指数级）`,
      en: `Naive recursion: ways(${n}) = ${v1}, ${naiveCalls} calls (exponential)`,
    })
    .setBars(
      seq.map((v, i) => ({
        value: v,
        role: (i === n ? 'pivot' : 'final') as BarRole,
        label: `ways(${i})=${v}`,
      })),
    )
    .setAux([
      { label: '方法', value: '朴素递归', role: 'pivot' as BarRole },
      { label: '结果', value: String(v1), role: 'final' as BarRole },
      { label: '调用次数', value: String(naiveCalls), role: 'warn' as BarRole },
      { label: '复杂度', value: 'O(2^n)', role: 'warn' as BarRole },
    ])
    .commit();
  highlight = -1;

  // —— 记忆化 ——
  const memoHooks: StaircaseHooks = {
    onMemoHit: () => memoHits++,
    onMemoStore: () => memoStores++,
    onSolve: (k, v) => {
      render({ zh: `记忆化：ways(${k}) = ${v}`, en: `Memoized: ways(${k}) = ${v}` }, '记忆化');
    },
  };
  const v2 = staircaseWaysMemo(n, new Map(), memoHooks);
  rec
    .begin({
      zh: `记忆化递归：ways(${n}) = ${v2}，命中 ${memoHits} 次，写入 ${memoStores} 项`,
      en: `Memoized recursion: ways(${n}) = ${v2}, ${memoHits} hits, ${memoStores} stores`,
    })
    .setBars(
      seq.map((v, i) => ({
        value: v,
        role: (i === n ? 'pivot' : 'final') as BarRole,
        label: `ways(${i})=${v}`,
      })),
    )
    .setAux([
      { label: '方法', value: '记忆化', role: 'pivot' as BarRole },
      { label: '结果', value: String(v2), role: 'final' as BarRole },
      { label: '缓存命中', value: String(memoHits), role: 'frontier' as BarRole },
      { label: '写入', value: String(memoStores), role: 'frontier' as BarRole },
      { label: '复杂度', value: 'O(n)', role: 'final' as BarRole },
    ])
    .commit();

  // 终态
  rec
    .begin({
      zh: `完成：ways(${n}) = ${v1}（朴素与记忆化一致）`,
      en: `Done: ways(${n}) = ${v1} (naive and memoized agree)`,
    })
    .setBars(seq.map((v, i) => ({ value: v, role: 'final' as BarRole, label: `ways(${i})=${v}` })))
    .setAux([
      { label: 'ways(n)', value: String(v1), role: 'final' as BarRole },
      { label: '朴素 O(2^n) 调用', value: String(naiveCalls), role: 'warn' as BarRole },
      { label: '记忆化 O(n) 写入', value: String(memoStores), role: 'final' as BarRole },
    ])
    .commit();

  return rec.build();
}

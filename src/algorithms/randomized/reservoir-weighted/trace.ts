// =============================================================================
// 加权蓄水池抽样 (A-Res) · 录制帧序列
// 用 aux 展示当前蓄水池（最小堆内容），setArray 展示权重。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import {
  weightedReservoir,
  makeRng,
  type WeightedReservoirHooks,
  type ReservoirEntry,
} from './impl.ts';

export const DEFAULT_INPUT = {
  // 权重流
  weights: [1, 5, 1, 3, 1, 8, 1, 2, 1, 4, 1, 6, 1, 1, 10],
  k: 4,
  seed: 42,
};

interface BuildTraceInput {
  weights?: number[];
  k?: number;
  seed?: number;
}

/** 录制演示帧序列。 */
export function buildTrace(input: BuildTraceInput = {}): Frame[] {
  const weights = input.weights ?? DEFAULT_INPUT.weights;
  const k = input.k ?? DEFAULT_INPUT.k;
  const seed = input.seed ?? DEFAULT_INPUT.seed;

  const rec = new TraceRecorder();
  const rng = makeRng(seed);
  let reservoir: ReservoirEntry[] = [];
  let curIdx = -1;
  let curKey = 0;
  let curAdmitted = false;

  const render = (note: { zh: string; en: string }): void => {
    const roles: BarRole[] = weights.map((_, i) => {
      if (i === curIdx) return curAdmitted ? 'final' : 'warn';
      if (reservoir.some((e) => e.index === i)) return 'sorted';
      return 'default';
    });
    const pointers: Array<{ index: number; label: string }> = [];
    if (curIdx >= 0) pointers.push({ index: curIdx, label: '当前' });
    rec
      .begin(note)
      .setArray(weights, roles, pointers)
      .setAux([
        { label: 'k', value: String(k), role: 'pivot' as BarRole },
        {
          label: '当前项',
          value: curIdx >= 0 ? `w=${weights[curIdx]}` : '-',
          role: 'compare' as BarRole,
        },
        { label: '当前 key', value: curKey.toFixed(4), role: 'frontier' as BarRole },
        {
          label: '本次',
          value: curAdmitted ? '入选' : '落选',
          role: (curAdmitted ? 'final' : 'warn') as BarRole,
        },
        { label: '蓄水池大小', value: String(reservoir.length), role: 'default' as BarRole },
        ...reservoir
          .slice()
          .sort((a, b) => b.key - a.key)
          .map((e, i) => ({
            label: `池#${i} idx=${e.index}`,
            value: `w=${e.weight}, key=${e.key.toFixed(4)}`,
            role: 'sorted' as BarRole,
          })),
      ])
      .commit();
  };

  render({
    zh: `加权蓄水池抽样：k=${k}，流长 ${weights.length}。权重：[${weights.join(',')}]`,
    en: `Weighted reservoir sampling: k=${k}, stream length ${weights.length}. Weights: [${weights.join(',')}]`,
  });

  const hooks: WeightedReservoirHooks = {
    onItem: (index, weight, key, admitted) => {
      curIdx = index;
      curKey = key;
      curAdmitted = admitted;
      render({
        zh: `项 ${index}（w=${weight}）：key=u^(1/${weight})=${key.toFixed(4)}，${admitted ? '进入蓄水池' : '落选'}`,
        en: `Item ${index} (w=${weight}): key=u^(1/${weight})=${key.toFixed(4)}, ${admitted ? 'admitted' : 'rejected'}`,
      });
    },
    onEvict: (evictedIndex, admittedIndex) => {
      render({
        zh: `蓄水池已满：项 ${admittedIndex} 替换堆顶项 ${evictedIndex}`,
        en: `Reservoir full: item ${admittedIndex} replaces heap-top item ${evictedIndex}`,
      });
    },
  };

  const result = weightedReservoir(weights, k, rng, hooks);
  reservoir = result;
  curIdx = -1;
  curAdmitted = false;

  // 终态
  const roles: BarRole[] = weights.map((_, i) =>
    reservoir.some((e) => e.index === i) ? 'final' : 'default',
  );
  rec
    .begin({
      zh: `完成：选中 ${reservoir.length} 项 [${reservoir.map((e) => e.index).join(', ')}]`,
      en: `Done: selected ${reservoir.length} items [${reservoir.map((e) => e.index).join(', ')}]`,
    })
    .setArray(weights, roles, [])
    .setAux([
      { label: '选中数', value: String(reservoir.length), role: 'final' as BarRole },
      { label: 'k', value: String(k), role: 'pivot' as BarRole },
      ...reservoir
        .slice()
        .sort((a, b) => b.key - a.key)
        .map((e, i) => ({
          label: `选中#${i}`,
          value: `idx=${e.index}, w=${e.weight}, key=${e.key.toFixed(4)}`,
          role: 'final' as BarRole,
        })),
    ])
    .commit();

  return rec.build();
}

export { makeRng };
export const DEFAULT_K = DEFAULT_INPUT.k;

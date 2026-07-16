// =============================================================================
// Las Vegas 快速选择 · 录制帧序列
// 用 bars 展示当前数组与搜索范围，aux 展示 pivot 与目标 k。
// =============================================================================

import type { BarRole, BarState, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { quickselect, makeRng, makeSampleArray, type QuickselectHooks } from './impl.ts';

export const DEFAULT_INPUT = {
  array: makeSampleArray(),
  k: 4, // 第 4 小（0 基），即中位数附近
  seed: 42,
};

interface BuildTraceInput {
  array?: number[];
  k?: number;
  seed?: number;
}

/** 把数组+范围+pivot+目标录成柱状图帧。 */
function render(
  rec: TraceRecorder,
  arr: number[],
  lo: number,
  hi: number,
  target: number,
  pivotIndex: number | null,
  note: { zh: string; en: string },
  extra?: Array<{ label: string; value: string; role?: BarRole }>,
): void {
  const roles: BarRole[] = arr.map((_, i) => {
    if (i < lo || i >= hi) return 'sorted'; // 范围外（已排除）
    if (i === target) return 'pivot'; // 目标位
    return 'default';
  });
  if (pivotIndex !== null) roles[pivotIndex] = 'swap';
  const bars: BarState[] = arr.map((v, i) => ({ value: v, role: roles[i]! }));
  const aux: Array<{ label: string; value: string; role?: BarRole }> = [
    { label: '搜索范围', value: `[${lo}, ${hi})`, role: 'frontier' as BarRole },
    { label: '目标 k', value: String(target), role: 'pivot' as BarRole },
    {
      label: 'Pivot',
      value: pivotIndex !== null ? `${arr[pivotIndex]!}（下标 ${pivotIndex}）` : '—',
      role: 'swap' as BarRole,
    },
    ...(extra ?? []),
  ];
  rec.begin(note).setBars(bars).setAux(aux).commit();
}

/** 录制演示帧序列。 */
export function buildTrace(input: BuildTraceInput = {}): Frame[] {
  const arr = [...(input.array ?? DEFAULT_INPUT.array)];
  const k = input.k ?? DEFAULT_INPUT.k;
  const seed = input.seed ?? DEFAULT_INPUT.seed;

  const rec = new TraceRecorder();

  // 初始帧
  render(rec, arr, 0, arr.length, k, null, {
    zh: `Las Vegas 快速选择：在 [${arr.join(', ')}] 中找第 ${k} 小（0 基）。种子 ${seed}`,
    en: `Las Vegas quickselect: find ${k}-th smallest (0-indexed) in [${arr.join(', ')}]. Seed ${seed}`,
  });

  let lo = 0;
  let hi = arr.length;
  let target = k;
  const rng = makeRng(seed);

  const hooks: QuickselectHooks = {
    onRecurse: (nLo, nHi, nTarget) => {
      lo = nLo;
      hi = nHi;
      target = nTarget;
    },
    onPivot: (pivotIndex, pivotValue) => {
      render(rec, arr, lo, hi, target, pivotIndex, {
        zh: `选 pivot = ${pivotValue}（下标 ${pivotIndex}），范围 [${lo}, ${hi})`,
        en: `Pivot = ${pivotValue} (index ${pivotIndex}), range [${lo}, ${hi})`,
      });
    },
    onPartition: (lt, gt, eqEnd) => {
      render(
        rec,
        arr,
        lo,
        hi,
        target,
        null,
        {
          zh: `三路划分：< [${lo},${lt})，= [${lt},${gt})，> [${gt},${hi})`,
          en: `Partition: < [${lo},${lt}), = [${lt},${gt}), > [${gt},${hi})`,
        },
        [
          { label: '<段', value: `[${lo},${lt})`, role: 'compare' as BarRole },
          { label: '=段', value: `[${lt},${gt})`, role: 'pivot' as BarRole },
          { label: '>段', value: `[${gt},${eqEnd})`, role: 'frontier' as BarRole },
        ],
      );
    },
    onResult: (value) => {
      render(
        rec,
        arr,
        lo,
        hi,
        target,
        null,
        {
          zh: `完成：第 ${k} 小 = ${value}`,
          en: `Done: ${k}-th smallest = ${value}`,
        },
        [{ label: '结果', value: String(value), role: 'final' as BarRole }],
      );
    },
  };

  quickselect(arr, k, rng, hooks);

  return rec.build();
}

export { quickselect, makeSampleArray };

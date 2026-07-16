// =============================================================================
// 拼接最大数 · 录制帧序列
// 可视化：setArray 渲染当前最优；setAux 展示各分配方案。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { createMaximumNumber, type CreateMaximumNumberHooks } from './impl.ts';

export interface CmnInput {
  nums1: number[];
  nums2: number[];
  k: number;
}
export const DEFAULT_INPUT: CmnInput = {
  nums1: [3, 4, 6, 5],
  nums2: [9, 1, 2, 5, 8, 3],
  k: 5,
};

/** 录制演示帧序列。 */
export function buildTrace(input: CmnInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { nums1, nums2, k } = input;
  let best: number[] = [];

  rec
    .begin({
      zh: `拼接最大数：nums1=[${nums1.join(', ')}], nums2=[${nums2.join(', ')}], k=${k}`,
      en: `Create max number: nums1=[${nums1.join(', ')}], nums2=[${nums2.join(', ')}], k=${k}`,
    })
    .setArray([0], ['default'], [])
    .setAux([
      { label: 'nums1', value: `[${nums1.join(', ')}]`, role: 'default' },
      { label: 'nums2', value: `[${nums2.join(', ')}]`, role: 'default' },
      { label: 'k', value: String(k), role: 'pivot' },
    ])
    .commit();

  const hooks: CreateMaximumNumberHooks = {
    onSplit: (i, sub1, sub2, merged) => {
      rec
        .begin({
          zh: `分配：nums1 取 ${i} 个=[${sub1.join(', ')}]，nums2 取 ${k - i} 个=[${sub2.join(', ')}] → 合并=[${merged.join(', ')}]`,
          en: `Split: ${i} from nums1=[${sub1.join(', ')}], ${k - i} from nums2=[${sub2.join(', ')}] → [${merged.join(', ')}]`,
        })
        .setArray(
          [...merged],
          merged.map(() => 'compare' as BarRole),
          [],
        )
        .setAux([
          { label: '本次合并', value: merged.join(', '), role: 'compare' },
          { label: '当前最优', value: best.length ? best.join(', ') : '·', role: 'final' },
        ])
        .commit();
    },
    onUpdate: (b) => {
      best = [...b];
      rec
        .begin({ zh: `更新最优：[${best.join(', ')}]`, en: `New best: [${best.join(', ')}]` })
        .setArray(
          [...best],
          best.map(() => 'final' as BarRole),
          [],
        )
        .setAux([{ label: '最优', value: best.join(', '), role: 'final' }])
        .commit();
    },
  };

  const result = createMaximumNumber(nums1, nums2, k, hooks);

  rec
    .begin({
      zh: `完成：最大数 = [${result.join(', ')}]`,
      en: `Done: max = [${result.join(', ')}]`,
    })
    .setArray(
      [...result],
      result.map(() => 'final' as BarRole),
      [],
    )
    .setAux([
      { label: '结果', value: result.join(', '), role: 'final' },
      { label: '位数', value: String(result.length), role: 'final' },
    ])
    .commit();

  return rec.build();
}

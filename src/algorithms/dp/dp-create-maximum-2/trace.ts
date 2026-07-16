// =============================================================================
// 拼接最大数 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { createMaximumNumber, type MaxNumberHooks } from './impl.ts';

export const DEFAULT_NUMS1 = [3, 4, 6, 5];
export const DEFAULT_NUMS2 = [9, 1, 2, 5, 8, 3];
export const DEFAULT_K = 5;

export function buildTrace(
  nums1: readonly number[] = DEFAULT_NUMS1,
  nums2: readonly number[] = DEFAULT_NUMS2,
  k: number = DEFAULT_K,
): Frame[] {
  const rec = new TraceRecorder();
  let best: number[] = [];

  rec
    .begin({
      zh: `nums1=[${nums1.join(',')}] nums2=[${nums2.join(',')}] k=${k}`,
      en: `nums1=[${nums1.join(',')}] nums2=[${nums2.join(',')}] k=${k}`,
    })
    .setAux([
      { label: 'nums1', value: `[${nums1.join(',')}]`, role: 'frontier' },
      { label: 'nums2', value: `[${nums2.join(',')}]`, role: 'frontier' },
    ])
    .commit();

  const hooks: MaxNumberHooks = {
    onTry: (i, sub1, sub2) => {
      rec
        .begin({
          zh: `取 i=${i}：sub1=[${sub1.join(',')}] sub2=[${sub2.join(',')}]`,
          en: `i=${i}: sub1=[${sub1.join(',')}] sub2=[${sub2.join(',')}]`,
        })
        .setBars([...sub1, ...sub2].map((v) => ({ value: v, role: 'pivot' as BarRole })))
        .setAux([
          { label: 'i', value: String(i), role: 'compare' },
          { label: 'sub1', value: `[${sub1.join(',')}]`, role: 'frontier' },
          { label: 'sub2', value: `[${sub2.join(',')}]`, role: 'frontier' },
        ])
        .commit();
    },
    onDone: (r) => {
      best = r;
    },
  };

  createMaximumNumber(nums1, nums2, k, hooks);

  rec
    .begin({ zh: `最大数=[${best.join(',')}]`, en: `max=[${best.join(',')}]` })
    .setBars(best.map((v) => ({ value: v, role: 'final' as BarRole })))
    .setAux([{ label: '结果', value: best.join(''), role: 'final' }])
    .commit();

  return rec.build();
}

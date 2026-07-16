// =============================================================================
// 有序链表交集 · 录制帧序列
// =============================================================================

import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildList, listToArray, intersectionSorted, type IntersectionHooks } from './impl.ts';

export const DEFAULT_INPUT: { a: number[]; b: number[] } = {
  a: [1, 2, 3, 5, 6],
  b: [2, 4, 5, 6, 7],
};

export function buildTrace(input: { a: number[]; b: number[] } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { a, b } = input;
  const result = listToArray(intersectionSorted(buildList(a), buildList(b)));

  rec
    .begin({ zh: '求两条有序链表交集', en: 'Find intersection of two sorted lists' })
    .setAux([
      { label: 'a', value: a.join(' → ') },
      { label: 'b', value: b.join(' → ') },
    ])
    .commit();

  let matched = 0;
  const hooks: IntersectionHooks = {
    onMatch: (v) => {
      matched++;
      rec
        .begin({ zh: `匹配到公共元素 ${v}`, en: `Match common element ${v}` })
        .setAux([
          { label: 'a', value: a.join(' → ') },
          { label: 'b', value: b.join(' → ') },
          { label: 'matched', value: String(matched), role: 'frontier' },
        ])
        .commit();
    },
  };

  intersectionSorted(buildList(a), buildList(b), hooks);

  rec
    .begin({
      zh: `交集：${result.join(' → ') || '∅'}`,
      en: `Intersection: ${result.join(' → ') || '∅'}`,
    })
    .setAux([
      { label: 'a', value: a.join(' → ') },
      { label: 'b', value: b.join(' → ') },
      { label: 'A ∩ B', value: result.join(' → ') || '∅', role: 'final' },
    ])
    .commit();
  return rec.build();
}

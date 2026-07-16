// =============================================================================
// 有序链表并集 · 录制帧序列
// =============================================================================

import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildList, listToArray, unionSorted, type UnionHooks } from './impl.ts';

export const DEFAULT_INPUT: { a: number[]; b: number[] } = { a: [1, 2, 3, 5], b: [2, 4, 5, 6] };

export function buildTrace(input: { a: number[]; b: number[] } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { a, b } = input;
  const acc: number[] = [];

  rec
    .begin({ zh: '求两条有序链表并集', en: 'Find union of two sorted lists' })
    .setAux([
      { label: 'a', value: a.join(' → ') },
      { label: 'b', value: b.join(' → ') },
      { label: 'A ∪ B', value: '-', role: 'frontier' },
    ])
    .commit();

  const hooks: UnionHooks = {
    onAppend: (v) => {
      acc.push(v);
      rec
        .begin({ zh: `并入 ${v}`, en: `Append ${v}` })
        .setAux([
          { label: 'a', value: a.join(' → ') },
          { label: 'b', value: b.join(' → ') },
          { label: 'A ∪ B', value: acc.join(' → '), role: 'frontier' },
        ])
        .commit();
    },
  };

  const result = unionSorted(buildList(a), buildList(b), hooks);
  void result;

  rec
    .begin({ zh: `并集：${acc.join(' → ')}`, en: `Union: ${acc.join(' → ')}` })
    .setAux([
      { label: 'a', value: a.join(' → ') },
      { label: 'b', value: b.join(' → ') },
      { label: 'A ∪ B', value: listToArray(result).join(' → '), role: 'final' },
    ])
    .commit();
  return rec.build();
}

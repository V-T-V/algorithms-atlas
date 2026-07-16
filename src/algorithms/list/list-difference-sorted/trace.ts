// =============================================================================
// 有序链表差集 · 录制帧序列
// =============================================================================

import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildList, listToArray, differenceSorted, type DifferenceHooks } from './impl.ts';

export const DEFAULT_INPUT: { a: number[]; b: number[] } = { a: [1, 2, 3, 5, 7], b: [2, 4, 5, 6] };

export function buildTrace(input: { a: number[]; b: number[] } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { a, b } = input;
  const acc: number[] = [];

  rec
    .begin({ zh: '求 A − B 差集', en: 'Find set difference A − B' })
    .setAux([
      { label: 'a', value: a.join(' → ') },
      { label: 'b', value: b.join(' → ') },
      { label: 'A − B', value: '-', role: 'frontier' },
    ])
    .commit();

  const hooks: DifferenceHooks = {
    onKeep: (v) => {
      acc.push(v);
      rec
        .begin({ zh: `保留 ${v}（仅属于 A）`, en: `Keep ${v} (only in A)` })
        .setAux([
          { label: 'a', value: a.join(' → ') },
          { label: 'b', value: b.join(' → ') },
          { label: 'A − B', value: acc.join(' → '), role: 'frontier' },
        ])
        .commit();
    },
  };

  const result = differenceSorted(buildList(a), buildList(b), hooks);
  void result;

  rec
    .begin({ zh: `差集：${acc.join(' → ') || '∅'}`, en: `Difference: ${acc.join(' → ') || '∅'}` })
    .setAux([
      { label: 'a', value: a.join(' → ') },
      { label: 'b', value: b.join(' → ') },
      { label: 'A − B', value: listToArray(result).join(' → ') || '∅', role: 'final' },
    ])
    .commit();
  return rec.build();
}

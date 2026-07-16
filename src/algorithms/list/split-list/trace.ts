// =============================================================================
// 分割链表 · 录制帧序列
// setAux 展示各段长度与内容。
// =============================================================================

import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildList, listToArray, splitList, type SplitListHooks } from './impl.ts';

export const DEFAULT_INPUT: { values: number[]; k: number } = {
  values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  k: 3,
};

/** 录制演示帧序列。 */
export function buildTrace(input: { values: number[]; k: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { values, k } = input;
  const parts: number[][] = [];

  const snap = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setAux([
        { label: 'list', value: values.join(' → ') },
        { label: 'k', value: String(k), role: 'compare' },
        {
          label: 'parts',
          value: parts.map((p, i) => `part${i}[${p.length}]=${p.join(',')}`).join(' | ') || '-',
          role: 'final',
        },
      ])
      .commit();
  };

  snap({ zh: `分割成 ${k} 段`, en: `Split into ${k} parts` });

  const hooks: SplitListHooks = {
    onPart: () => {},
    onDone: () => {},
  };
  void hooks;

  const res = splitList(buildList(values), k, hooks);
  for (const p of res) parts.push(listToArray(p));
  snap({ zh: '完成', en: 'Done' });
  return rec.build();
}

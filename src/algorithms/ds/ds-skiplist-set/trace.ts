// =============================================================================
// 跳表 · 录制帧序列
// =============================================================================

import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { SkipListSet, type SkipListHooks } from './impl.ts';

export const DEFAULT_INPUT: { inserts: number[]; queries: number[] } = {
  inserts: [5, 2, 8, 1, 9, 3, 7, 4, 6],
  queries: [3, 4, 10, 0],
};

export function buildTrace(
  input: { inserts: number[]; queries: number[] } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const { inserts, queries } = input;

  rec
    .begin({ zh: `跳表插入 [${inserts.join(',')}]`, en: `Skip list insert [${inserts.join(',')}]` })
    .commit();

  const hooks: SkipListHooks = {
    onInsert: (value) => {
      rec
        .begin({ zh: `插入 ${value}`, en: `Insert ${value}` })
        .setAux([{ label: '插入', value: String(value), role: 'compare' }])
        .commit();
    },
    onLevel: (value, level) => {
      rec
        .begin({ zh: `节点 ${value} 升至第 ${level} 层`, en: `Node ${value} at level ${level}` })
        .setAux([{ label: '层', value: `${value}@L${level}`, role: 'frontier' }])
        .commit();
    },
  };

  const sl = new SkipListSet(hooks);
  for (const v of inserts) sl.insert(v);

  rec
    .begin({ zh: `中序：[${sl.toArray().join(',')}]`, en: `Sorted: [${sl.toArray().join(',')}]` })
    .setAux([{ label: '有序', value: `[${sl.toArray().join(',')}]`, role: 'final' }])
    .commit();

  for (const q of queries) {
    rec
      .begin({
        zh: `ceiling(${q})=${sl.ceiling(q)}, floor(${q})=${sl.floor(q)}`,
        en: `ceiling(${q})=${sl.ceiling(q)}, floor(${q})=${sl.floor(q)}`,
      })
      .setAux([
        { label: `ceiling(${q})`, value: String(sl.ceiling(q)), role: 'final' },
        { label: `floor(${q})`, value: String(sl.floor(q)), role: 'final' },
      ])
      .commit();
  }

  return rec.build();
}

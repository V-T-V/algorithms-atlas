// =============================================================================
// 链表插入排序 · 录制帧序列
// setArray 展示链表数值；标注已排序段与待插入节点。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildList, listToArray, insertSortList, type InsertSortListHooks } from './impl.ts';

export const DEFAULT_INPUT = [4, 2, 1, 3];

/** 录制演示帧序列。 */
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const n = input.length;
  let sortedLen = 0;
  let pickIdx = -1;

  const snap = (note: { zh: string; en: string }): void => {
    const cur = listToArray(head);
    const roles: BarRole[] = new Array(n).fill('default');
    for (let i = 0; i < sortedLen && i < cur.length; i++) roles[i] = 'final';
    if (pickIdx >= 0 && pickIdx < cur.length) roles[pickIdx] = 'pivot';
    const pointers: Array<{ index: number; label: string }> =
      pickIdx >= 0 ? [{ index: pickIdx, label: 'pick' }] : [];
    rec.begin(note).setArray(cur, roles, pointers).commit();
  };

  const head = buildList(input);
  rec
    .begin({ zh: '链表插入排序', en: 'Insertion sort list' })
    .setArray([...input], new Array(n).fill('frontier'), [])
    .commit();

  let pickCounter = 0;
  const hooks: InsertSortListHooks = {
    onPick: () => {
      pickIdx = sortedLen + pickCounter;
      pickCounter = 1;
      snap({ zh: `取出待插入节点`, en: `Pick node to insert` });
    },
    onInsert: () => {
      sortedLen++;
      pickIdx = -1;
      pickCounter = 0;
    },
    onDone: () => {},
  };

  insertSortList(head, hooks);

  const finalValues = listToArray(head);
  rec
    .begin({ zh: `完成：${finalValues.join(' → ')}`, en: `Done: ${finalValues.join(' → ')}` })
    .setArray(finalValues, new Array(n).fill('final'), [])
    .commit();
  return rec.build();
}

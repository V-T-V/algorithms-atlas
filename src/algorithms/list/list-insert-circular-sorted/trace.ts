// =============================================================================
// 循环有序链表插入 · 录制帧序列
// =============================================================================

import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import {
  buildCircular,
  circularToArray,
  insertCircularSorted,
  type InsertCircularHooks,
} from './impl.ts';

export const DEFAULT_INPUT = { values: [3, 4, 1], insertVal: 2 };

export function buildTrace(
  input: { values: number[]; insertVal: number } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const { values, insertVal } = input;
  const head = buildCircular(values);
  const before = circularToArray(head);

  rec
    .begin({
      zh: `循环链表：${before.join(' → ')} → …（插入 ${insertVal}）`,
      en: `Circular list: ${before.join(' → ')} → … (insert ${insertVal})`,
    })
    .setAux([
      { label: 'insertVal', value: String(insertVal), role: 'pivot' },
      { label: 'before', value: before.join(' → '), role: 'frontier' },
    ])
    .commit();

  const hooks: InsertCircularHooks = {
    onInsert: (iv, p, n) => {
      rec
        .begin({ zh: `在 ${p} 与 ${n} 之间插入 ${iv}`, en: `Insert ${iv} between ${p} and ${n}` })
        .setAux([
          { label: 'prev', value: String(p), role: 'compare' },
          { label: 'next', value: String(n), role: 'swap' },
          { label: 'inserted', value: String(iv), role: 'pivot' },
        ])
        .commit();
    },
  };

  const result = insertCircularSorted(head, insertVal, hooks);
  const after = circularToArray(result);

  rec
    .begin({ zh: `结果：${after.join(' → ')} → …`, en: `Result: ${after.join(' → ')} → …` })
    .setAux([{ label: 'result', value: after.join(' → '), role: 'final' }])
    .commit();
  return rec.build();
}

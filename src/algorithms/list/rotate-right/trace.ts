// =============================================================================
// 旋转链表 · 录制帧序列
// setArray 展示链表数值；标注新头位置。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildList, listToArray, rotateRight, type RotateRightHooks } from './impl.ts';

export const DEFAULT_INPUT: { values: number[]; k: number } = { values: [1, 2, 3, 4, 5], k: 2 };

/** 录制演示帧序列。 */
export function buildTrace(input: { values: number[]; k: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { values, k } = input;
  const n = values.length;
  const steps = n > 0 ? k % n : 0;
  const newHeadIdx = (n - steps) % n;

  const snap = (note: { zh: string; en: string }, rotateAt: number, roles: BarRole[]): void => {
    rec
      .begin(note)
      .setArray([...values], roles, rotateAt >= 0 ? [{ index: rotateAt, label: 'cut' }] : [])
      .commit();
  };

  snap(
    { zh: `右旋 ${steps} 位`, en: `Rotate right ${steps}` },
    newHeadIdx >= 0 ? newHeadIdx - 1 : -1,
    new Array(n).fill('frontier'),
  );

  const hooks: RotateRightHooks = {
    onCut: (_newTail, newHead) => {
      void newHead;
    },
    onDone: () => {},
  };
  void hooks;

  const newHead = rotateRight(buildList(values), k, hooks);
  const finalValues = listToArray(newHead);
  rec
    .begin({ zh: `完成：${finalValues.join(' → ')}`, en: `Done: ${finalValues.join(' → ')}` })
    .setArray(finalValues, new Array(finalValues.length).fill('final'), [])
    .commit();
  return rec.build();
}

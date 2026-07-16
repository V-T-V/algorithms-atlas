// =============================================================================
// 奇偶链表 · 录制帧序列
// setArray 展示链表数值；标注奇/偶段。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildList, listToArray, oddEvenList, type OddEvenListHooks } from './impl.ts';

export const DEFAULT_INPUT = [1, 2, 3, 4, 5];

/** 录制演示帧序列。 */
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const values = [...input];
  const n = values.length;

  const snap = (note: { zh: string; en: string }, oddEnd: number, evenStart: number): void => {
    const roles: BarRole[] = new Array(n).fill('default');
    for (let i = 0; i <= oddEnd; i++) roles[i] = 'final';
    for (let i = evenStart; i < n; i++) roles[i] = 'compare';
    rec.begin(note).setArray(values, roles, []).commit();
  };

  rec
    .begin({ zh: `奇偶链表重排`, en: `Odd-even reorder` })
    .setArray(values, new Array(n).fill('frontier'), [])
    .commit();

  const hooks: OddEvenListHooks = {
    onVisit: () => {},
    onDone: () => {},
  };
  // 展示中段：奇段已收集，偶段待接
  snap(
    { zh: '奇段收集完成，接上偶段', en: 'Odd collected, attach even' },
    Math.floor((n - 1) / 2),
    Math.floor((n - 1) / 2) + 1,
  );
  void hooks;

  const newHead = oddEvenList(buildList(input), hooks);
  const finalValues = listToArray(newHead);
  rec
    .begin({ zh: `完成：${finalValues.join(' → ')}`, en: `Done: ${finalValues.join(' → ')}` })
    .setArray(finalValues, new Array(finalValues.length).fill('final'), [])
    .commit();
  return rec.build();
}

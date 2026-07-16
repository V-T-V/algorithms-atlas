// =============================================================================
// 反转链表 II · 录制帧序列
// setArray 展示链表数值；pointer 标注翻转段。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildList, listToArray, reverseII, type ReverseIIHooks } from './impl.ts';

export const DEFAULT_INPUT: { values: number[]; left: number; right: number } = {
  values: [1, 2, 3, 4, 5],
  left: 2,
  right: 4,
};

/** 录制演示帧序列。left/right 为 1-based。 */
export function buildTrace(
  input: { values: number[]; left: number; right: number } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const { values, left, right } = input;
  const n = values.length;
  let flips = 0;

  const snap = (note: { zh: string; en: string }): void => {
    const cur = listToArray(head);
    const roles: BarRole[] = new Array(n).fill('default');
    for (let i = left - 1; i < right; i++) roles[i] = 'pivot';
    rec.begin(note).setArray(cur, roles, []).commit();
  };

  const head = buildList(values);
  rec
    .begin({ zh: `反转 [${left}, ${right}]`, en: `Reverse [${left}, ${right}]` })
    .setArray([...values], new Array(n).fill('frontier'), [])
    .commit();

  const hooks: ReverseIIHooks = {
    onFlip: () => {
      flips++;
      snap({ zh: `翻转第 ${left + flips - 1} 个节点`, en: `Flip #${flips}` });
    },
    onDone: () => {},
  };

  reverseII(head, left, right, hooks);

  const finalValues = listToArray(head);
  rec
    .begin({ zh: `完成：${finalValues.join(' → ')}`, en: `Done: ${finalValues.join(' → ')}` })
    .setArray(finalValues, new Array(n).fill('final'), [])
    .commit();
  return rec.build();
}

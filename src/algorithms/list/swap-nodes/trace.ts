// =============================================================================
// 两两交换节点 · 录制帧序列
// setArray 展示链表数值；标注当前交换对。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildList, listToArray, swapNodes, type SwapNodesHooks } from './impl.ts';

export const DEFAULT_INPUT = [1, 2, 3, 4];

/** 录制演示帧序列。 */
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const values = [...input];
  const n = values.length;
  let pairStart = -1;

  const snap = (note: { zh: string; en: string }): void => {
    const roles: BarRole[] = new Array(n).fill('default');
    if (pairStart >= 0) {
      roles[pairStart] = 'compare';
      if (pairStart + 1 < n) roles[pairStart + 1] = 'pivot';
    }
    const pointers: Array<{ index: number; label: string }> = [];
    if (pairStart >= 0)
      pointers.push(
        { index: pairStart, label: 'a' },
        { index: Math.min(pairStart + 1, n - 1), label: 'b' },
      );
    rec.begin(note).setArray(listToArray(head), roles, pointers).commit();
  };

  const head = buildList(values);
  rec
    .begin({ zh: '两两交换相邻节点', en: 'Swap pairs' })
    .setArray(values, new Array(n).fill('frontier'), [])
    .commit();

  let pairIdx = 0;
  const hooks: SwapNodesHooks = {
    onSwap: () => {
      pairStart = pairIdx;
      snap({ zh: `交换 [${pairIdx}, ${pairIdx + 1}]`, en: `Swap [${pairIdx}, ${pairIdx + 1}]` });
      pairIdx += 2;
    },
    onDone: () => {},
  };

  swapNodes(head, hooks);

  const finalValues = listToArray(head);
  rec
    .begin({ zh: `完成：${finalValues.join(' → ')}`, en: `Done: ${finalValues.join(' → ')}` })
    .setArray(finalValues, new Array(n).fill('final'), [])
    .commit();
  return rec.build();
}

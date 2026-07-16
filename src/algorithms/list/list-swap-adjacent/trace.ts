// =============================================================================
// 两两交换相邻节点 · 录制帧序列
// =============================================================================

import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildList, listToArray, swapAdjacent, type SwapAdjacentHooks } from './impl.ts';

export const DEFAULT_INPUT = [1, 2, 3, 4, 5];

export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();

  rec
    .begin({ zh: `初始链表：${input.join(' → ')}`, en: `Initial list: ${input.join(' → ')}` })
    .setAux([{ label: 'list', value: input.join(' → '), role: 'frontier' }])
    .commit();

  let pair = 0;
  const hooks: SwapAdjacentHooks = {
    onSwap: (a, b) => {
      pair++;
      rec
        .begin({ zh: `第 ${pair} 对交换：${a} ↔ ${b}`, en: `Swap pair ${pair}: ${a} ↔ ${b}` })
        .setAux([
          { label: 'pair', value: String(pair), role: 'pivot' },
          { label: 'a', value: String(a), role: 'compare' },
          { label: 'b', value: String(b), role: 'swap' },
        ])
        .commit();
    },
  };

  const result = swapAdjacent(buildList(input), hooks);
  const arr = listToArray(result);

  rec
    .begin({ zh: `结果：${arr.join(' → ')}`, en: `Result: ${arr.join(' → ')}` })
    .setAux([{ label: 'result', value: arr.join(' → '), role: 'final' }])
    .commit();
  return rec.build();
}

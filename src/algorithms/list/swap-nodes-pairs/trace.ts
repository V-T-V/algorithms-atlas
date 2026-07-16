// =============================================================================
// 两两交换链表节点 · 录制帧序列
// 用 setArray 展示当前链表值序列，每次交换后成帧。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { swapPairs, buildList, toArray, type SwapPairsHooks } from './impl.ts';

export const DEFAULT_INPUT = [1, 2, 3, 4, 5];

export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const head = buildList(input);
  let curValues = [...input];

  const snap = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setArray(
        curValues,
        curValues.map(() => 'default' as BarRole),
        [],
      )
      .commit();
  };

  snap({ zh: `初始链表：[${input.join(', ')}]`, en: `Initial list: [${input.join(', ')}]` });

  const hooks: SwapPairsHooks = {
    onSwap: (a, b) => {
      curValues = toArray(head);
      snap({
        zh: `交换 ${a.value} ↔ ${b.value} → [${curValues.join(', ')}]`,
        en: `Swap ${a.value} ↔ ${b.value} → [${curValues.join(', ')}]`,
      });
    },
    onSingleLeft: (node) => {
      snap({
        zh: `剩单个节点 ${node.value}，保持不动`,
        en: `Single node ${node.value} left, unchanged`,
      });
    },
  };

  swapPairs(head, hooks);

  const final = toArray(head);
  rec
    .begin({ zh: `完成：[${final.join(', ')}]`, en: `Done: [${final.join(', ')}]` })
    .setArray(
      final,
      final.map(() => 'final' as BarRole),
      [],
    )
    .commit();

  return rec.build();
}

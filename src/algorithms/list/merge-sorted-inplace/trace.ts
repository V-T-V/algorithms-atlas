// =============================================================================
// 原地合并有序链表 · 录制帧序列
// 用 setArray 展示结果链表值序列，pointer 标记当前结果尾。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { mergeSortedInPlace, buildList, toArray, type MergeInPlaceHooks } from './impl.ts';

export const DEFAULT_INPUT = {
  l1: [1, 3, 5, 7],
  l2: [2, 4, 6, 8],
};

export function buildTrace(input: { l1: number[]; l2: number[] } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const a = buildList(input.l1);
  const b = buildList(input.l2);

  // 结果链表的当前值序列（逐步增长）
  const resultValues: number[] = [];
  let tailIdx = -1;

  const snap = (note: { zh: string; en: string }): void => {
    const roles: BarRole[] = resultValues.map((_, i) =>
      i === tailIdx ? ('swap' as BarRole) : ('final' as BarRole),
    );
    const pointers: Array<{ index: number; label: string }> = [];
    if (tailIdx >= 0) pointers.push({ index: tailIdx, label: 'tail' });
    rec.begin(note).setArray(resultValues, roles, pointers).commit();
  };

  snap({
    zh: `l1 = [${input.l1.join(', ')}]，l2 = [${input.l2.join(', ')}]`,
    en: `l1 = [${input.l1.join(', ')}], l2 = [${input.l2.join(', ')}]`,
  });

  const hooks: MergeInPlaceHooks = {
    onCompare: (v1, v2, pick) => {
      void v1;
      void v2;
      void pick;
    },
    onAppend: (node) => {
      resultValues.push(node.value);
      tailIdx = resultValues.length - 1;
      snap({
        zh: `接入 ${node.value} → [${resultValues.join(', ')}]`,
        en: `Append ${node.value} → [${resultValues.join(', ')}]`,
      });
    },
    onSplice: (fromList) => {
      // 剩余整体接入（之后会在终态统一展示）
      void fromList;
    },
  };

  const result = mergeSortedInPlace(a, b, hooks);
  const final = toArray(result);

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

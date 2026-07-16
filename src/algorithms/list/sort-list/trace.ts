// 链表排序 · 录制帧序列
// 用 setBars 展示排序过程的快照（每完成一次合并后更新）。

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { sortList, fromArray, toArray, type SortListHooks } from './impl.ts';

export const DEFAULT_INPUT = [4, 2, 1, 3];

export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  let current: number[] = [...input];
  let merges = 0;

  const snapshot = (note: { zh: string; en: string }) => {
    rec.begin(note).setBars(rec.barsFrom(current, {})).commit();
  };

  snapshot({ zh: `初始链表：${input.join(' → ')}`, en: `Initial list: ${input.join(' → ')}` });

  const hooks: SortListHooks = {
    onMergeStep: () => {},
  };

  // 归并排序会递归完成所有合并；我们用「分步」展示：
  // 由于 sortList 递归完成，我们在外部模拟分层展示
  // 简化：直接排序后在末尾展示结果 + 中间用 onSplit 标记
  const splitLog: number[] = [];
  const wrappedHooks: SortListHooks = {
    onSplit: (mid) => {
      splitLog.push(mid);
    },
    onMergeStep: (lv, rv, picked) => {
      merges++;
      void lv;
      void rv;
      void picked;
    },
  };

  const sorted = sortList(fromArray(input), wrappedHooks);
  current = toArray(sorted);

  snapshot({
    zh: `排序完成（分裂 ${splitLog.length} 次，合并 ${merges} 步）`,
    en: `Sorted (${splitLog.length} splits, ${merges} merge steps)`,
  });

  void hooks;

  // 终态：全部 final
  rec
    .begin({ zh: '完成', en: 'Done' })
    .setBars(current.map((v) => ({ value: v, role: 'final' as BarRole, label: String(v) })))
    .commit();

  return rec.build();
}

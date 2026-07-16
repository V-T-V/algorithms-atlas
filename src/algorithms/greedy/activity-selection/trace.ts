// =============================================================================
// 活动选择 · 录制帧序列
// 通过 activitySelection 的钩子，把贪心执行过程录成 Frame[]。
// 可视化：setArray 渲染每个活动的「结束时间」，pointers 标当前处理项；
// roles 标已选('final') / 被拒('warn') / 当前('pivot')。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { activitySelection, type Activity, type ActivitySelectionHooks } from './impl.ts';

export const DEFAULT_INPUT: ReadonlyArray<readonly [number, number]> = [
  [1, 4],
  [3, 5],
  [0, 6],
  [5, 7],
  [3, 9],
  [5, 9],
  [6, 10],
  [8, 11],
  [8, 12],
  [2, 14],
  [12, 16],
];

/** 录制演示帧序列。 */
export function buildTrace(
  input: ReadonlyArray<readonly [number, number]> = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  // 把二元组还原成 Activity
  const acts: Activity[] = input.map(([start, end], i) => ({ start, end, id: i }));

  // 排序后的活动（在 onSort 中同步）
  let order: Activity[] = [...acts];
  const roles: BarRole[] = []; // 按排序后下标的角色
  let lastEnd = 0;

  const snapshot = (
    note: { zh: string; en: string },
    currentIdx?: number,
    pointerLabel?: string,
  ): void => {
    const values = order.map((a) => a.end);
    const pointers: Array<{ index: number; label: string }> = [];
    if (currentIdx !== undefined && pointerLabel) {
      pointers.push({ index: currentIdx, label: pointerLabel });
    }
    rec.begin(note).setArray(values, roles, pointers).commit();
  };

  // 初始：按原始顺序展示结束时间
  rec
    .begin({
      zh: `输入 ${acts.length} 个活动（区间），展示各自的结束时间`,
      en: `${acts.length} activities (intervals); shown are their finish times`,
    })
    .setArray(
      acts.map((a) => a.end),
      acts.map(() => 'default' as BarRole),
      [],
    )
    .commit();

  const hooks: ActivitySelectionHooks = {
    onSort: (sorted) => {
      order = sorted;
      roles.length = 0;
      for (let i = 0; i < sorted.length; i++) roles.push('default');
      snapshot({
        zh: `按结束时间升序排序：[${order.map((a) => a.end).join(', ')}]`,
        en: `Sorted by finish time: [${order.map((a) => a.end).join(', ')}]`,
      });
    },
    onSelect: (i, act) => {
      roles[i] = 'final';
      snapshot(
        {
          zh: `选中活动 ${act.id}（区间 [${act.start}, ${act.end})）：start=${act.start} ≥ lastEnd=${lastEnd}`,
          en: `Select activity ${act.id} (interval [${act.start}, ${act.end})): start=${act.start} ≥ lastEnd=${lastEnd}`,
        },
        i,
        `选 selected`,
      );
      lastEnd = act.end;
    },
    onReject: (i, act) => {
      roles[i] = 'warn';
      snapshot(
        {
          zh: `跳过活动 ${act.id}（区间 [${act.start}, ${act.end})）：与 lastEnd=${lastEnd} 冲突`,
          en: `Skip activity ${act.id} (interval [${act.start}, ${act.end})): conflicts with lastEnd=${lastEnd}`,
        },
        i,
        `拒 reject`,
      );
    },
  };

  const selected = activitySelection(acts, hooks);

  // 终态：全部选中项标 final
  rec
    .begin({
      zh: `完成：共选出 ${selected.length} 个互不重叠的活动`,
      en: `Done: ${selected.length} non-overlapping activities selected`,
    })
    .setArray(
      order.map((a) => a.end),
      roles,
      [],
    )
    .setAux([
      { label: '选中活动 id', value: selected.map((a) => String(a.id)).join(', '), role: 'final' },
      { label: '数量 count', value: String(selected.length), role: 'final' },
    ])
    .commit();

  return rec.build();
}

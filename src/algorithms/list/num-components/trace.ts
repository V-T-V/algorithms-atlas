// =============================================================================
// 链表组件数量 · 录制帧序列
// setArray 展示链表数值；标记在集合中的节点与组件起点。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildList, numComponents, type NumComponentsHooks } from './impl.ts';

export const DEFAULT_INPUT: { values: number[]; nums: number[] } = {
  values: [0, 1, 2, 3],
  nums: [0, 1, 3],
};

/** 录制演示帧序列。 */
export function buildTrace(input: { values: number[]; nums: number[] } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { values, nums } = input;
  const n = values.length;
  const set = new Set(nums);
  let curIdx = -1;

  const snap = (note: { zh: string; en: string }): void => {
    const roles: BarRole[] = new Array(n).fill('default');
    for (let i = 0; i <= curIdx && i < n; i++) roles[i] = set.has(values[i]!) ? 'final' : 'default';
    if (curIdx >= 0 && curIdx < n) roles[curIdx] = 'pivot';
    rec
      .begin(note)
      .setArray([...values], roles, curIdx >= 0 ? [{ index: curIdx, label: 'cur' }] : [])
      .commit();
  };

  snap({ zh: `统计 nums 中的组件段`, en: `Count components` });

  const hooks: NumComponentsHooks = {
    onVisit: (value, inSet) => {
      curIdx = values.indexOf(value);
      snap({
        zh: `${value}${inSet ? ' ∈ nums' : ' ∉ nums'}`,
        en: `${value}${inSet ? ' in set' : ' not in set'}`,
      });
    },
    onComponent: () => {
      /* 组件计数（演示用） */
    },
    onDone: () => {},
  };

  const c = numComponents(buildList(values), nums, hooks);
  rec
    .begin({ zh: `完成：${c} 个组件`, en: `Done: ${c} components` })
    .setArray([...values], new Array(n).fill('final'), [])
    .commit();
  return rec.build();
}

// =============================================================================
// 慢排序 · 录制帧序列
// 通过 slowSort 的钩子，把执行过程录成 Frame[]。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { slowSort, type SlowSortHooks } from './impl.ts';

export const DEFAULT_INPUT = [3, 1, 4, 1, 2];

/** 录制演示帧序列。 */
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const a = [...input];
  const sorted = new Set<number>();
  let highlight: number | null = null;

  const snapshot = (note: { zh: string; en: string }): void => {
    const roles: Record<number, BarRole> = {};
    for (const s of sorted) roles[s] = 'final';
    if (highlight !== null && !roles[highlight]) roles[highlight] = 'pivot';
    rec.begin(note).setBars(rec.barsFrom(a, roles)).commit();
    highlight = null;
  };

  snapshot({ zh: `初始数组：${a.join(', ')}`, en: `Initial array: ${a.join(', ')}` });

  const hooks: SlowSortHooks = {
    onRecurse: () => {
      // 递归事件成帧会爆炸，这里不单独成帧
    },
    onMaxPlaced: (hi) => {
      sorted.add(hi);
      highlight = hi;
      snapshot({
        zh: `把 [.., ${hi}] 的最大值 ${a[hi]} 放到末尾 ${hi}`,
        en: `Place max of [.., ${hi}] = ${a[hi]} at end ${hi}`,
      });
    },
  };

  slowSort(input, hooks);

  for (let i = 0; i < a.length; i++) sorted.add(i);
  rec
    .begin({ zh: '排序完成', en: 'Sorted' })
    .setBars(a.map((v) => ({ value: v, role: 'final' as BarRole })))
    .commit();

  return rec.build();
}

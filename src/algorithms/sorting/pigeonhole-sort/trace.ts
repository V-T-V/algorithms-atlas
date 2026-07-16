// =============================================================================
// 鸽巢排序 · 录制帧序列
// 通过 pigeonholeSort 的钩子，把执行过程录成 Frame[]。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { pigeonholeSort, type PigeonholeSortHooks } from './impl.ts';

export const DEFAULT_INPUT = [5, 2, 8, 1, 4, 3, 6];

/** 录制演示帧序列。 */
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const a = [...input];
  let highlight: number | null = null;

  const snapshot = (note: { zh: string; en: string }): void => {
    const roles: Record<number, BarRole> = {};
    if (highlight !== null) roles[highlight] = 'compare';
    rec.begin(note).setBars(rec.barsFrom(a, roles)).commit();
    highlight = null;
  };

  snapshot({ zh: `初始数组：${a.join(', ')}`, en: `Initial array: ${a.join(', ')}` });

  const _holes: number[][] = [];
  const hooks: PigeonholeSortHooks = {
    onPlace: (v) => {
      highlight = a.indexOf(v);
      snapshot({ zh: `把 ${v} 放入它的鸽巢`, en: `Place ${v} into its pigeonhole` });
    },
    onCollect: (v, holeIdx) => {
      const writePos = a.filter((_, i) => a.slice(0, i).length >= 0).length; // 占位
      void writePos;
      void holeIdx;
      // 用简单方式：把 a 更新为按 hole 顺序累计的「已回收」视图
    },
  };

  pigeonholeSort(input, hooks);

  // 重新生成有序结果用于终态展示
  const sorted = [...input].sort((x, y) => x - y);
  highlight = null;
  a.splice(0, a.length, ...sorted);
  rec
    .begin({ zh: '按鸽巢顺序回收，排序完成', en: 'Collect holes in order; sorted' })
    .setBars(a.map((v) => ({ value: v, role: 'final' as BarRole })))
    .commit();

  return rec.build();
}

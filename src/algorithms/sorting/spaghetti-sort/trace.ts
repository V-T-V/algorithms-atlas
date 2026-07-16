// =============================================================================
// 意大利面排序 · 录制帧序列
// 通过 spaghettiSort 的钩子，把执行过程录成 Frame[]。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { spaghettiSort, type SpaghettiSortHooks } from './impl.ts';

export const DEFAULT_INPUT = [5, 2, 8, 1, 4, 3, 6];

/** 录制演示帧序列。 */
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const out: number[] = [];

  const snapshot = (note: { zh: string; en: string }): void => {
    const roles: Record<number, BarRole> = {};
    if (out.length > 0) roles[out.length - 1] = 'compare';
    rec.begin(note).setBars(rec.barsFrom(out, roles)).commit();
  };

  snapshot({ zh: `初始数组：${input.join(', ')}`, en: `Initial array: ${input.join(', ')}` });

  const hooks: SpaghettiSortHooks = {
    onPlaceRod: () => {
      // 放面条不单独成帧
    },
    onPickRod: (length) => {
      out.push(length);
      snapshot({
        zh: `手向下压，取走最长的一根：长度 ${length}`,
        en: `Press down; pick the longest rod: length ${length}`,
      });
    },
  };

  spaghettiSort(input, hooks);

  rec
    .begin({ zh: '排序完成', en: 'Sorted' })
    .setBars(out.map((v) => ({ value: v, role: 'final' as BarRole })))
    .commit();

  return rec.build();
}

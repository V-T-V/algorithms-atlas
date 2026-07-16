// =============================================================================
// 斜率优化DP · 录制帧序列
// 用 setBars 展示原数组与调整后的非递减数组，用 setAux 展示堆顶与累计代价。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { slopeTrick, type SlopeTrickHooks } from './impl.ts';

export const DEFAULT_INPUT = [5, 4, 3, 2, 1, 3, 6, 2];

/** 录制演示帧序列。 */
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const n = input.length;
  const adjusted: number[] = new Array(n).fill(0);
  let curIdx = -1;
  let heapTop: number | null = null;

  const renderBars = () => {
    const roles: Record<number, BarRole> = {};
    if (curIdx >= 0) {
      roles[curIdx] = 'compare';
    }
    return rec.barsFrom(input, roles);
  };

  const snapshot = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setBars(renderBars())
      .setAux([
        { label: '当前元素', value: curIdx >= 0 ? String(input[curIdx]) : '-', role: 'pivot' },
        { label: '堆顶', value: heapTop === null ? '-' : String(heapTop), role: 'compare' },
      ])
      .commit();
  };

  snapshot({ zh: `原数组 [${input.join(', ')}]`, en: `Original [${input.join(', ')}]` });

  const hooks: SlopeTrickHooks = {
    onElement: (i, ai, top) => {
      curIdx = i;
      heapTop = top;
      snapshot({
        zh: `处理 a[${i}] = ${ai}：堆顶 = ${top}`,
        en: `Process a[${i}] = ${ai}: heap top = ${top}`,
      });
    },
    onPop: (i, popped, inc) => {
      snapshot({
        zh: `堆顶 ${popped} > a[${i}]：下压，累计代价 +${inc}`,
        en: `Heap top ${popped} > a[${i}]: push down, cost +${inc}`,
      });
    },
    onSetValue: (i, _original, adj) => {
      adjusted[i] = adj;
    },
  };

  const result = slopeTrick(input, hooks);
  void result;

  curIdx = -1;
  heapTop = null;
  rec
    .begin({
      zh: `完成：最小代价 ${result.cost}，结果 [${adjusted.join(', ')}]`,
      en: `Done: min cost ${result.cost}, result [${adjusted.join(', ')}]`,
    })
    .setBars(adjusted.map((v) => ({ value: v, role: 'final' as BarRole })))
    .setAux([{ label: '总代价', value: String(result.cost), role: 'final' }])
    .commit();

  return rec.build();
}

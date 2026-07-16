// 循环缓冲排序 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { circleBufferSort, type CircleBufferSortHooks } from './impl.ts';

export const DEFAULT_INPUT = [5, 2, 8, 1, 9, 3];

export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const a = [...input];

  rec
    .begin({ zh: `初始数组：${a.join(', ')}`, en: `Initial array: ${a.join(', ')}` })
    .setBars(rec.barsFrom(a))
    .setAux([{ label: '策略', value: '环形缓冲区辅助归并', role: 'pivot' }])
    .commit();

  let mergeCount = 0;
  const hooks: CircleBufferSortHooks = {
    onInitBuffer: (size) => {
      rec
        .begin({
          zh: `分配环形缓冲区（大小 ${size}）`,
          en: `Allocate circular buffer (size ${size})`,
        })
        .setAux([{ label: '缓冲区大小', value: String(size), role: 'frontier' }])
        .commit();
    },
    onMerged: (lo, mid, hi) => {
      mergeCount++;
      const roles: Record<number, BarRole> = {};
      for (let i = lo; i <= hi; i++) roles[i] = 'sorted';
      rec
        .begin({
          zh: `合并 [${lo}..${mid}] 与 [${mid + 1}..${hi}]`,
          en: `Merge [${lo}..${mid}] and [${mid + 1}..${hi}]`,
        })
        .setBars(rec.barsFrom(a, roles))
        .commit();
    },
  };

  const result = circleBufferSort(input, hooks);

  rec
    .begin({ zh: `排序完成（共 ${mergeCount} 次合并）`, en: `Sorted (${mergeCount} merges)` })
    .setBars(result.map((v) => ({ value: v, role: 'final' as BarRole })))
    .commit();

  return rec.build();
}

// =============================================================================
// 归并树 · 录制
import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { MergeTree2 } from './impl.ts';

export const DEFAULT_INPUT = [5, 2, 8, 1, 9, 3, 7];

export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const mt = new MergeTree2(input);

  rec
    .begin({ zh: '归并树构建完成', en: 'Merge tree built' })
    .setBars(input.map((x) => ({ value: x, role: 'default' })))
    .commit();

  // 演示 countLE 查询不同阈值
  for (const x of [3, 5, 8]) {
    const cnt = mt.countLE(0, input.length - 1, x);
    rec
      .begin({ zh: `区间内 <= ${x} 的元素有 ${cnt} 个`, en: `Values <= ${x}: ${cnt}` })
      .setBars(input.map((v) => ({ value: v, role: v <= x ? 'compare' : 'default' })))
      .setAux([{ label: `count<=${x}`, value: String(cnt), role: 'pivot' }])
      .commit();
  }

  rec
    .begin({ zh: '查询结束', en: 'Done' })
    .setBars(input.map((x) => ({ value: x, role: 'final' })))
    .commit();

  return rec.build();
}

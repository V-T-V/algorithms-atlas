// 滑动窗口 · 录制帧序列

import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { slidingWindow } from './impl.ts';

export const DEFAULT_INPUT = [5, 2, 8, 1, 9, 3, 7, 4, 6];

/** 录制演示帧序列。 */
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec
    .begin({ zh: `初始数组：${input.join(', ')}`, en: `Initial: ${input.join(', ')}` })
    .setBars(rec.barsFrom(input))
    .commit();

  // TODO: 在调用算法的过程中，于关键步骤 rec.begin(...).setBars(...).commit()
  const out = slidingWindow(input);
  const best = input.slice(out.start, out.start + out.length);
  rec
    .begin({
      zh: `完成：最长无重复窗口长度 ${out.length}`,
      en: `Done: longest unique window length ${out.length}`,
    })
    .setBars(best.map((v) => ({ value: v, role: 'final' })))
    .commit();

  return rec.build();
}

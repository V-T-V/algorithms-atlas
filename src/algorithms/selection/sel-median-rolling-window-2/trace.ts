import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { medianSlidingWindowSteps } from './impl.ts';

export const DEFAULT_INPUT = { nums: [1, 3, -1, 5, 3, 6, 7], k: 3 };

export function buildTrace(input: { nums: number[]; k: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { nums, k } = input;

  const snap = (note: { zh: string; en: string }, winStart: number, median: number): void => {
    const roles: Record<number, BarRole> = {};
    for (let i = winStart; i < winStart + k; i++) roles[i] = 'compare';
    rec
      .begin(note)
      .setBars(rec.barsFrom(nums, roles))
      .setAux([
        { label: '窗口', value: `[${winStart},${winStart + k - 1}]`, role: 'compare' as BarRole },
        { label: '中位数', value: median.toString(), role: 'final' as BarRole },
      ])
      .commit();
  };

  snap({ zh: `初始数组，窗口 k=${k}`, en: `Init, window k=${k}` }, 0, 0);

  const steps = medianSlidingWindowSteps(nums, k);
  for (const s of steps) {
    snap(
      { zh: `窗口 [${s.index}] 中位数 ${s.median}`, en: `Window [${s.index}] median ${s.median}` },
      s.index,
      s.median,
    );
  }

  rec
    .begin({ zh: `完成：${steps.length} 个中位数`, en: `Done: ${steps.length} medians` })
    .setAux([
      { label: '结果', value: steps.map((s) => s.median).join(','), role: 'final' as BarRole },
    ])
    .commit();
  return rec.build();
}

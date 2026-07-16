// 最大表现 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { greedyMaxPerformance, type GreedyMaxPerformanceHooks } from './impl.ts';

export const DEFAULT_INPUT = {
  n: 6,
  speed: [2, 10, 3, 1, 5, 8],
  efficiency: [5, 4, 3, 9, 7, 2],
  k: 2,
};

export function buildTrace(
  input: { n: number; speed: number[]; efficiency: number[]; k: number } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const { n, speed, efficiency, k } = input;

  rec
    .begin({
      zh: `n=${n} k=${k}`,
      en: `n=${n} k=${k}`,
    })
    .setBars(speed.map((v) => ({ value: v, role: 'default' as BarRole })))
    .setAux([
      { label: 'speed', value: speed.join(','), role: 'pivot' },
      { label: 'efficiency', value: efficiency.join(','), role: 'pivot' },
    ])
    .commit();

  const hooks: GreedyMaxPerformanceHooks = {
    onEval: (minEff, speedSum, perf) => {
      rec
        .begin({
          zh: `minEff=${minEff} sumSpeed=${speedSum} → 表现 ${perf}`,
          en: `minEff=${minEff} sumSpeed=${speedSum} → perf ${perf}`,
        })
        .setBars([{ value: perf, role: 'compare' as BarRole }])
        .commit();
    },
  };

  const result = greedyMaxPerformance(n, speed, efficiency, k, hooks);

  rec
    .begin({ zh: `完成：最大表现 ${result}`, en: `Done: max performance ${result}` })
    .setBars([{ value: result, role: 'final' as BarRole }])
    .setAux([{ label: '最大表现', value: String(result), role: 'final' }])
    .commit();

  return rec.build();
}

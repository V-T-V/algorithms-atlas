// 最少箭射气球 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { greedyMinArrows, type GreedyMinArrowsHooks } from './impl.ts';

export const DEFAULT_INPUT: ReadonlyArray<readonly [number, number]> = [
  [10, 16],
  [2, 8],
  [1, 6],
  [7, 12],
];

export function buildTrace(
  input: ReadonlyArray<readonly [number, number]> = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();

  rec
    .begin({ zh: `${input.length} 个气球`, en: `${input.length} balloons` })
    .setBars(input.map((p) => ({ value: p[1], role: 'default' as BarRole })))
    .commit();

  const hooks: GreedyMinArrowsHooks = {
    onShoot: (position, burstCount) => {
      rec
        .begin({
          zh: `在 ${position} 射箭，爆 ${burstCount} 个`,
          en: `Shoot at ${position}, burst ${burstCount}`,
        })
        .setBars([{ value: burstCount, role: 'final' as BarRole }])
        .commit();
    },
  };

  const result = greedyMinArrows(input, hooks);

  rec
    .begin({ zh: `完成：${result} 支箭`, en: `Done: ${result} arrows` })
    .setAux([{ label: '箭数', value: String(result), role: 'final' }])
    .commit();

  return rec.build();
}

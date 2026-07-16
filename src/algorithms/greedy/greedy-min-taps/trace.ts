// 最少水龙头 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { greedyMinTaps, type GreedyMinTapsHooks } from './impl.ts';

export const DEFAULT_INPUT = { n: 5, ranges: [3, 4, 1, 1, 0, 0] };

export function buildTrace(input: { n: number; ranges: number[] } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { n, ranges } = input;

  rec
    .begin({
      zh: `花园长 ${n}，半径 ${ranges.join(',')}`,
      en: `garden len ${n}, ranges ${ranges.join(',')}`,
    })
    .setBars(ranges.map((r) => ({ value: r, role: 'default' as BarRole })))
    .commit();

  const hooks: GreedyMinTapsHooks = {
    onJump: (count) => {
      rec
        .begin({ zh: `开启第 ${count} 个水龙头`, en: `Open tap #${count}` })
        .setBars([{ value: count, role: 'final' as BarRole }])
        .commit();
    },
  };

  const result = greedyMinTaps(n, ranges, hooks);

  rec
    .begin({
      zh: `完成：${result === -1 ? '无法浇满' : result + ' 个水龙头'}`,
      en: `Done: ${result === -1 ? 'impossible' : result + ' taps'}`,
    })
    .setAux([{ label: '个数', value: String(result), role: 'final' }])
    .commit();

  return rec.build();
}

// 蓄水池抽样 (Algorithm R) · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { reservoirSample } from './impl.ts';

export const DEFAULT_INPUT = { stream: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], k: 3 };

export function buildTrace(input: { stream: number[]; k: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();

  rec
    .begin({
      zh: `蓄水池抽样 k=${input.k}（流长 ${input.stream.length}）`,
      en: `Reservoir k=${input.k} (stream ${input.stream.length})`,
    })
    .setBars(input.stream.map((v) => ({ value: v, role: 'pivot' as BarRole })))
    .commit();

  const hooks = {
    onInit: (reservoir: number[]) => {
      rec
        .begin({
          zh: `蓄水池填满：[${reservoir.join(', ')}]`,
          en: `Reservoir full: [${reservoir.join(', ')}]`,
        })
        .setBars(reservoir.map((v) => ({ value: v, role: 'final' as BarRole })))
        .commit();
    },
    onConsider: (index: number, value: number, j: number, replace: boolean) => {
      rec
        .begin({
          zh: `元素[${index}]=${value}，j=${j} ${replace ? '→替换' : '→丢弃'}`,
          en: `elem[${index}]=${value}, j=${j} ${replace ? '→replace' : '→skip'}`,
        })
        .setAux([
          {
            label: '动作',
            value: replace ? `替换 [${j}]` : '丢弃',
            role: (replace ? 'swap' : 'default') as BarRole,
          },
        ])
        .commit();
    },
  };

  const result = reservoirSample(input.stream, input.k, undefined, hooks);

  rec
    .begin({ zh: `结果：[${result.join(', ')}]`, en: `Result: [${result.join(', ')}]` })
    .setBars(result.map((v) => ({ value: v, role: 'final' as BarRole })))
    .commit();

  return rec.build();
}

// Delta编码 · 录制帧序列

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { delta, type DeltaHooks } from './impl.ts';

export interface DeltaInput {
  data: number[];
}

export const DEFAULT_INPUT: DeltaInput = { data: [10, 12, 15, 15, 18, 20, 20] };

/** 录制演示帧序列。 */
export function buildTrace(input: DeltaInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { data } = input;

  rec
    .begin({ zh: `原数据 [${data.join(',')}]`, en: `Original [${data.join(',')}]` })
    .setBars(data.map((v) => ({ value: v, role: 'default' as BarRole })))
    .commit();

  const hooks: DeltaHooks = {
    onDelta: (_i, d) => {
      void d;
    },
  };
  const { deltas } = delta(data, hooks);

  rec
    .begin({ zh: `完成：差分 [${deltas.join(',')}]`, en: `Done: deltas [${deltas.join(',')}]` })
    .setBars(deltas.map((v) => ({ value: v, role: 'final' as BarRole })))
    .setMap([{ key: 'Delta', value: deltas.join(','), role: 'final' as BarRole }])
    .commit();

  return rec.build();
}

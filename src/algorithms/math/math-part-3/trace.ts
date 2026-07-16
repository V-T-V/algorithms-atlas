// =============================================================================
// 整数划分 · 录制
import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { partitionTable, type PartitionHooks } from './impl.ts';

export const DEFAULT_INPUT = 12;

export function buildTrace(maxN: number = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const values: bigint[] = [];

  const snap = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setBars(values.map((v) => ({ value: Number(v), role: 'frontier' })))
      .setAux(values.map((v, i) => ({ label: `p(${i})`, value: v.toString(), role: 'final' })))
      .commit();
  };

  snap({ zh: `计算 p(1..${maxN})`, en: `Compute p(1..${maxN})` });

  const hooks: PartitionHooks = {
    onValue: (n, v) => {
      values.push(v);
      snap({ zh: `p(${n}) = ${v}`, en: `p(${n}) = ${v}` });
    },
  };

  partitionTable(maxN, hooks);

  rec
    .begin({
      zh: `p(${maxN}) = ${values[values.length - 1]}`,
      en: `p(${maxN}) = ${values[values.length - 1]}`,
    })
    .setAux([{ label: '答案', value: values[values.length - 1]?.toString() ?? '-', role: 'final' }])
    .commit();

  return rec.build();
}

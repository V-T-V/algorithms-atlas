// =============================================================================
// 整数划分 P(n) · 录制帧序列
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { partitionP, type PartitionPHooks } from './impl.ts';

export const DEFAULT_INPUT: { N: number } = { N: 12 };

export function buildTrace(input: { N: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { N } = input;

  const seq: number[] = [];
  let cur = 0n;

  rec
    .begin({ zh: `用五边形数定理计算 p(0..${N})`, en: `Compute p(0..${N}) via pentagonal theorem` })
    .setAux([{ label: 'N', value: String(N), role: 'frontier' }])
    .commit();

  const hooks: PartitionPHooks = {
    onValue: (n, value) => {
      cur = value;
      seq[n] = Number(value);
      const roles: BarRole[] = new Array(seq.length).fill('default');
      roles[n] = 'final';
      rec
        .begin({ zh: `p(${n}) = ${value}`, en: `p(${n}) = ${value}` })
        .setArray(seq, roles, [{ index: n, label: 'n' }])
        .commit();
    },
  };

  partitionP(N, hooks);

  rec
    .begin({ zh: `完成：p(${N}) = ${cur}`, en: `Done: p(${N}) = ${cur}` })
    .setAux([{ label: `p(${N})`, value: cur.toString(), role: 'final' }])
    .commit();

  return rec.build();
}

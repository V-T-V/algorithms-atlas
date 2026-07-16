// =============================================================================
// Schröder 数 · 录制帧序列
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { schröder, type SchröderHooks } from './impl.ts';

export const DEFAULT_INPUT: { N: number } = { N: 8 };

export function buildTrace(input: { N: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { N } = input;

  const seq: number[] = [];
  let cur = 0n;

  rec
    .begin({ zh: `计算大 Schröder 数 S(0..${N})`, en: `Compute large Schröder numbers S(0..${N})` })
    .setAux([{ label: 'N', value: String(N), role: 'frontier' }])
    .commit();

  const hooks: SchröderHooks = {
    onValue: (n, value) => {
      cur = value;
      seq[n] = Number(value);
      const roles: BarRole[] = new Array(seq.length).fill('default');
      roles[n] = 'final';
      rec
        .begin({ zh: `S(${n}) = ${value}`, en: `S(${n}) = ${value}` })
        .setArray(seq, roles, [{ index: n, label: 'n' }])
        .commit();
    },
  };

  schröder(N, hooks);

  rec
    .begin({ zh: `完成：S(${N}) = ${cur}`, en: `Done: S(${N}) = ${cur}` })
    .setAux([{ label: `S(${N})`, value: cur.toString(), role: 'final' }])
    .commit();

  return rec.build();
}

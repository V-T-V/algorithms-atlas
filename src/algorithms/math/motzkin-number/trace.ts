// =============================================================================
// Motzkin 数 · 录制帧序列
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { motzkin, type MotzkinHooks } from './impl.ts';

export const DEFAULT_INPUT: { N: number } = { N: 10 };

export function buildTrace(input: { N: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { N } = input;

  const seq: number[] = [];
  let cur = 0n;

  rec
    .begin({ zh: `计算 Motzkin 数 M(0..${N})`, en: `Compute Motzkin numbers M(0..${N})` })
    .setAux([{ label: 'N', value: String(N), role: 'frontier' }])
    .commit();

  const hooks: MotzkinHooks = {
    onValue: (n, value) => {
      cur = value;
      seq[n] = Number(value);
      const roles: BarRole[] = new Array(seq.length).fill('default');
      roles[n] = 'final';
      rec
        .begin({ zh: `M(${n}) = ${value}`, en: `M(${n}) = ${value}` })
        .setArray(seq, roles, [{ index: n, label: 'n' }])
        .commit();
    },
  };

  motzkin(N, hooks);

  rec
    .begin({ zh: `完成：M(${N}) = ${cur}`, en: `Done: M(${N}) = ${cur}` })
    .setAux([{ label: `M(${N})`, value: cur.toString(), role: 'final' }])
    .commit();

  return rec.build();
}

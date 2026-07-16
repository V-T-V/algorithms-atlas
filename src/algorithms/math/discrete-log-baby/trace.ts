// =============================================================================
// BSGS 离散对数 · 录制帧序列
// =============================================================================

import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { discreteLog, type DiscreteLogBabyHooks } from './impl.ts';

export const DEFAULT_INPUT: { a: bigint; b: bigint; m: bigint } = { a: 3n, b: 13n, m: 17n };

export function buildTrace(
  input: { a: bigint | number; b: bigint | number; m: bigint | number } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const a = typeof input.a === 'number' ? BigInt(input.a) : input.a;
  const b = typeof input.b === 'number' ? BigInt(input.b) : input.b;
  const m = typeof input.m === 'number' ? BigInt(input.m) : input.m;

  rec
    .begin({ zh: `求 x 使 ${a}^x ≡ ${b} (mod ${m})`, en: `Find x with ${a}^x ≡ ${b} (mod ${m})` })
    .setAux([
      { label: 'a', value: a.toString(), role: 'frontier' },
      { label: 'b', value: b.toString(), role: 'frontier' },
      { label: 'm', value: m.toString(), role: 'frontier' },
    ])
    .commit();

  const hooks: DiscreteLogBabyHooks = {
    onBabySteps: (t) => {
      rec
        .begin({ zh: `小步数 t = ⌈√m⌉ = ${t}`, en: `Baby step count t = ⌈√m⌉ = ${t}` })
        .setAux([{ label: 't', value: t.toString(), role: 'compare' }])
        .commit();
    },
    onGiantStep: (i, val, hit) => {
      rec
        .begin({
          zh: `大步 i=${i}：值=${val}${hit ? '（命中）' : ''}`,
          en: `Giant step i=${i}: val=${val}${hit ? ' (hit)' : ''}`,
        })
        .setAux([
          { label: 'i', value: i.toString(), role: 'compare' },
          { label: '值', value: val.toString(), role: hit ? 'final' : 'frontier' },
        ])
        .commit();
    },
  };

  const x = discreteLog(a, b, m, hooks);

  rec
    .begin({ zh: x === null ? '无解' : `x = ${x}`, en: x === null ? 'No solution' : `x = ${x}` })
    .setAux([{ label: 'x', value: x === null ? '无解' : x.toString(), role: 'final' }])
    .commit();

  return rec.build();
}

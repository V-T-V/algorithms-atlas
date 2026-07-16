// =============================================================================
// floor_sum · 录制帧序列
// =============================================================================

import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { floorSum, type FloorSumModHooks } from './impl.ts';

export const DEFAULT_INPUT: { n: bigint; m: bigint; a: bigint; b: bigint } = {
  n: 10n,
  m: 4n,
  a: 3n,
  b: 2n,
};

export function buildTrace(
  input: {
    n: bigint | number;
    m: bigint | number;
    a: bigint | number;
    b: bigint | number;
  } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const { n, m, a, b } = input;

  const reductions: Array<{ n: string; m: string; a: string; b: string }> = [];

  rec
    .begin({
      zh: `计算 Σ⌊(${a}·i+${b})/${m}⌋ for i=0..${n}-1`,
      en: `Compute Σ⌊(${a}·i+${b})/${m}⌋ for i=0..${n}-1`,
    })
    .setAux([
      { label: 'n', value: String(n), role: 'frontier' },
      { label: 'm', value: String(m), role: 'frontier' },
      { label: 'a', value: String(a), role: 'frontier' },
      { label: 'b', value: String(b), role: 'frontier' },
    ])
    .commit();

  const hooks: FloorSumModHooks = {
    onReduce: (rn, rm, ra, rb) => {
      reductions.push({ n: rn.toString(), m: rm.toString(), a: ra.toString(), b: rb.toString() });
      rec
        .begin({
          zh: `规约 #${reductions.length}: (n=${rn}, m=${rm}, a=${ra}, b=${rb})`,
          en: `Reduce #${reductions.length}: (n=${rn}, m=${rm}, a=${ra}, b=${rb})`,
        })
        .setAux(
          reductions.map((r, i) => ({
            label: `#${i + 1}`,
            value: `(${r.n},${r.m},${r.a},${r.b})`,
            role: i === reductions.length - 1 ? 'compare' : 'default',
          })),
        )
        .commit();
    },
  };

  const s = floorSum(n, m, a, b, hooks);

  rec
    .begin({ zh: `结果 = ${s}`, en: `Result = ${s}` })
    .setAux([{ label: 'Σ', value: s.toString(), role: 'final' }])
    .commit();

  return rec.build();
}

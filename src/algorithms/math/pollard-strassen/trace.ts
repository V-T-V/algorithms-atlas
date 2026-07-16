// =============================================================================
// Pollard-Strassen · 录制帧序列
// =============================================================================

import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { pollardStrassen, type PollardStrassenHooks } from './impl.ts';

export const DEFAULT_INPUT: { n: bigint } = { n: 10403n };

export function buildTrace(input: { n: number | bigint } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const n = typeof input.n === 'number' ? BigInt(input.n) : input.n;

  let factor: bigint | null = null;

  rec
    .begin({ zh: `分解 ${n} 找一个非平凡因子`, en: `Factor ${n} for a non-trivial factor` })
    .setAux([{ label: 'n', value: n.toString(), role: 'frontier' }])
    .commit();

  const blocks: Array<{ lo: string; hi: string; g: string }> = [];
  const hooks: PollardStrassenHooks = {
    onBlock: (lo, hi, prod, g) => {
      blocks.push({ lo: lo.toString(), hi: hi.toString(), g: g.toString() });
      const hit = g > 1n;
      rec
        .begin({
          zh: `块 [${lo}, ${hi}]：乘积 mod n 的 gcd = ${g}${hit ? '（命中）' : ''}`,
          en: `Block [${lo}, ${hi}]: gcd of product mod n = ${g}${hit ? ' (hit)' : ''}`,
        })
        .setAux(
          blocks.map((b, i) => ({
            label: `块${i + 1}`,
            value: `[${b.lo},${b.hi}] g=${b.g}`,
            role: i === blocks.length - 1 && hit ? 'warn' : 'default',
          })),
        )
        .commit();
    },
  };

  factor = pollardStrassen(n, hooks);

  rec
    .begin({
      zh: factor === null ? `${n} 是素数` : `因子 = ${factor}（${n} = ${factor} × ${n / factor}）`,
      en:
        factor === null ? `${n} is prime` : `Factor = ${factor} (${n} = ${factor} × ${n / factor})`,
    })
    .setAux([{ label: '因子', value: factor === null ? '素数' : factor.toString(), role: 'final' }])
    .commit();

  return rec.build();
}

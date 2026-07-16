// =============================================================================
// 单值欧拉函数 · 录制帧序列
// =============================================================================

import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { phi, type PhiCalcHooks } from './impl.ts';

export const DEFAULT_INPUT: { n: bigint } = { n: 360n };

export function buildTrace(input: { n: number | bigint } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const n = typeof input.n === 'number' ? BigInt(input.n) : input.n;

  const factors: Array<{ p: string; e: number }> = [];
  let partial = n;

  rec
    .begin({ zh: `计算 φ(${n})`, en: `Compute φ(${n})` })
    .setAux([{ label: 'n', value: n.toString(), role: 'frontier' }])
    .commit();

  const hooks: PhiCalcHooks = {
    onFactor: (p, e) => {
      factors.push({ p: p.toString(), e });
    },
    onAccumulate: (p, e, v) => {
      partial = v;
      rec
        .begin({
          zh: `素因子 ${p}^${e}：result = result/${p}·(${p}−1) = ${v}`,
          en: `Factor ${p}^${e}: result = result/${p}·(${p}−1) = ${v}`,
        })
        .setAux(
          factors.map((f, i) => ({
            label: `${f.p}^${f.e}`,
            value: '',
            role: i === factors.length - 1 ? 'compare' : 'default',
          })),
        )
        .commit();
    },
  };

  const v = phi(n, hooks);

  rec
    .begin({ zh: `φ(${n}) = ${v}`, en: `φ(${n}) = ${v}` })
    .setAux([
      { label: 'φ(n)', value: v.toString(), role: 'final' },
      { label: '中间值', value: partial.toString(), role: 'default' },
    ])
    .commit();

  return rec.build();
}

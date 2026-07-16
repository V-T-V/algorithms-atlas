// =============================================================================
// 超级丑数 · 录制帧序列
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { nthSuperUglyNumber, type SuperUglyHooks } from './impl.ts';

export const DEFAULT_N = 12;
export const DEFAULT_PRIMES = [2, 7, 13, 19];

export function buildTrace(
  n: number = DEFAULT_N,
  primes: readonly number[] = DEFAULT_PRIMES,
): Frame[] {
  const rec = new TraceRecorder();
  const generated: Array<{ index: number; value: number; prime: number }> = [];

  rec
    .begin({
      zh: `求第 ${n} 个超级丑数，primes=[${primes.join(',')}]`,
      en: `Super ugly #${n}, primes=[${primes.join(',')}]`,
    })
    .setAux([
      { label: 'n', value: String(n), role: 'pivot' as BarRole },
      { label: 'primes', value: primes.join(','), role: 'compare' as BarRole },
    ])
    .commit();

  const hooks: SuperUglyHooks = {
    onGenerate: (index, value, prime) => generated.push({ index, value, prime }),
  };

  const result = nthSuperUglyNumber(n, primes, hooks);

  for (const g of generated) {
    rec
      .begin({
        zh: `ugly[${g.index}] = ${g.value}（×${g.prime}）`,
        en: `ugly[${g.index}] = ${g.value} (×${g.prime})`,
      })
      .setAux([
        { label: '下标', value: String(g.index), role: 'compare' as BarRole },
        { label: '值', value: String(g.value), role: 'final' as BarRole },
        { label: '来源', value: `×${g.prime}`, role: 'pivot' as BarRole },
      ])
      .commit();
  }

  rec
    .begin({ zh: `第 ${n} 个超级丑数 = ${result}`, en: `Super ugly #${n} = ${result}` })
    .setAux([{ label: '答案', value: String(result), role: 'final' as BarRole }])
    .commit();

  return rec.build();
}

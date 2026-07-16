import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { twinPrimes, type TwinPrimeHooks } from './impl.ts';

export const DEFAULT_N = 20;

export function buildTrace(n: number = DEFAULT_N): Frame[] {
  const rec = new TraceRecorder();
  const isPrime: boolean[] = [];

  rec
    .begin({ zh: `筛 [0..${n}]`, en: `Sieve [0..${n}]` })
    .setBars(Array.from({ length: n + 1 }, (_, i) => ({ value: i, role: 'default' as BarRole })))
    .setAux([{ label: '阶段', value: '建筛', role: 'frontier' }])
    .commit();

  const hooks: TwinPrimeHooks = {
    onSieve: (idx, ip) => {
      isPrime[idx] = ip;
    },
    onPair: (p) => {
      rec
        .begin({ zh: `发现对 (${p},${p + 2})`, en: `Pair (${p},${p + 2})` })
        .setBars(
          isPrime.map((ip, i) => ({
            value: i,
            role: (i === p || i === p + 2 ? 'final' : ip ? 'sorted' : 'default') as BarRole,
          })),
        )
        .setAux([{ label: '对', value: `(${p},${p + 2})`, role: 'final' }])
        .commit();
    },
  };

  const { pairs } = twinPrimes(n, hooks);

  rec
    .begin({ zh: `共 ${pairs.length} 对`, en: `${pairs.length} pairs` })
    .setAux([{ label: '对数', value: String(pairs.length), role: 'final' }])
    .commit();

  return rec.build();
}

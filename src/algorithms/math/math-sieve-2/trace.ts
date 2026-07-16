import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { sieve, type SieveHooks } from './impl.ts';

export const DEFAULT_N = 30;

export function buildTrace(n: number = DEFAULT_N): Frame[] {
  const rec = new TraceRecorder();
  const isPrime: boolean[] = [];

  rec
    .begin({ zh: `筛 [0..${n}]`, en: `Sieve [0..${n}]` })
    .setAux([{ label: '上限', value: String(n), role: 'frontier' }])
    .commit();

  const hooks: SieveHooks = {
    onMark: (i, ip) => {
      isPrime[i] = ip;
      rec
        .begin({ zh: `${i} ${ip ? '素' : '合'}`, en: `${i} ${ip ? 'prime' : 'composite'}` })
        .setBars(
          isPrime.map((ip2, idx) => ({
            value: idx,
            role: (idx === i ? (ip ? 'final' : 'warn') : ip2 ? 'sorted' : 'default') as BarRole,
          })),
        )
        .setAux([
          {
            label: '当前',
            value: `${i}=${ip ? '素' : '合'}`,
            role: ip ? 'final' : ('warn' as BarRole),
          },
        ])
        .commit();
    },
  };

  const { primes } = sieve(n, hooks);

  rec
    .begin({ zh: `共 ${primes.length} 个素数`, en: `${primes.length} primes` })
    .setAux([{ label: '素数个数', value: String(primes.length), role: 'final' }])
    .commit();

  return rec.build();
}

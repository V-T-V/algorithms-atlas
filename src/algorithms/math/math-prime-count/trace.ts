// =============================================================================
// 素数计数 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { primeCount, type PrimeCountHooks } from './impl.ts';

export const DEFAULT_N = 30;

export function buildTrace(n: number = DEFAULT_N): Frame[] {
  const rec = new TraceRecorder();
  const isPrime = new Array<boolean>(Math.max(n + 1, 1)).fill(true);
  if (n >= 0) isPrime[0] = false;
  if (n >= 1) isPrime[1] = false;
  let ans = 0;

  const snap = (note: { zh: string; en: string }): void => {
    const nums = Array.from({ length: Math.max(n, 1) }, (_, i) => i + 1);
    rec
      .begin(note)
      .setBars(
        nums.map((v) => ({
          value: v,
          role: (v <= n && isPrime[v] ? 'final' : 'default') as BarRole,
        })),
      )
      .setAux([{ label: '当前 π', value: String(ans), role: 'pivot' }])
      .commit();
  };

  snap({ zh: `n=${n}`, en: `n=${n}` });

  const hooks: PrimeCountHooks = {
    onSieve: (c) => {
      ans = c;
      // 重建 isPrime 用于展示（用 primes 列表）
      snap({ zh: `筛完，π(${n})=${c}`, en: `Done, π(${n})=${c}` });
    },
    onDone: (c) => {
      ans = c;
      snap({ zh: `π(${n})=${c}`, en: `π(${n})=${c}` });
    },
  };

  // 单独标记 primes 给展示用
  if (n >= 2) {
    const isComp = new Uint8Array(n + 1);
    const primes: number[] = [];
    for (let i = 2; i <= n; i++) {
      if (!isComp[i]!) primes.push(i);
      for (const p of primes) {
        const ip = i * p;
        if (ip > n) break;
        isComp[ip] = 1;
        if (i % p === 0) break;
      }
    }
    for (let i = 0; i <= n; i++) isPrime[i] = !isComp[i]!;
  }

  primeCount(n, hooks);

  rec
    .begin({ zh: `完成：π(${n})=${ans}`, en: `Done: π(${n})=${ans}` })
    .setAux([{ label: '素数个数', value: String(ans), role: 'final' }])
    .commit();

  return rec.build();
}

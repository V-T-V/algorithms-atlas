// 莫比乌斯反演 · 录制帧序列

import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { mobiusSieve, mobiusInvert, type MobiusHooks } from './impl.ts';

/** 默认上界：求 μ[0..20] 并演示反演。 */
export const DEFAULT_INPUT = 20;

/** 录制演示帧序列。 */
export function buildTrace(input: number = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const mu = new Array<number>(input + 1).fill(0);

  rec
    .begin({ zh: `准备：筛 μ[0..${input}]`, en: `Setup: sieve μ[0..${input}]` })
    .setBars(rec.barsFrom(mu))
    .commit();

  const hooks: MobiusHooks = {
    onPrime: (p) => {
      mu[p] = -1;
      rec
        .begin({ zh: `素数 ${p} → μ=${-1}`, en: `Prime ${p} → μ=${-1}` })
        .setBars(
          rec.barsFrom(
            mu,
            mu.map((_, i) => (i === p ? 'pivot' : 'default')),
          ),
        )
        .commit();
    },
    onMark: (c, p, m) => {
      mu[c] = m;
      rec
        .begin({
          zh: `${c} = i×${p}，${c} % ${p}² ${m === 0 ? '为 0 → μ=0（含平方因子）' : `→ μ=${m}`}`,
          en: `${c} = i×${p}, μ=${m}${m === 0 ? ' (square factor)' : ''}`,
        })
        .setBars(
          rec.barsFrom(
            mu,
            mu.map((_, i) => (i === c ? 'swap' : 'default')),
          ),
        )
        .commit();
    },
    onDone: () => {
      rec
        .begin({ zh: `μ 表就绪`, en: `μ table ready` })
        .setBars(
          rec.barsFrom(
            mu,
            mu.map(() => 'sorted' as const),
          ),
        )
        .commit();
    },
  };

  mobiusSieve(input, hooks);

  // 演示反演：取 g(n)=n（即 g=Σ φ），反演应得到 f(n)=φ(n)
  const g = Array.from({ length: input + 1 }, (_, i) => i);
  const phi = new Array<number>(input + 1).fill(0);
  for (let n = 1; n <= input; n++) phi[n] = mobiusInvert(g, n, mu);

  rec
    .begin({
      zh: `反演演示：g(n)=n → f(n)=φ(n)`,
      en: `Inversion demo: g(n)=n → f(n)=φ(n)`,
    })
    .setBars(
      rec.barsFrom(
        phi,
        phi.map(() => 'final' as const),
      ),
    )
    .commit();

  return rec.build();
}

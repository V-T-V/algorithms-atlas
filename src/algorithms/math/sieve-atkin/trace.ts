// =============================================================================
// Atkin 筛 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { sieveAtkin, type AtkinHooks } from './impl.ts';

export const DEFAULT_INPUT = 30;

export function buildTrace(input: number = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const limit = input;
  // 布尔表展示
  const table: Array<{ n: number; prime: boolean; flipped: boolean }> = [];
  for (let i = 0; i <= limit; i++) table.push({ n: i, prime: i === 2 || i === 3, flipped: false });
  let cur = -1;
  let result: number[] = [];

  const snap = (note: { zh: string; en: string }): void => {
    const bars = table.map(({ n, prime, flipped }) => ({
      value: n,
      role: (result.length > 0
        ? prime
          ? 'final'
          : 'default'
        : flipped
          ? 'compare'
          : prime
            ? 'frontier'
            : 'default') as BarRole,
      label: String(n),
    }));
    rec
      .begin(note)
      .setBars(bars)
      .setAux([{ label: '当前', value: cur >= 0 ? String(cur) : '∅', role: 'compare' }])
      .commit();
  };

  snap({ zh: `Atkin 筛 [2, ${limit}]`, en: `Atkin sieve [2, ${limit}]` });

  const hooks: AtkinHooks = {
    onFlip: (n) => {
      if (table[n]!) table[n]!.flipped = true;
      cur = n;
      snap({ zh: `翻转候选 ${n}`, en: `Flip candidate ${n}` });
    },
    onSieveSquare: (r) => {
      cur = r;
      snap({ zh: `用素数 ${r} 的平方筛`, en: `Sieve multiples of ${r}²` });
    },
    onResult: (primes) => {
      result = [...primes];
      for (const p of primes) if (table[p]!) table[p]!.prime = true;
      for (const t of table) if (!result.includes(t.n)) t.prime = false;
      cur = -1;
      snap({ zh: `共 ${primes.length} 个素数`, en: `${primes.length} primes` });
    },
  };

  sieveAtkin(limit, hooks);

  rec
    .begin({ zh: `完成：${result.length} 个素数`, en: `Done: ${result.length} primes` })
    .setBars(
      table.map(({ n, prime }) => ({
        value: n,
        role: (prime ? 'final' : 'default') as BarRole,
        label: prime ? `${n}` : '·',
      })),
    )
    .setAux([{ label: '素数', value: result.join(','), role: 'final' }])
    .commit();

  return rec.build();
}

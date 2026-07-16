// =============================================================================
// 分段筛 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { sieveSegmented, type SegmentedHooks } from './impl.ts';

export const DEFAULT_INPUT = { L: 50, R: 100 };

export function buildTrace(input: { L: number; R: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { L, R } = input;
  const lo = Math.max(L, 2);
  const size = R - lo + 1;
  const table: Array<{ n: number; prime: boolean }> = [];
  for (let k = 0; k < size; k++) table.push({ n: lo + k, prime: true });
  let cur = -1;
  let result: number[] = [];

  const snap = (note: { zh: string; en: string }): void => {
    const bars = table.map(({ n, prime }) => ({
      value: n,
      role: (result.length > 0
        ? prime
          ? 'final'
          : 'default'
        : n === cur
          ? 'compare'
          : prime
            ? 'frontier'
            : 'warn') as BarRole,
      label: String(n),
    }));
    rec
      .begin(note)
      .setBars(bars)
      .setAux([
        { label: '当前', value: cur >= 0 ? String(cur) : '∅', role: 'compare' },
        {
          label: '素数数',
          value: String(result.length || table.filter((t) => t.prime).length),
          role: 'final',
        },
      ])
      .commit();
  };

  snap({ zh: `分段筛 [${L}, ${R}]`, en: `Segmented sieve [${L}, ${R}]` });

  const hooks: SegmentedHooks = {
    onBasePrime: (p) => {
      cur = p;
      snap({ zh: `基素数 ${p}`, en: `Base prime ${p}` });
    },
    onMark: (composite) => {
      const idx = composite - lo;
      if (idx >= 0 && idx < table.length && table[idx]!) table[idx]!.prime = false;
      cur = composite;
      snap({ zh: `划去合数 ${composite}`, en: `Mark composite ${composite}` });
    },
    onResult: (primes) => {
      result = [...primes];
      for (const t of table) if (!result.includes(t.n)) t.prime = false;
      cur = -1;
      snap({ zh: `共 ${primes.length} 个素数`, en: `${primes.length} primes` });
    },
  };

  sieveSegmented(L, R, hooks);

  rec
    .begin({ zh: `完成：${result.length}`, en: `Done: ${result.length}` })
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

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { trailingZeros, type TrailingZerosHooks } from './impl.ts';

export const DEFAULT_N = 100;

export function buildTrace(n: number = DEFAULT_N): Frame[] {
  const rec = new TraceRecorder();
  const terms: Array<{ power: number; term: number }> = [];

  rec
    .begin({ zh: `n=${n}`, en: `n=${n}` })
    .setAux([{ label: '输入', value: String(n), role: 'frontier' }])
    .commit();

  const hooks: TrailingZerosHooks = {
    onTerm: (power, term, sum) => {
      terms.push({ power, term });
      rec
        .begin({
          zh: `⌊${n}/${power}⌋=${term}，累加=${sum}`,
          en: `floor(${n}/${power})=${term}, sum=${sum}`,
        })
        .setBars(terms.map((t) => ({ value: t.term, role: 'compare' as BarRole })))
        .setAux([
          { label: '5^k', value: String(power), role: 'frontier' },
          { label: '项', value: String(term), role: 'compare' },
          { label: '累加', value: String(sum), role: 'final' },
        ])
        .commit();
    },
  };

  const ans = trailingZeros(n, hooks);

  rec
    .begin({ zh: `尾部零=${ans}`, en: `Trailing zeros=${ans}` })
    .setAux([{ label: '结果', value: String(ans), role: 'final' }])
    .commit();

  return rec.build();
}

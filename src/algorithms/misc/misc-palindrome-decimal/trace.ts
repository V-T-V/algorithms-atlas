import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { palindromeConstruct } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const n = 87;
  rec.begin({ zh: `回文构造 ${n}`, en: `Palindrome ${n}` }).commit();
  const r = palindromeConstruct(n, 20, {
    onIter: (i, x) =>
      rec
        .begin({ zh: `迭代${i}: ${x}`, en: `iter${i}: ${x}` })
        .setBars([{ value: x % 1000, role: 'pivot' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: `回文 ${r.palindrome} @${r.iters}步`, en: `pal ${r.palindrome} @${r.iters}` })
    .setAux([{ label: 'pal', value: String(r.palindrome), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}

// =============================================================================
// 双哈希 · 录制
import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { DoubleHash3 } from './impl.ts';

export const DEFAULT_INPUT = 'abababab';

export function buildTrace(input: string = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const h = new DoubleHash3(input);

  const a = h.hash(0, 1);
  const b = h.hash(2, 3);
  const c = h.hash(4, 5);

  for (const [label, hh] of [
    ['[0,1]', a],
    ['[2,3]', b],
    ['[4,5]', c],
  ] as const) {
    rec
      .begin({
        zh: `双哈希 ${label} = (${hh.h1}, ${hh.h2})`,
        en: `Double hash ${label} = (${hh.h1}, ${hh.h2})`,
      })
      .setBars(input.split('').map((ch) => ({ value: ch.charCodeAt(0), role: 'compare' })))
      .setAux([
        { label: 'h1', value: String(hh.h1), role: 'pivot' },
        { label: 'h2', value: String(hh.h2), role: 'pivot' },
      ])
      .commit();
  }

  const eq = a.h1 === b.h1 && a.h2 === b.h2 && b.h1 === c.h1 && b.h2 === c.h2;
  rec
    .begin({ zh: `三段哈希${eq ? '一致' : '不一致'}`, en: `Hashes ${eq ? 'match' : 'differ'}` })
    .setBars(input.split('').map((ch) => ({ value: ch.charCodeAt(0), role: 'final' })))
    .setAux([{ label: 'match', value: String(eq), role: 'final' }])
    .commit();

  return rec.build();
}

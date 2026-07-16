import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { makeUniversalHasher } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  let s = 7;
  const rng = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  rec.begin({ zh: '通用哈希族 m=10', en: 'Universal hash m=10' }).commit();
  const h = makeUniversalHasher(10, rng, {
    onPick: (a, b) =>
      rec
        .begin({ zh: `a=${a} b=${b}`, en: `a=${a} b=${b}` })
        .setAux([
          { label: 'a', value: String(a), role: 'pivot' as BarRole },
          { label: 'b', value: String(b), role: 'pivot' as BarRole },
        ])
        .commit(),
  });
  const keys = [1, 2, 3, 4, 5];
  for (const k of keys) h(k);
  rec
    .begin({ zh: '哈希完成', en: 'hashed' })
    .setBars(keys.map((k) => ({ value: h(k), role: 'final' as BarRole })))
    .commit();
  return rec.build();
}

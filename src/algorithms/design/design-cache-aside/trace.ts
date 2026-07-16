import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { CacheAside } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const ca = new CacheAside<string, string>((k) => `db(${k})`, {
    onHit: (k) =>
      rec
        .begin({ zh: `hit ${k}`, en: `hit ${k}` })
        .setAux([{ label: 'hit', value: k, role: 'final' as BarRole }])
        .commit(),
    onMiss: (k) =>
      rec
        .begin({ zh: `miss ${k}`, en: `miss ${k}` })
        .setAux([{ label: 'miss', value: k, role: 'warn' as BarRole }])
        .commit(),
    onFill: (k) =>
      rec
        .begin({ zh: `fill ${k}`, en: `fill ${k}` })
        .setAux([{ label: 'fill', value: k, role: 'compare' as BarRole }])
        .commit(),
    onInvalidate: (k) =>
      rec
        .begin({ zh: `invalidate ${k}`, en: '' })
        .setAux([{ label: 'inv', value: k, role: 'warn' as BarRole }])
        .commit(),
  });
  ca.get('a');
  ca.get('a');
  ca.invalidate('a');
  ca.get('a');
  return rec.build();
}

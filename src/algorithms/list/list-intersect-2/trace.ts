import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { getIntersection } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const shared: any = { value: 8, next: { value: 10, next: null } };
  const a: any = { value: 1, next: { value: 2, next: shared } };
  const b: any = { value: 3, next: shared };
  rec.begin({ zh: '求交点', en: 'Find intersection' }).commit();
  const node = getIntersection(a, b, {
    onStep: (va, vb) =>
      rec
        .begin({ zh: 'pa=' + va + ' pb=' + vb, en: 'pa=' + va + ' pb=' + vb })
        .setAux([
          { label: 'pa', value: String(va), role: 'pivot' as BarRole },
          { label: 'pb', value: String(vb), role: 'frontier' as BarRole },
        ])
        .commit(),
  });
  rec
    .begin({ zh: '交点 = ' + (node?.value ?? null), en: 'intersect = ' + (node?.value ?? null) })
    .setAux([{ label: 'intersect', value: String(node?.value ?? null), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}

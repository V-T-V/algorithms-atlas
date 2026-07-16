import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { vcgAuction } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const V = [5, 8, 6];
  rec
    .begin({ zh: 'VCG: 估值 [5,8,6]', en: 'VCG: values [5,8,6]' })
    .setBars(V.map((v) => ({ value: v, role: 'default' as BarRole })))
    .commit();
  vcgAuction(V, {
    onAllocate: (w, p) =>
      rec
        .begin({ zh: `赢家${w} 支付${p}`, en: `winner${w} pays${p}` })
        .setBars(
          V.map((v, i) => ({
            value: v,
            role: i === w ? ('final' as BarRole) : ('default' as BarRole),
          })),
        )
        .setAux([{ label: '价格', value: String(p), role: 'pivot' as BarRole }])
        .commit(),
  });
  return rec.build();
}

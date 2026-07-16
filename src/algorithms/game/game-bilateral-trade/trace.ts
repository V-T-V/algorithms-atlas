import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { bilateralTrade } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const prices = [3, 5, 7, 9];
  rec
    .begin({ zh: '双边贸易: buyer=10 seller=4', en: 'Bilateral trade: buyer=10 seller=4' })
    .setAux([
      { label: 'buyer', value: '10', role: 'final' as BarRole },
      { label: 'seller', value: '4', role: 'warn' as BarRole },
    ])
    .commit();
  bilateralTrade(10, 4, prices, {
    onPrice: (p, tr, w) =>
      rec
        .begin({
          zh: `价格${p}: ${tr ? '成交' : '不成交'} 福利${w}`,
          en: `price${p}: ${tr ? 'trade' : 'no'} welfare${w}`,
        })
        .setBars([{ value: w, role: tr ? ('final' as BarRole) : ('default' as BarRole) }])
        .commit(),
  });
  return rec.build();
}

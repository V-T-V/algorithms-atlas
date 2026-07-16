import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { allPayAuction } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const bids = [2, 5, 3];
  rec
    .begin({ zh: '全付拍卖: v=10', en: 'All-pay auction: v=10' })
    .setBars(bids.map((b) => ({ value: b, role: 'default' as BarRole })))
    .commit();
  const r = allPayAuction(bids, 10, {
    onOutcome: (w, mx, tot) =>
      rec
        .begin({ zh: `赢家${w} 最高${mx} 总付${tot}`, en: `winner${w} max${mx} total${tot}` })
        .setBars(
          bids.map((_, i) => ({
            value: bids[i]!,
            role: i === w ? ('final' as BarRole) : ('warn' as BarRole),
          })),
        )
        .commit(),
  });
  void r;
  return rec.build();
}

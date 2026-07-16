// =============================================================================
// 股票 VI · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { maxProfitFee, type StockFeeHooks } from './impl.ts';

export const DEFAULT_INPUT = { prices: [1, 3, 2, 8, 4, 9], fee: 2 };

export function buildTrace(input: { prices: number[]; fee: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { prices, fee } = input;
  let cash = 0;
  let hold = -prices[0]!;
  let ci = 0;

  const snap = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setBars(
        prices.map((p, i) => ({ value: p, role: (i === ci ? 'compare' : 'default') as BarRole })),
      )
      .setAux([
        { label: '手续费', value: String(fee), role: 'warn' },
        { label: 'cash', value: String(cash), role: 'frontier' },
        { label: 'hold', value: String(hold), role: 'pivot' },
      ])
      .commit();
  };

  snap({
    zh: `prices=[${prices.join(',')}] fee=${fee}`,
    en: `prices=[${prices.join(',')}] fee=${fee}`,
  });

  const hooks: StockFeeHooks = {
    onDay: (i, _p, c, h) => {
      cash = c;
      hold = h;
      ci = i;
      snap({
        zh: `第${i}日 cash=${c.toFixed(2)} hold=${h.toFixed(2)}`,
        en: `Day ${i} cash=${c.toFixed(2)} hold=${h.toFixed(2)}`,
      });
    },
  };

  const ans = maxProfitFee(prices, fee, hooks);

  rec
    .begin({ zh: `最大利润=${ans}`, en: `Max profit=${ans}` })
    .setBars(prices.map((p) => ({ value: p, role: 'final' as BarRole })))
    .setAux([{ label: '利润', value: String(ans), role: 'final' }])
    .commit();

  return rec.build();
}

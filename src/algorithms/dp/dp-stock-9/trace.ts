import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { maxProfitCooldown, type StockCoolHooks } from './impl.ts';

export const DEFAULT_PRICES = [1, 2, 3, 0, 2];

export function buildTrace(prices: readonly number[] = DEFAULT_PRICES): Frame[] {
  const rec = new TraceRecorder();
  rec
    .begin({ zh: `${prices.length} 天股价`, en: `${prices.length} days` })
    .setBars(prices.map((p) => ({ value: p, role: 'default' as BarRole })))
    .commit();
  const hooks: StockCoolHooks = {
    onDay: (i, price, hold, cash, cool) => {
      rec
        .begin({ zh: `第${i}天 价${price}`, en: `Day ${i} price ${price}` })
        .setBars(
          prices.map((p, j) => ({ value: p, role: (j === i ? 'compare' : 'default') as BarRole })),
        )
        .setAux([
          { label: 'cash', value: String(cash), role: 'frontier' },
          { label: 'hold', value: String(hold), role: 'frontier' },
          { label: 'cool', value: String(cool), role: 'warn' },
        ])
        .commit();
    },
  };
  const ans = maxProfitCooldown(prices, hooks);
  rec
    .begin({ zh: `最大利润=${ans}`, en: `Max profit=${ans}` })
    .setAux([{ label: '答案', value: String(ans), role: 'final' }])
    .commit();
  return rec.build();
}

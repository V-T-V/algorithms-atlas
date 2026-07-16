import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { maxProfitFee, type StockFeeHooks } from './impl.ts';

export const DEFAULT_PRICES = [1, 3, 2, 8, 4, 9];
export const DEFAULT_FEE = 2;

export function buildTrace(
  prices: readonly number[] = DEFAULT_PRICES,
  fee: number = DEFAULT_FEE,
): Frame[] {
  const rec = new TraceRecorder();
  rec
    .begin({
      zh: `股价 ${prices.length} 天，手续费 ${fee}`,
      en: `${prices.length} days, fee ${fee}`,
    })
    .setBars(prices.map((p) => ({ value: p, role: 'default' as BarRole })))
    .commit();
  const hooks: StockFeeHooks = {
    onDay: (i, price, hold, cash) => {
      rec
        .begin({
          zh: `第${i}天 价${price} cash=${cash} hold=${hold}`,
          en: `Day ${i} price ${price} cash=${cash} hold=${hold}`,
        })
        .setBars(
          prices.map((p, j) => ({ value: p, role: (j === i ? 'compare' : 'default') as BarRole })),
        )
        .setAux([
          { label: 'cash', value: String(cash), role: 'frontier' },
          { label: 'hold', value: String(hold), role: 'frontier' },
        ])
        .commit();
    },
  };
  const ans = maxProfitFee(prices, fee, hooks);
  rec
    .begin({ zh: `最大利润=${ans}`, en: `Max profit=${ans}` })
    .setAux([{ label: '答案', value: String(ans), role: 'final' }])
    .commit();
  return rec.build();
}

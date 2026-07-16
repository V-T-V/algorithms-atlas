// 购物折扣（贪心凑单）· 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { greedyDiscount, type GreedyDiscountHooks } from './impl.ts';

export const DEFAULT_INPUT = {
  prices: [100, 80, 60, 50, 40, 30, 20],
  threshold: 150,
  deduction: 30,
};

export function buildTrace(
  input: {
    prices: ReadonlyArray<number>;
    threshold: number;
    deduction: number;
  } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const { prices, threshold, deduction } = input;

  rec
    .begin({
      zh: `${prices.length} 件商品，满 ${threshold} 减 ${deduction}`,
      en: `${prices.length} items, spend ${threshold} save ${deduction}`,
    })
    .setBars(prices.map((p) => ({ value: p, role: 'default' as BarRole })))
    .commit();

  const hooks: GreedyDiscountHooks = {
    onGroup: (group, paid, saved) => {
      rec
        .begin({
          zh: `成组 ${group.join(',')}，付 ${paid} 省 ${saved}`,
          en: `Group ${group.join(',')} pay ${paid} save ${saved}`,
        })
        .setBars(group.map((p) => ({ value: p, role: 'final' as BarRole })))
        .setAux([{ label: '本组支付', value: String(paid), role: 'final' }])
        .commit();
    },
    onLeftover: (price) => {
      rec
        .begin({ zh: `散件原价 ${price}`, en: `Leftover full price ${price}` })
        .setBars([{ value: price, role: 'warn' as BarRole }])
        .commit();
    },
  };

  const { totalPaid, totalSaved } = greedyDiscount(prices, threshold, deduction, hooks);

  rec
    .begin({
      zh: `总付 ${totalPaid}，总省 ${totalSaved}`,
      en: `Total paid ${totalPaid}, saved ${totalSaved}`,
    })
    .setAux([{ label: '结果', value: `付=${totalPaid} 省=${totalSaved}`, role: 'final' }])
    .commit();

  return rec.build();
}

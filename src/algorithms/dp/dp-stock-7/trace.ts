// =============================================================================
// 股票 VII · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { maxProfitCooldown, type StockCooldownHooks } from './impl.ts';

export const DEFAULT_INPUT = [1, 2, 3, 0, 2];

export function buildTrace(prices: readonly number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  let hold = -prices[0]!;
  let cash = 0;
  let cool = 0;
  let ci = 0;

  const snap = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setBars(
        prices.map((p, i) => ({ value: p, role: (i === ci ? 'compare' : 'default') as BarRole })),
      )
      .setAux([
        { label: 'hold', value: String(hold), role: 'pivot' },
        { label: 'cash', value: String(cash), role: 'frontier' },
        { label: 'cool', value: String(cool), role: 'warn' },
      ])
      .commit();
  };

  snap({ zh: `prices=[${prices.join(',')}]`, en: `prices=[${prices.join(',')}]` });

  const hooks: StockCooldownHooks = {
    onDay: (i, h, c, co) => {
      hold = h;
      cash = c;
      cool = co;
      ci = i;
      snap({
        zh: `第${i}日 hold=${h} cash=${c} cool=${co}`,
        en: `Day ${i} hold=${h} cash=${c} cool=${co}`,
      });
    },
  };

  const ans = maxProfitCooldown(prices, hooks);

  rec
    .begin({ zh: `最大利润=${ans}`, en: `Max profit=${ans}` })
    .setAux([{ label: '利润', value: String(ans), role: 'final' }])
    .commit();

  return rec.build();
}

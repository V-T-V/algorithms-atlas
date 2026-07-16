// =============================================================================
// 买卖股票含冷冻期 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { stockCooldown, type StockCooldownHooks } from './impl.ts';

export const DEFAULT_PRICES = [1, 2, 3, 0, 2];

export function buildTrace(prices: readonly number[] = DEFAULT_PRICES): Frame[] {
  const rec = new TraceRecorder();
  const holdArr: number[] = [];
  const soldArr: number[] = [];
  const restArr: number[] = [];
  let ans = 0;
  let cur = -1;

  const snap = (note: { zh: string; en: string }): void => {
    const roles: BarRole[] = prices.map((_, i) =>
      i === cur ? 'pivot' : i === prices.length - 1 ? 'final' : 'default',
    );
    rec
      .begin(note)
      .setArray([...prices], roles, [{ index: cur < 0 ? 0 : cur, label: 'd' }])
      .setAux([
        { label: 'hold', value: holdArr.map((v) => `${v}`).join(' ') || '-', role: 'compare' },
        { label: 'sold', value: soldArr.map((v) => `${v}`).join(' ') || '-', role: 'swap' },
        { label: 'rest', value: restArr.map((v) => `${v}`).join(' ') || '-', role: 'frontier' },
      ])
      .commit();
  };

  snap({ zh: `prices=[${prices.join(',')}]`, en: `prices=[${prices.join(',')}]` });

  if (prices.length > 0) {
    holdArr.push(-prices[0]!);
    soldArr.push(0);
    restArr.push(0);
  }

  const hooks: StockCooldownHooks = {
    onDay: (i, _p, h, s, r) => {
      holdArr[i] = h;
      soldArr[i] = s;
      restArr[i] = r;
      cur = i;
      snap({
        zh: `day ${i}: hold=${h} sold=${s} rest=${r}`,
        en: `day ${i}: hold=${h} sold=${s} rest=${r}`,
      });
    },
    onDone: (p) => {
      ans = p;
      cur = -1;
      snap({ zh: `最大利润=${p}`, en: `max profit=${p}` });
    },
  };

  stockCooldown(prices, hooks);

  rec
    .begin({ zh: `完成：${ans}`, en: `Done: ${ans}` })
    .setBars(prices.map((p) => ({ value: p, role: 'final' as BarRole })))
    .setAux([{ label: '最大利润', value: String(ans), role: 'final' }])
    .commit();

  return rec.build();
}

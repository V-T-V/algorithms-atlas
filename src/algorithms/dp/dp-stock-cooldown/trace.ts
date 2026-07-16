// =============================================================================
// 含冷冻期股票 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { maxProfitCooldown, type StockCooldownHooks } from './impl.ts';

export const DEFAULT_INPUT = [1, 2, 3, 0, 2];

export function buildTrace(input: readonly number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const n = input.length;
  const holdArr: string[] = new Array<string>(n).fill('·');
  const soldArr: string[] = new Array<string>(n).fill('·');
  const restArr: string[] = new Array<string>(n).fill('·');
  let cur = -1;
  let ans = 0;

  const snap = (note: { zh: string; en: string }): void => {
    const roles: BarRole[] = input.map((_, i) => (i === cur ? 'compare' : 'default'));
    rec
      .begin(note)
      .setBars(rec.barsFrom(input, Object.fromEntries(roles.map((r, i) => [i, r]))))
      .setAux([
        { label: 'hold', value: holdArr.join(' '), role: 'swap' },
        { label: 'sold', value: soldArr.join(' '), role: 'frontier' },
        { label: 'rest', value: restArr.join(' '), role: 'pivot' },
      ])
      .commit();
  };

  snap({ zh: `prices=[${input.join(', ')}]`, en: `prices=[${input.join(', ')}]` });

  const hooks: StockCooldownHooks = {
    onDay: (i, _p, hold, sold, rest) => {
      holdArr[i] = `${hold}`;
      soldArr[i] = sold === -Infinity ? '-∞' : `${sold}`;
      restArr[i] = `${rest}`;
      cur = i;
      snap({
        zh: `第 ${i} 天：hold=${hold}, sold=${sold}, rest=${rest}`,
        en: `Day ${i}: hold=${hold}, sold=${sold}, rest=${rest}`,
      });
    },
    onResult: (t) => {
      ans = t;
      cur = -1;
      snap({ zh: `最大利润 = ${t}`, en: `Max profit = ${t}` });
    },
  };

  maxProfitCooldown(input, hooks);

  rec
    .begin({ zh: `完成：${ans}`, en: `Done: ${ans}` })
    .setBars(rec.barsFrom(input))
    .setAux([{ label: '利润 / profit', value: String(ans), role: 'final' }])
    .commit();

  return rec.build();
}

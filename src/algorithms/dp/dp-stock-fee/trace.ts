// =============================================================================
// 含手续费股票 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { maxProfitWithFee, type StockFeeHooks } from './impl.ts';

export const DEFAULT_INPUT = [1, 3, 2, 8, 4, 9];
export const DEFAULT_FEE = 2;

export function buildTrace(
  input: readonly number[] = DEFAULT_INPUT,
  fee: number = DEFAULT_FEE,
): Frame[] {
  const rec = new TraceRecorder();
  const n = input.length;
  const holdArr: string[] = new Array<string>(n).fill('·');
  const cashArr: string[] = new Array<string>(n).fill('·');
  let cur = -1;
  let ans = 0;

  const snap = (note: { zh: string; en: string }): void => {
    const roles: BarRole[] = input.map((_, i) => (i === cur ? 'compare' : 'default'));
    rec
      .begin(note)
      .setBars(rec.barsFrom(input, Object.fromEntries(roles.map((r, i) => [i, r]))))
      .setAux([
        { label: 'hold', value: holdArr.join(' '), role: 'swap' },
        { label: 'cash', value: cashArr.join(' '), role: 'frontier' },
        { label: 'fee', value: String(fee), role: 'pivot' },
      ])
      .commit();
  };

  snap({
    zh: `prices=[${input.join(', ')}] fee=${fee}`,
    en: `prices=[${input.join(', ')}] fee=${fee}`,
  });

  const hooks: StockFeeHooks = {
    onDay: (i, _p, hold, cash) => {
      holdArr[i] = `${hold}`;
      cashArr[i] = `${cash}`;
      cur = i;
      snap({
        zh: `第 ${i} 天：hold=${hold}, cash=${cash}`,
        en: `Day ${i}: hold=${hold}, cash=${cash}`,
      });
    },
    onResult: (t) => {
      ans = t;
      cur = -1;
      snap({ zh: `最大利润 = ${t}`, en: `Max profit = ${t}` });
    },
  };

  maxProfitWithFee(input, fee, hooks);

  rec
    .begin({ zh: `完成：${ans}`, en: `Done: ${ans}` })
    .setBars(rec.barsFrom(input))
    .setAux([{ label: '利润 / profit', value: String(ans), role: 'final' }])
    .commit();

  return rec.build();
}

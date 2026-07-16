// =============================================================================
// 买卖股票（多次）· 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { maxProfitMultiple, type StockMultipleHooks } from './impl.ts';

export const DEFAULT_INPUT = [7, 1, 5, 3, 6, 4];

export function buildTrace(input: readonly number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const n = input.length;
  const profitArr: number[] = new Array<number>(n).fill(0);
  let cur = -1;
  let ans = 0;

  const snap = (note: { zh: string; en: string }): void => {
    const roles: BarRole[] = input.map((_, i) =>
      i === cur ? 'compare' : i > 0 && input[i]! > input[i - 1]! ? 'frontier' : 'default',
    );
    rec
      .begin(note)
      .setBars(rec.barsFrom(input, Object.fromEntries(roles.map((r, i) => [i, r]))))
      .setAux([
        {
          label: '累计利润',
          value: profitArr.map((v) => (v ? `${v}` : '·')).join(' '),
          role: 'frontier',
        },
      ])
      .commit();
  };

  snap({ zh: `prices=[${input.join(', ')}]`, en: `prices=[${input.join(', ')}]` });

  const hooks: StockMultipleHooks = {
    onDay: (i, _p, gain, profit) => {
      profitArr[i] = profit;
      cur = i;
      snap({
        zh: `第 ${i} 天：差价=${gain}, 累计=${profit}`,
        en: `Day ${i}: gain=${gain}, total=${profit}`,
      });
    },
    onResult: (t) => {
      ans = t;
      cur = -1;
      snap({ zh: `最大利润 = ${t}`, en: `Max profit = ${t}` });
    },
  };

  maxProfitMultiple(input, hooks);

  rec
    .begin({ zh: `完成：${ans}`, en: `Done: ${ans}` })
    .setBars(rec.barsFrom(input))
    .setAux([{ label: '利润 / profit', value: String(ans), role: 'final' }])
    .commit();

  return rec.build();
}

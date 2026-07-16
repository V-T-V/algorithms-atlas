// =============================================================================
// 买卖股票最佳时机（单次）· 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { maxProfitOnce, type BestTimeStockHooks } from './impl.ts';

export const DEFAULT_INPUT = [7, 1, 5, 3, 6, 4];

export function buildTrace(input: readonly number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const n = input.length;
  const minArr: number[] = new Array<number>(n).fill(0);
  const profitArr: number[] = new Array<number>(n).fill(0);
  let cur = -1;
  let minIdx = -1;
  let ans = 0;

  const snap = (note: { zh: string; en: string }): void => {
    const roles: BarRole[] = input.map((_, i) =>
      i === cur ? 'compare' : i === minIdx ? 'pivot' : 'default',
    );
    rec
      .begin(note)
      .setBars(rec.barsFrom(input, Object.fromEntries(roles.map((r, i) => [i, r]))))
      .setAux([
        {
          label: 'minPrice',
          value: minArr.map((v) => (v ? `${v}` : '·')).join(' '),
          role: 'pivot',
        },
        {
          label: 'profit',
          value: profitArr.map((v) => (v ? `${v}` : '·')).join(' '),
          role: 'frontier',
        },
      ])
      .commit();
  };

  snap({ zh: `prices=[${input.join(', ')}]`, en: `prices=[${input.join(', ')}]` });

  const hooks: BestTimeStockHooks = {
    onDay: (i, _p, minPrice, profit) => {
      minArr[i] = minPrice;
      profitArr[i] = profit;
      cur = i;
      // 标注当前最低价出现的位置
      minIdx = input.lastIndexOf(minPrice);
      snap({
        zh: `第 ${i} 天：minPrice=${minPrice}, profit=${profit}`,
        en: `Day ${i}: minPrice=${minPrice}, profit=${profit}`,
      });
    },
    onResult: (t) => {
      ans = t;
      cur = -1;
      snap({ zh: `最大利润 = ${t}`, en: `Max profit = ${t}` });
    },
  };

  maxProfitOnce(input, hooks);

  rec
    .begin({ zh: `完成：${ans}`, en: `Done: ${ans}` })
    .setBars(rec.barsFrom(input))
    .setAux([{ label: '利润 / profit', value: String(ans), role: 'final' }])
    .commit();

  return rec.build();
}

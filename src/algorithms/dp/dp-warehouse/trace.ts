// =============================================================================
// 仓库调度 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { warehouseScheduling, type WarehouseHooks } from './impl.ts';

export const DEFAULT_INPUT = [7, 1, 5, 3, 6, 4];

export function buildTrace(input: readonly number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const n = input.length;
  const holdArr: number[] = new Array<number>(n).fill(0);
  const cashArr: number[] = new Array<number>(n).fill(0);
  let cur = -1;
  let ans = 0;

  const snap = (note: { zh: string; en: string }): void => {
    const roles: BarRole[] = input.map((_, i) =>
      i === cur ? 'compare' : i === n - 1 && ans > 0 ? 'final' : 'default',
    );
    const bars = rec.barsFrom(input, Object.fromEntries(roles.map((r, i) => [i, r])));
    rec
      .begin(note)
      .setBars(bars)
      .setAux([
        { label: 'cash', value: cashArr.map((v) => (v <= 0 ? 0 : v)).join(' '), role: 'frontier' },
        { label: 'hold', value: holdArr.join(' '), role: 'swap' },
      ])
      .commit();
  };

  snap({ zh: `prices = [${input.join(', ')}]`, en: `prices = [${input.join(', ')}]` });

  const hooks: WarehouseHooks = {
    onDay: (i, _p, hold, cash) => {
      holdArr[i] = hold;
      cashArr[i] = cash;
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

  warehouseScheduling(input, hooks);

  rec
    .begin({ zh: `完成：${ans}`, en: `Done: ${ans}` })
    .setBars(rec.barsFrom(input))
    .setAux([{ label: '利润 / profit', value: String(ans), role: 'final' }])
    .commit();

  return rec.build();
}

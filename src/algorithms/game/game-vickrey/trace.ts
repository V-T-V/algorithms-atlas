// 维克里拍卖 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { gameVickrey } from './impl.ts';
export const DEFAULT_INPUT = { bids: [12, 25, 18], values: [12, 25, 18] };
export function buildTrace(input: { bids?: number[]; values?: number[] } = {}): Frame[] {
  const { bids = DEFAULT_INPUT.bids, values = DEFAULT_INPUT.values } = input;
  const rec = new TraceRecorder();
  rec
    .begin({ zh: '维克里拍卖：诚实出价占优', en: 'Vickrey auction: truthful bidding dominant' })
    .setBars(bids.map((b, i) => ({ value: b, role: 'default' as BarRole, label: `b${i}=${b}` })))
    .commit();
  const r = gameVickrey(bids, values);
  rec
    .begin({
      zh: `中标 #${r.winnerIdx}，付次高 ${r.price}`,
      en: `Winner #${r.winnerIdx}, pays second ${r.price}`,
    })
    .setBars(
      bids.map((b, i) => ({
        value: b,
        role: (i === r.winnerIdx ? 'final' : 'default') as BarRole,
        label: `p${i}=${r.payoffs[i]}`,
      })),
    )
    .setAux([{ label: '成交价', value: String(r.price), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}

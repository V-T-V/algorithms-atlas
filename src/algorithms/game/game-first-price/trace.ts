// 第一价格密封拍卖 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { gameFirstPrice, firstPriceEquilibriumBid } from './impl.ts';
export const DEFAULT_INPUT = { bids: [8, 12, 10], values: [10, 15, 12] };
export function buildTrace(input: { bids?: number[]; values?: number[] } = {}): Frame[] {
  const { bids = DEFAULT_INPUT.bids, values = DEFAULT_INPUT.values } = input;
  const rec = new TraceRecorder();
  rec
    .begin({ zh: '第一价格密封拍卖', en: 'First-price sealed-bid auction' })
    .setBars(bids.map((b, i) => ({ value: b, role: 'default' as BarRole, label: `b${i}=${b}` })))
    .commit();
  const r = gameFirstPrice(bids, values);
  const eq = bids.map((_, i) => firstPriceEquilibriumBid(values[i]!, bids.length));
  rec
    .begin({
      zh: `中标 #${r.winnerIdx}，付 ${r.payment}`,
      en: `Winner #${r.winnerIdx}, pays ${r.payment}`,
    })
    .setBars(
      bids.map((b, i) => ({
        value: b,
        role: (i === r.winnerIdx ? 'final' : 'default') as BarRole,
        label: `eq${i}=${eq[i]!.toFixed(1)}`,
      })),
    )
    .setAux([{ label: '成交价', value: String(r.payment), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}

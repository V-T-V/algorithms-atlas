// 全付拍卖 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { gameAllPay } from './impl.ts';
export const DEFAULT_INPUT = { bids: [5, 8, 6], values: [10, 15, 12] };
export function buildTrace(input: { bids?: number[]; values?: number[] } = {}): Frame[] {
  const { bids = DEFAULT_INPUT.bids, values = DEFAULT_INPUT.values } = input;
  const rec = new TraceRecorder();
  rec
    .begin({ zh: '全付拍卖：每人都要付', en: 'All-pay auction: everyone pays' })
    .setBars(bids.map((b, i) => ({ value: b, role: 'default' as BarRole, label: `b${i}=${b}` })))
    .commit();
  const r = gameAllPay(bids, values);
  rec
    .begin({
      zh: `中标 #${r.winnerIdx}，总付出 ${r.totalPaid}`,
      en: `Winner #${r.winnerIdx}, total paid ${r.totalPaid}`,
    })
    .setBars(
      bids.map((b, i) => ({
        value: b,
        role: (i === r.winnerIdx ? 'final' : 'warn') as BarRole,
        label: `p${i}=${r.payoffs[i]}`,
      })),
    )
    .setAux([
      { label: '总付出', value: String(r.totalPaid), role: 'final' as BarRole },
      { label: '中标者', value: `#${r.winnerIdx}`, role: 'compare' as BarRole },
    ])
    .commit();
  return rec.build();
}

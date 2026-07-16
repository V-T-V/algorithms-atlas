// 拍卖博弈框架 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { gameAuction2 } from './impl.ts';

export const DEFAULT_INPUT = {
  bids: [10, 25, 18],
  values: [12, 30, 20],
  type: 'second-price' as const,
};

export function buildTrace(
  input: {
    bids?: number[];
    values?: number[];
    type?: 'first-price' | 'second-price' | 'all-pay';
  } = {},
): Frame[] {
  const {
    bids = DEFAULT_INPUT.bids,
    values = DEFAULT_INPUT.values,
    type = DEFAULT_INPUT.type,
  } = input;
  const rec = new TraceRecorder();
  rec
    .begin({
      zh: `${type} 拍卖，${bids.length} 位竞拍者`,
      en: `${type} auction, ${bids.length} bidders`,
    })
    .setBars(
      bids.map((b, i) => ({
        value: b,
        role: 'default' as BarRole,
        label: `b${i}=${b}(v${i}=${values[i]!})`,
      })),
    )
    .commit();
  const r = gameAuction2(bids, values, type);
  rec
    .begin({
      zh: `中标者 #${r.winnerIdx}，支付 ${r.payment}`,
      en: `Winner #${r.winnerIdx}, pays ${r.payment}`,
    })
    .setBars(
      bids.map((b, i) => ({
        value: b,
        role: (i === r.winnerIdx ? 'final' : 'default') as BarRole,
        label: `p${i}=${r.payoffs[i]!.toFixed(0)}`,
      })),
    )
    .setAux([
      { label: '中标者', value: `#${r.winnerIdx}`, role: 'final' as BarRole },
      { label: '支付', value: String(r.payment), role: 'compare' as BarRole },
      { label: '类型', value: type, role: 'pivot' as BarRole },
    ])
    .commit();
  return rec.build();
}

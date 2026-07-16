// 拍卖博弈 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { gameAuction, type GameAuctionHooks } from './impl.ts';

export const DEFAULT_INPUT = { bids: [30, 50, 45], values: [60, 55, 50] };

export function buildTrace(input: { bids: number[]; values: number[] } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { bids, values } = input;

  rec
    .begin({
      zh: `出价 [${bids.join(', ')}]，估值 [${values.join(', ')}]`,
      en: `Bids [${bids.join(', ')}], values [${values.join(', ')}]`,
    })
    .setBars(bids.map((v) => ({ value: v, role: 'default' as BarRole })))
    .setAux([{ label: 'n', value: String(bids.length), role: 'pivot' }])
    .commit();

  const hooks: GameAuctionHooks = {
    onWinner: (player, bid, payoff) => {
      rec
        .begin({
          zh: `赢家：玩家 ${player}，出价 ${bid}，收益 ${payoff}`,
          en: `Winner: player ${player}, bid ${bid}, payoff ${payoff}`,
        })
        .setBars(
          bids.map((_, i) => ({
            value: bids[i]!,
            role: (i === player ? 'final' : 'default') as BarRole,
          })),
        )
        .commit();
    },
  };

  const result = gameAuction(bids, values, hooks);

  rec
    .begin({
      zh: `完成：收益 [${result.payoffs.join(', ')}]`,
      en: `Done: payoffs [${result.payoffs.join(', ')}]`,
    })
    .setBars(result.payoffs.map((p) => ({ value: p, role: 'final' as BarRole })))
    .setAux([{ label: '赢家', value: String(result.winner), role: 'final' }])
    .commit();

  return rec.build();
}

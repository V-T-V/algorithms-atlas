import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { mentalPoker } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec
    .begin({ zh: '心理扑克: 5 张牌 p=23', en: 'Mental poker: 5 cards p=23' })
    .setBars([1, 2, 3, 4, 5].map((c) => ({ value: c, role: 'default' as BarRole })))
    .commit();
  mentalPoker(5, 23, 5, 7, {
    onEncrypt: (pl, card, ct) =>
      rec
        .begin({ zh: `${pl} 加密 ${card} -> ${ct}`, en: `${pl} enc ${card} -> ${ct}` })
        .setBars([{ value: ct, role: 'pivot' as BarRole }])
        .commit(),
    onDeal: (hand) =>
      rec
        .begin({ zh: `发牌: ${hand.join(',')}`, en: `deal: ${hand.join(',')}` })
        .setBars(hand.map((c) => ({ value: c, role: 'final' as BarRole })))
        .commit(),
  });
  return rec.build();
}

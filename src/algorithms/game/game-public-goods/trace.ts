import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { publicGoodsGame } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const C = [10, 0, 5, 10];
  rec
    .begin({ zh: '公共物品: e=10 m=1.6', en: 'Public goods: e=10 m=1.6' })
    .setBars(C.map((c) => ({ value: c, role: 'default' as BarRole })))
    .commit();
  const P = publicGoodsGame(10, C, 1.6, {
    onPayoff: (i, p) =>
      rec
        .begin({ zh: `玩家${i} 收益 ${p.toFixed(2)}`, en: `player${i} payoff ${p.toFixed(2)}` })
        .setBars([{ value: p, role: 'final' as BarRole }])
        .commit(),
  });
  void P;
  return rec.build();
}

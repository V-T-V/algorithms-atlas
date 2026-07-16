import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { greedyCoinDenom } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const coins = [1, 5, 10, 25];
  rec.begin({ zh: '贪心找零验证 [1,5,10,25]', en: 'Greedy coin verify [1,5,10,25]' }).commit();
  const ok = greedyCoinDenom(coins, 30, {
    onCoin: (a, g, d, good) =>
      rec
        .begin({
          zh: `${a}: 贪心${g} 最优${d} ${good ? '✓' : '✗'}`,
          en: `${a}: greedy${g} opt${d} ${good ? 'OK' : 'BAD'}`,
        })
        .setBars([{ value: g, role: good ? ('final' as BarRole) : ('warn' as BarRole) }])
        .commit(),
  });
  rec
    .begin({ zh: ok ? 'canonical 系统' : '非 canonical', en: ok ? 'canonical' : 'non-canonical' })
    .setAux([
      {
        label: 'canonical',
        value: ok ? 'YES' : 'NO',
        role: ok ? ('final' as BarRole) : ('warn' as BarRole),
      },
    ])
    .commit();
  return rec.build();
}

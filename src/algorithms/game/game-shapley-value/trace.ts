import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { shapleyValue } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  // 投票博弈: 联盟价值 = 总票数 >= 6 ? 1 : 0, 票数 [4,3,2]
  const v = (S: number[]) => (S.reduce((a, p) => a + [4, 3, 2][p]!, 0) >= 6 ? 1 : 0);
  rec
    .begin({ zh: '夏普利值: 3 玩家投票 [4,3,2]', en: 'Shapley: 3-player voting [4,3,2]' })
    .commit();
  const phi = shapleyValue(v, 3, {
    onValue: (i, p) =>
      rec
        .begin({
          zh: `玩家${i} 夏普利值=${p.toFixed(3)}`,
          en: `player${i} shapley=${p.toFixed(3)}`,
        })
        .setBars([{ value: p, role: 'final' as BarRole, label: 'phi' + i }])
        .commit(),
  });
  rec
    .begin({
      zh: `分配 [${phi.map((p) => p.toFixed(2)).join(',')}]`,
      en: `share [${phi.map((p) => p.toFixed(2)).join(',')}]`,
    })
    .setBars(phi.map((p) => ({ value: p, role: 'final' as BarRole })))
    .commit();
  return rec.build();
}

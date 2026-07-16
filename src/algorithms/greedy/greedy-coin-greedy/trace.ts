// 硬币找零（贪心）· 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { greedyCoinGreedy } from './impl.ts';
const DENOMS = [25, 10, 5, 1];
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '硬币找零：63 分', en: 'Coin change: 63 cents' }).commit();
  const r = greedyCoinGreedy(63, DENOMS, {
    onUse: (d, c) =>
      rec
        .begin({ zh: `用 ${c} 个 ${d} 分`, en: `Use ${c} × ${d}c` })
        .setAux([{ label: '面额', value: String(d), role: 'final' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: `共 ${r.totalCoins} 枚`, en: `${r.totalCoins} coins` })
    .setAux([{ label: '总数', value: String(r.totalCoins), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}

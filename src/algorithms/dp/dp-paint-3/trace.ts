import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { paintHouse, type PaintHooks } from './impl.ts';

export const DEFAULT_COSTS = [
  [17, 2, 17],
  [16, 16, 5],
  [14, 3, 19],
];

export function buildTrace(costs: readonly (readonly number[])[] = DEFAULT_COSTS): Frame[] {
  const rec = new TraceRecorder();
  let prev = [...costs[0]!];
  rec
    .begin({ zh: `${costs.length} 个房子`, en: `${costs.length} houses` })
    .setAux([{ label: 'dp[0]', value: `[${prev.join(',')}]`, role: 'frontier' }])
    .commit();
  const hooks: PaintHooks = {
    onHouse: (i, cur) => {
      prev = cur;
      rec
        .begin({ zh: `刷第${i}房 dp=[${cur.join(',')}]`, en: `House ${i} dp=[${cur.join(',')}]` })
        .setAux([{ label: `dp[${i}]`, value: `[${cur.join(',')}]`, role: 'frontier' }])
        .commit();
    },
  };
  const ans = paintHouse(costs, hooks);
  rec
    .begin({ zh: `最小成本=${ans}`, en: `Min cost=${ans}` })
    .setAux([{ label: '答案', value: String(ans), role: 'final' }])
    .commit();
  return rec.build();
}

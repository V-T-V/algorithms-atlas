import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { correlatedEquilibrium } from './impl.ts';
const P = [
  [0.5, 0],
  [0, 0.5],
];
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec
    .begin({ zh: '相关均衡：P 仅在 (C,C),(D,D)', en: 'Correlated eq: P only on (C,C),(D,D)' })
    .setGrid(P.map((r) => r.map((v) => ({ v: v.toFixed(2), role: 'default' as BarRole }))))
    .commit();
  correlatedEquilibrium(P, {
    onCheck: (pl, ra, rp, dev, st) => {
      rec
        .begin({
          zh: `${pl} 推荐动作${ra}: ${rp.toFixed(2)} vs 偏离${dev.toFixed(2)} -> ${st ? '稳' : '偏'}`,
          en: `${pl} rec${ra}: ${rp.toFixed(2)} vs dev${dev.toFixed(2)} -> ${st ? 'stable' : 'deviate'}`,
        })
        .setAux([
          { label: '收益', value: rp.toFixed(2), role: 'pivot' as BarRole },
          {
            label: '偏离',
            value: dev.toFixed(2),
            role: st ? ('final' as BarRole) : ('warn' as BarRole),
          },
        ])
        .commit();
    },
    onConclude: (ok) =>
      rec
        .begin({
          zh: ok ? '是相关均衡' : '不是相关均衡',
          en: ok ? 'Is correlated eq' : 'Not correlated eq',
        })
        .setAux([
          {
            label: '结论',
            value: ok ? 'YES' : 'NO',
            role: ok ? ('final' as BarRole) : ('warn' as BarRole),
          },
        ])
        .commit(),
  });
  return rec.build();
}

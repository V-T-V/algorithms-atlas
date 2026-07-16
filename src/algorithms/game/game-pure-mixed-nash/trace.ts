import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { mixedNash } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const A = [
    [3, 5],
    [1, 2],
  ];
  rec
    .begin({ zh: '混合纳什: 矩阵 A', en: 'Mixed Nash: matrix A' })
    .setGrid(A.map((r) => r.map((v) => ({ v, role: 'default' as BarRole }))))
    .commit();
  const r = mixedNash(A, {
    onProb: (p) =>
      rec
        .begin({ zh: `行玩家以 ${p.toFixed(2)} 选行0`, en: `row plays row0 w.p. ${p.toFixed(2)}` })
        .setBars([{ value: p, role: 'pivot' as BarRole, label: 'p' }])
        .commit(),
  });
  rec
    .begin({ zh: `博弈值 ${r.value.toFixed(2)}`, en: `Game value ${r.value.toFixed(2)}` })
    .setAux([{ label: 'value', value: r.value.toFixed(2), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}

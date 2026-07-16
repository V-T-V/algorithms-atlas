// 扇形面积 · 轨迹录制

import { TraceRecorder } from '../../../core/recorder.ts';
import { sectorArea } from './impl.ts';

export function buildTrace() {
  const rec = new TraceRecorder();
  const r = 4;
  const theta = Math.PI / 2; // 90°

  rec
    .begin({ zh: `半径 r=${r}，圆心角 θ=π/2（90°）`, en: `r=${r}, θ=π/2 (90°)` })
    .setAux([
      { label: `半径`, value: String(r) },
      { label: `θ（弧度）`, value: theta.toFixed(6) },
    ])
    .commit();

  let A = 0;
  sectorArea(theta, r, {
    onSectorArea: (t, area) => {
      A = area;
    },
  });

  rec
    .begin({ zh: `A = ½ · r² · θ = ${A.toFixed(4)}`, en: `A = ½ · r² · θ ≈ ${A.toFixed(4)}` })
    .setAux([
      { label: `公式`, value: `A = ½·r²·θ` },
      { label: `面积 A`, value: A.toFixed(6) },
      { label: `圆面积参考`, value: (Math.PI * r * r).toFixed(6) },
    ])
    .commit();

  return rec.build();
}

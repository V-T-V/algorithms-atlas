// 圆弧长度 · 轨迹录制

import { TraceRecorder } from '../../../core/recorder.ts';
import { arcLength, degreesToRadians } from './impl.ts';

export function buildTrace() {
  const rec = new TraceRecorder();
  const r = 3;
  const deg = 90;
  const theta = degreesToRadians(deg);

  rec
    .begin({ zh: `半径 r=${r}，圆心角 ${deg}°`, en: `r=${r}, central angle ${deg}°` })
    .setAux([
      { label: `半径`, value: String(r) },
      { label: `角度（度）`, value: `${deg}°` },
    ])
    .commit();

  rec
    .begin({
      zh: `转弧度：θ = ${deg} · π/180 ≈ ${theta.toFixed(4)}`,
      en: `To radians: θ ≈ ${theta.toFixed(4)}`,
    })
    .setAux([
      { label: `θ（弧度）`, value: theta.toFixed(6) },
      { label: `π`, value: Math.PI.toFixed(6) },
    ])
    .commit();

  let L = 0;
  arcLength(theta, r, {
    onArcLength: (t, length) => {
      L = length;
    },
  });

  rec
    .begin({
      zh: `L = r · θ = ${r} · ${theta.toFixed(4)} ≈ ${L.toFixed(4)}`,
      en: `L = r · θ ≈ ${L.toFixed(4)}`,
    })
    .setAux([
      { label: `公式`, value: `L = r · θ` },
      { label: `弧长 L`, value: L.toFixed(6) },
    ])
    .commit();

  return rec.build();
}

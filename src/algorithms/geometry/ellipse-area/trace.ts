// 椭圆面积 · 轨迹录制

import { TraceRecorder } from '../../../core/recorder.ts';
import { ellipseArea } from './impl.ts';

export function buildTrace() {
  const rec = new TraceRecorder();
  const a = 5;
  const b = 3;

  rec
    .begin({ zh: `半长轴 a=${a}，半短轴 b=${b}`, en: `Semi-major a=${a}, semi-minor b=${b}` })
    .setAux([
      { label: `a`, value: String(a) },
      { label: `b`, value: String(b) },
    ])
    .commit();

  let A = 0;
  let e = 0;
  ellipseArea(a, b, {
    onArea: (area) => (A = area),
    onEccentricity: (ecc) => (e = ecc),
  });

  rec
    .begin({ zh: `A = π·a·b ≈ ${A.toFixed(4)}`, en: `A = π·a·b ≈ ${A.toFixed(4)}` })
    .setAux([
      { label: `公式`, value: `A = π·a·b` },
      { label: `面积 A`, value: A.toFixed(6) },
      { label: `离心率 e`, value: e.toFixed(6) },
    ])
    .commit();

  return rec.build();
}

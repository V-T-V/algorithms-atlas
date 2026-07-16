// 麦克劳林级数 · 轨迹录制

import { TraceRecorder } from '../../../core/recorder.ts';
import { maclaurinSeries } from './impl.ts';

export function buildTrace() {
  const rec = new TraceRecorder();
  const f = Math.sin;
  const x = 0.5;
  const n = 6;

  rec
    .begin({
      zh: `对 sin(x) 在 0 处展开 ${n + 1} 项，求 x=${x}`,
      en: `Expand sin(x) at 0 (${n + 1} terms), x=${x}`,
    })
    .setAux([{ label: `真实值 sin(${x})`, value: Math.sin(x).toFixed(8) }])
    .commit();

  const derivs: number[] = [];
  maclaurinSeries(f, x, n, 1e-2, {
    onDerivative: (k, v) => {
      derivs.push(v);
      rec
        .begin({
          zh: `第 ${k} 阶导数 ≈ ${v.toFixed(6)}`,
          en: `Derivative order ${k} ≈ ${v.toFixed(6)}`,
        })
        .setBars(rec.barsFrom(derivs.slice()))
        .commit();
    },
  });

  const approx = maclaurinSeries(f, x, n);
  rec
    .begin({ zh: `逼近值 ≈ ${approx.toFixed(8)}`, en: `Approximation ≈ ${approx.toFixed(8)}` })
    .setAux([
      { label: `逼近`, value: approx.toFixed(8) },
      { label: `真实`, value: Math.sin(x).toFixed(8) },
    ])
    .commit();

  return rec.build();
}

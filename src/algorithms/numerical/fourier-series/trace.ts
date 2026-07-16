// 傅里叶级数 · 轨迹录制

import { TraceRecorder } from '../../../core/recorder.ts';
import { fourierCoeffs, fourierEvaluate } from './impl.ts';

export function buildTrace() {
  const rec = new TraceRecorder();
  // 方波：x ∈ (-π,0) → -1，x ∈ (0,π) → 1
  const f = (x: number): number => (x >= 0 ? 1 : -1);
  const L = Math.PI;
  const N = 8;

  rec
    .begin({ zh: `方波在 [−π, π] 上展开 ${N} 项`, en: `Square wave on [−π, π], ${N} terms` })
    .setAux([{ label: `半周期 L`, value: L.toFixed(4) }])
    .commit();

  const aVals: number[] = [];
  const bVals: number[] = [];
  const coeffs = fourierCoeffs(f, L, N, 2000, {
    onCoeff: (n, an, bn) => {
      aVals.push(an);
      bVals.push(bn);
      rec
        .begin({
          zh: `n=${n}: aₙ=${an.toFixed(4)}, bₙ=${bn.toFixed(4)}`,
          en: `n=${n}: aₙ=${an.toFixed(4)}, bₙ=${bn.toFixed(4)}`,
        })
        .setBars(rec.barsFrom(bVals.slice()))
        .commit();
    },
  });

  // 用系数重建并采样
  const samples: number[] = [];
  for (let i = 0; i <= 20; i++) {
    const x = -L + (2 * L * i) / 20;
    samples.push(fourierEvaluate(coeffs, L, x));
  }
  rec
    .begin({ zh: `重建方波（${N} 项谐波叠加）`, en: `Reconstructed square wave (${N} harmonics)` })
    .setBars(rec.barsFrom(samples))
    .setAux([
      { label: `a0`, value: coeffs.a0.toFixed(6) },
      { label: `主谐波 b₁`, value: (coeffs.b[1] ?? 0).toFixed(6) },
    ])
    .commit();

  return rec.build();
}

// 逆离散傅里叶变换 · 轨迹录制

import { TraceRecorder } from '../../../core/recorder.ts';
import { dft, toComplex, cAbs } from '../dft/impl.ts';
import { idft } from './impl.ts';

export function buildTrace() {
  const rec = new TraceRecorder();
  const N = 8;
  // 原始信号：方波样（前半 1，后半 -1）
  const real: number[] = [];
  for (let n = 0; n < N; n++) real.push(n < N / 2 ? 1 : -1);
  const spectrum = dft(toComplex(real));

  const mags = spectrum.map(cAbs);
  rec
    .begin({ zh: `频域幅度谱（${N} 个分量）`, en: `Frequency magnitude spectrum (${N} bins)` })
    .setBars(rec.barsFrom(mags))
    .commit();

  const samples: number[] = [];
  idft(spectrum, {
    onSample: (n, xn) => {
      samples.push(xn.re);
      rec
        .begin({
          zh: `还原第 ${n} 个时域样本 = ${xn.re.toFixed(4)}`,
          en: `Reconstruct sample ${n} = ${xn.re.toFixed(4)}`,
        })
        .setBars(rec.barsFrom(samples.slice()))
        .commit();
    },
  });

  rec
    .begin({ zh: `还原的时域信号`, en: `Reconstructed time-domain signal` })
    .setBars(rec.barsFrom(samples))
    .setAux([
      { label: `原始[0]`, value: String(real[0]) },
      { label: `重建[0]`, value: samples[0]!.toFixed(6) },
    ])
    .commit();

  return rec.build();
}

// 离散傅里叶变换 · 轨迹录制

import { TraceRecorder } from '../../../core/recorder.ts';
import { dft, toComplex, cAbs } from './impl.ts';

export function buildTrace() {
  const rec = new TraceRecorder();
  // 8 点采样：单频率 1Hz 正弦 + 直流分量
  const N = 8;
  const real: number[] = [];
  for (let n = 0; n < N; n++) real.push(1 + Math.cos((2 * Math.PI * n) / N));

  rec
    .begin({ zh: `输入 ${N} 点时域信号`, en: `Input ${N}-point time-domain signal` })
    .setBars(rec.barsFrom(real.slice()))
    .setAux([{ label: `点数 N`, value: String(N) }])
    .commit();

  const mags: number[] = [];
  dft(toComplex(real), {
    onBin: (k, xk) => {
      mags.push(cAbs(xk));
      rec
        .begin({
          zh: `频域第 ${k} 分量，幅度 ${cAbs(xk).toFixed(4)}`,
          en: `Bin ${k}, magnitude ${cAbs(xk).toFixed(4)}`,
        })
        .setBars(rec.barsFrom(mags.slice()))
        .commit();
    },
  });

  rec
    .begin({ zh: `频谱（幅度）`, en: `Spectrum (magnitude)` })
    .setBars(rec.barsFrom(mags))
    .setAux([{ label: `直流分量 X0`, value: mags[0]!.toFixed(4) }])
    .commit();

  return rec.build();
}

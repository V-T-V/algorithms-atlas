// 泰勒级数 · 轨迹录制

import { TraceRecorder } from '../../../core/recorder.ts';
import { taylorSeries } from './impl.ts';

export function buildTrace() {
  const rec = new TraceRecorder();
  // e^x 在 0 处的各阶导数都是 1
  const derivatives = [1, 1, 1, 1, 1, 1, 1, 1];
  const x = 1;
  const a = 0;

  rec
    .begin({
      zh: `e^x 在 a=${a} 处展开，求 x=${x}`,
      en: `Expand e^x at a=${a}, evaluate at x=${x}`,
    })
    .setAux([
      { label: `项数`, value: String(derivatives.length) },
      { label: `真实值`, value: Math.exp(x).toFixed(8) },
    ])
    .commit();

  const partialSums: number[] = [];
  taylorSeries(derivatives, x, a, {
    onTerm: (k, term, sum) => {
      partialSums.push(sum);
      rec
        .begin({
          zh: `第 ${k} 项贡献 ${term.toFixed(6)}，部分和 = ${sum.toFixed(8)}`,
          en: `Term ${k}: +${term.toFixed(6)}, partial = ${sum.toFixed(8)}`,
        })
        .setBars(rec.barsFrom(partialSums.slice()))
        .setAux([{ label: `部分和`, value: sum.toFixed(8) }])
        .commit();
    },
  });

  return rec.build();
}

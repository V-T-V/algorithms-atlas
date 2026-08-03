// 岭回归 · 轨迹录制

import { TraceRecorder } from '../../../core/recorder.ts';
import { ridgeRegression, predict } from './impl.ts';

export function buildTrace() {
  const rec = new TraceRecorder();
  // 真实关系 y = 2 + 3x + 噪声（这里无噪声便于演示）
  const X = [[1], [2], [3], [4], [5]];
  const y = [5, 8, 11, 14, 17]; // 2 + 3x
  const lambda = 0.1;

  rec
    .begin({ zh: `5 个样本，λ=${lambda}`, en: `5 samples, λ=${lambda}` })
    .setBars(rec.barsFrom(y.slice()))
    .setAux([{ label: `λ`, value: String(lambda) }])
    .commit();

  let xtx: number[][] | null = null;
  const model = ridgeRegression(X, y, lambda, true, {
    onNormalEquation: (m, _v) => {
      xtx = m;
      rec
        .begin({ zh: `正则化正规方程 XᵀX + λI`, en: `Regularized normal equation` })
        .setGrid([
          [
            { v: m[0]![0]!.toFixed(4), role: 'pivot' },
            { v: m[0]![1]?.toFixed(4) ?? '-', role: 'default' },
          ],
          [
            { v: m[1]?.[0]?.toFixed(4) ?? '-', role: 'default' },
            { v: m[1]?.[1]?.toFixed(4) ?? '-', role: 'default' },
          ],
        ])
        .commit();
    },
  });

  void xtx;
  const preds = predict(model, X);
  rec
    .begin({
      zh: `拟合：截距 ${model.intercept.toFixed(4)}, 斜率 ${model.coefficients[0]!.toFixed(4)}`,
      en: `Fit: intercept ${model.intercept.toFixed(4)}, slope ${model.coefficients[0]!.toFixed(4)}`,
    })
    .setBars(rec.barsFrom(preds))
    .setAux([
      { label: `截距`, value: model.intercept.toFixed(6) },
      { label: `斜率`, value: model.coefficients[0]!.toFixed(6) },
    ])
    .commit();

  return rec.build();
}

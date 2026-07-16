// 高斯混合模型（EM）· 轨迹录制

import { TraceRecorder } from '../../../core/recorder.ts';
import { fitGMM, assignLabels } from './impl.ts';

export function buildTrace() {
  const rec = new TraceRecorder();
  // 两个一维高斯：一组 ~2，一组 ~8
  const data: number[] = [
    1.2, 1.8, 2.1, 1.9, 2.3, 1.7, 2.0, 2.2, 7.8, 8.1, 8.3, 7.9, 8.2, 8.0, 7.7, 8.4,
  ];
  const k = 2;

  rec
    .begin({ zh: `${data.length} 个一维数据点，K=${k}`, en: `${data.length} 1-D points, K=${k}` })
    .setBars(rec.barsFrom(data.slice()))
    .commit();

  const result = fitGMM(data, k, [1.5, 8], 100, 1e-6, {
    onMStep: (iter, comps) => {
      rec
        .begin({
          zh: `第 ${iter} 次 M 步：μ=[${comps.map((c) => c.mean.toFixed(3)).join(', ')}]`,
          en: `M-step ${iter}: μ=[${comps.map((c) => c.mean.toFixed(3)).join(', ')}]`,
        })
        .setBars(rec.barsFrom(comps.map((c) => c.mean)))
        .setAux([{ label: `对数似然`, value: '...' }])
        .commit();
    },
  });

  const labels = assignLabels(result.responsibilities);
  rec
    .begin({
      zh: `收敛（${result.iterations} 轮），按最大责任分簇`,
      en: `Converged (${result.iterations} iters), labeled by max responsibility`,
    })
    .setBars(
      rec.barsFrom(
        data.slice(),
        labels.reduce<Record<number, 'compare' | 'final'>>((acc, l, i) => {
          acc[i] = l === 0 ? 'compare' : 'final';
          return acc;
        }, {}),
      ),
    )
    .setAux([
      { label: `均值`, value: result.components.map((c) => c.mean.toFixed(4)).join(', ') },
      { label: `权重`, value: result.components.map((c) => c.weight.toFixed(4)).join(', ') },
      { label: `对数似然`, value: result.logLikelihood.toFixed(4) },
    ])
    .commit();

  return rec.build();
}

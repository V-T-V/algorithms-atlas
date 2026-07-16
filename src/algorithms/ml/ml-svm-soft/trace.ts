// 软间隔 SVM（Pegasos）· 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { trainPegasos, predictSVM } from './impl.ts';
export const DEFAULT_INPUT = {
  X: [
    [1, 2],
    [2, 1],
    [2, 3],
    [5, 6],
    [6, 5],
    [6, 7],
  ],
  y: [-1, -1, -1, 1, 1, 1],
  lambda: 0.01,
  epochs: 30,
};
export function buildTrace(
  input: { X: number[][]; y: number[]; lambda?: number; epochs?: number } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const { X, y, lambda = 0.01, epochs = 30 } = input;
  rec
    .begin({
      zh: 'Pegasos：' + X.length + ' 样本，λ=' + lambda,
      en: 'Pegasos: ' + X.length + ' samples, λ=' + lambda,
    })
    .setAux([{ label: '样本数', value: String(X.length), role: 'pivot' as BarRole }])
    .commit();
  const model = trainPegasos(X, y, lambda, epochs, 1, {
    onEpoch: (epoch, loss) =>
      rec
        .begin({
          zh: '第 ' + epoch + ' 轮 loss ' + loss.toFixed(4),
          en: 'epoch ' + epoch + ' loss ' + loss.toFixed(4),
        })
        .setAux([{ label: '损失', value: loss.toFixed(4), role: 'compare' as BarRole }])
        .commit(),
  });
  const correct = X.filter((x, i) => predictSVM(model, x) === y[i]).length;
  rec
    .begin({
      zh: '训练完成，准确率 ' + correct + '/' + X.length,
      en: 'done, accuracy ' + correct + '/' + X.length,
    })
    .setAux([{ label: '准确率', value: correct + '/' + X.length, role: 'final' as BarRole }])
    .commit();
  return rec.build();
}

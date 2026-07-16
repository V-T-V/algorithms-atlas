// 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { gradientDescentLinear } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '梯度下降', en: 'gradient descent' }).commit();
  const X = [[1], [2], [3], [4]],
    y = [2, 4, 6, 8];
  const r = gradientDescentLinear(X, y, 0.1, 50, {
    onEpoch: (e, loss) =>
      rec
        .begin({
          zh: '第 ' + e + ' 轮 loss ' + loss.toFixed(4),
          en: 'epoch ' + e + ' loss ' + loss.toFixed(4),
        })
        .setAux([{ label: 'loss', value: loss.toFixed(4), role: 'compare' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '完成', en: 'done' })
    .setAux([{ label: 'w', value: r.w[0]!.toFixed(3), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}

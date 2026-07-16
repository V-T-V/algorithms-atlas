import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { tdLeafLearn, evaluate } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();

  // 模拟一局 5 步的叶子特征序列
  const leafFeatures = [
    [1, 0],
    [1, 1],
    [2, 1],
    [2, 2],
    [3, 2],
  ];
  const weights = [0.5, 0.5];
  const leafValues = leafFeatures.map((f) => evaluate(weights, f));
  const rewards = [0, 0, 0, 0, 1]; // 终局奖励 1

  rec
    .begin({ zh: `初始化 TD-Leaf 5 步`, en: `Init TD-Leaf 5 steps` })
    .setBars(weights.map((w, i) => ({ value: w, role: 'default' as BarRole, label: `w${i}` })))
    .setAux([{ label: '学习率', value: '0.1', role: 'compare' as BarRole }])
    .commit();

  tdLeafLearn(leafFeatures, leafValues, weights, rewards, 0.9, 0.7, 0.1, {
    onUpdate: (step, tdError, norm) => {
      rec
        .begin({
          zh: `步${step} TD误差=${tdError.toFixed(3)} 权重范数=${norm.toFixed(3)}`,
          en: `step${step} tdErr=${tdError.toFixed(3)} wNorm=${norm.toFixed(3)}`,
        })
        .setBars(
          weights.map((w, i) => ({
            value: w,
            role: 'final' as BarRole,
            label: `w${i}:${w.toFixed(2)}`,
          })),
        )
        .setAux([{ label: 'TD误差', value: tdError.toFixed(3), role: 'compare' as BarRole }])
        .commit();
    },
  });

  rec
    .begin({
      zh: `完成：w=[${weights.map((w) => w.toFixed(3)).join(',')}]`,
      en: `Done: w=[${weights.map((w) => w.toFixed(3)).join(',')}]`,
    })
    .setBars(weights.map((w, i) => ({ value: w, role: 'sorted' as BarRole, label: `w${i}` })))
    .setAux(
      weights.map((w, i) => ({ label: `w${i}`, value: w.toFixed(3), role: 'final' as BarRole })),
    )
    .commit();
  return rec.build();
}

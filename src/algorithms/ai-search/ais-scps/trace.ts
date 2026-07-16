import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { scpsEvaluate, type ScpsNode } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();

  const tree: ScpsNode = {
    id: 'root',
    type: 'max',
    children: [
      {
        id: 'C1',
        type: 'chance',
        probs: [0.5, 0.5],
        children: [
          {
            id: 'L1',
            type: 'leaf',
            dist: [
              { value: 10, prob: 0.5 },
              { value: 2, prob: 0.5 },
            ],
          },
          {
            id: 'L2',
            type: 'leaf',
            dist: [
              { value: 8, prob: 0.7 },
              { value: 0, prob: 0.3 },
            ],
          },
        ],
      },
      { id: 'L3', type: 'leaf', utility: 5 },
    ],
  };

  rec
    .begin({ zh: `初始化 SCPS 概率树`, en: `Init SCPS probability tree` })
    .setBars([6, 5.6, 5].map((v, i) => ({ value: v, role: 'default' as BarRole, label: `子${i}` })))
    .setAux([{ label: '方法', value: '期望效用传播', role: 'compare' as BarRole }])
    .commit();

  const value = scpsEvaluate(tree, {
    onEval: (nodeId, type, val) => {
      rec
        .begin({
          zh: `评估 ${nodeId}(${type})=${val.toFixed(2)}`,
          en: `eval ${nodeId}(${type})=${val.toFixed(2)}`,
        })
        .setBars(
          [6, 5.6, 5].map((v) => ({
            value: v,
            role: 'default' as BarRole,
            label: String(v.toFixed(1)),
          })),
        )
        .setAux([{ label: nodeId, value: val.toFixed(2), role: 'final' as BarRole }])
        .commit();
    },
  });

  rec
    .begin({ zh: `完成：期望值=${value.toFixed(2)}`, en: `Done: expected=${value.toFixed(2)}` })
    .setAux([{ label: '期望效用', value: value.toFixed(2), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}

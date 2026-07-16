// 贝叶斯博弈 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { gameBayesianGame } from './impl.ts';
// 玩家1 类型 0 (strong)：A→(3,0) vs a2=0/1; 类型 1 (weak)
const P1: ReadonlyArray<ReadonlyArray<readonly number[]>> = [
  [
    [3, 0],
    [0, 1],
  ],
  [
    [2, 0],
    [0, 2],
  ],
];
const PRIOR = [0.6, 0.4];
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec
    .begin({
      zh: '贝叶斯博弈：玩家1 有 2 类型，玩家2 动作 a2=0',
      en: 'Bayesian game: player1 has 2 types, player2 action a2=0',
    })
    .setAux([{ label: '先验', value: PRIOR.join(','), role: 'pivot' as BarRole }])
    .commit();
  // 通过 onBestResponse 累积各类型结果，避免在 onConclude 中引用尚未赋值的 r
  const bestActions: number[] = [];
  const expectedPayoffs: number[] = [];
  const r = gameBayesianGame(P1, PRIOR, 0, {
    onBestResponse: (t, bestA, bestU) => {
      bestActions[t] = bestA;
      expectedPayoffs[t] = bestU;
      rec
        .begin({
          zh: `类型${t}：最佳动作 a1=${bestA}，收益 ${bestU}`,
          en: `type ${t}: best a1=${bestA}, payoff ${bestU}`,
        })
        .setAux([
          { label: `类型${t} 动作`, value: String(bestA), role: 'final' as BarRole },
          { label: `类型${t} 收益`, value: String(bestU), role: 'compare' as BarRole },
        ])
        .commit();
    },
    onConclude: (te) => {
      rec
        .begin({ zh: `总期望收益 ${te.toFixed(2)}`, en: `Total expected payoff ${te.toFixed(2)}` })
        .setAux(
          bestActions
            .map((a, t) => ({
              label: `类型${t} 最佳动作`,
              value: String(a),
              role: 'final' as BarRole,
            }))
            .concat([{ label: '总期望', value: te.toFixed(2), role: 'compare' as BarRole }]),
        )
        .commit();
    },
  });
  void r;
  return rec.build();
}

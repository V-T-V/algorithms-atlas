// 隐马尔可夫模型 · 轨迹录制

import { TraceRecorder } from '../../../core/recorder.ts';
import { forward, backward, type HMM } from './impl.ts';

export function buildTrace() {
  const rec = new TraceRecorder();
  // 经典「天气 → 海藻湿度」模型
  // 状态：0=晴, 1=阴；观测：0=干, 1=湿
  const model: HMM = {
    A: [
      [0.7, 0.3],
      [0.4, 0.6],
    ],
    B: [
      [0.9, 0.1], // 晴：偏干
      [0.2, 0.8], // 阴：偏湿
    ],
    pi: [0.6, 0.4],
  };
  const obs = [0, 1, 1, 0]; // 干、湿、湿、干

  rec
    .begin({ zh: `观测序列 [干,湿,湿,干]`, en: `Observations [dry,wet,wet,dry]` })
    .setBars(rec.barsFrom(obs.slice()))
    .setAux([{ label: `状态数`, value: '2 (晴/阴)' }])
    .commit();

  forward(model, obs, {
    onForwardStep: (t, alpha) => {
      rec
        .begin({
          zh: `前向 t=${t}：α=[${alpha.map((a) => a.toFixed(4)).join(', ')}]`,
          en: `Forward t=${t}: α=[${alpha.map((a) => a.toFixed(4)).join(', ')}]`,
        })
        .setBars(rec.barsFrom(alpha))
        .commit();
    },
  });

  const pForward = forward(model, obs);
  const pBackward = backward(model, obs);
  rec
    .begin({
      zh: `P(O|λ)：前向=${pForward.toFixed(6)}, 后向=${pBackward.toFixed(6)}`,
      en: `P(O|λ): forward=${pForward.toFixed(6)}, backward=${pBackward.toFixed(6)}`,
    })
    .setAux([
      { label: `前向概率`, value: pForward.toFixed(6) },
      { label: `后向概率`, value: pBackward.toFixed(6) },
    ])
    .commit();

  return rec.build();
}

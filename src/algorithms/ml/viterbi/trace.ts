// Viterbi 算法 · 轨迹录制

import { TraceRecorder } from '../../../core/recorder.ts';
import { viterbi, type HMM } from './impl.ts';

export function buildTrace() {
  const rec = new TraceRecorder();
  // 天气（隐） → 海藻湿度（观）模型
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
    .begin({
      zh: `观测 [干,湿,湿,干]，解码最可能天气`,
      en: `Obs [dry,wet,wet,dry], decode most likely weather`,
    })
    .setBars(rec.barsFrom(obs.slice()))
    .commit();

  viterbi(model, obs, {
    onStep: (t, delta) => {
      rec
        .begin({ zh: `t=${t}：各状态对数概率`, en: `t=${t}: per-state log-prob` })
        .setBars(rec.barsFrom(delta.map((d) => (Number.isFinite(d) ? d : -20))))
        .setAux([{ label: `δ`, value: delta.map((d) => d.toFixed(3)).join(', ') }])
        .commit();
    },
  });

  const result = viterbi(model, obs);
  const label = (s: number): string => (s === 0 ? '晴' : '阴');
  rec
    .begin({
      zh: `最可能路径：${result.path.map(label).join('→')}`,
      en: `Best path: ${result.path.map((s) => (s === 0 ? 'S' : 'C')).join('→')}`,
    })
    .setBars(rec.barsFrom(result.path))
    .setAux([
      { label: `路径`, value: result.path.map(label).join('→') },
      { label: `对数概率`, value: result.logProb.toFixed(4) },
    ])
    .commit();

  return rec.build();
}

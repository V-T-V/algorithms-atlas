// =============================================================================
// 别名法采样 · 录制帧序列
// 建表阶段用 setArray 展示 prob / alias 表的演化；采样阶段统计频率。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { AliasTable, type AliasBuildHooks, type Rng } from './impl.ts';

export const DEFAULT_INPUT = { probs: [0.1, 0.2, 0.3, 0.4], samples: 2000, seed: 42 };

interface BuildTraceInput {
  probs?: number[];
  samples?: number;
  seed?: number;
}

/** 线性同余 [0,1) 随机源，可复现。 */
function makeLcg(seed: number): Rng {
  let state = seed >>> 0;
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 0x100000000;
  };
}

/** 录制演示帧序列。 */
export function buildTrace(input: BuildTraceInput = {}): Frame[] {
  const probs = input.probs ?? DEFAULT_INPUT.probs;
  const samples = input.samples ?? DEFAULT_INPUT.samples;
  const seed = input.seed ?? DEFAULT_INPUT.seed;

  const rec = new TraceRecorder();
  const n = probs.length;
  const probView: number[] = new Array(n).fill(0);
  const aliasView: number[] = new Array(n).fill(-1);
  let buildStep = 0;

  const renderBuild = (note: { zh: string; en: string }): void => {
    const roles: BarRole[] = probView.map((p) => (p >= 1 ? 'final' : p > 0 ? 'pivot' : 'default'));
    rec
      .begin(note)
      .setArray(
        probView.map((p) => Math.round(p * 100)),
        roles,
        [],
      )
      .setAux([
        ...probView.map((p, i) => ({
          label: `prob[${i}]`,
          value: p.toFixed(3),
          role: (p >= 1 ? 'final' : 'default') as BarRole,
        })),
        ...aliasView.map((a, i) => ({
          label: `alias[${i}]`,
          value: a < 0 ? '—' : String(a),
          role: 'frontier' as BarRole,
        })),
      ])
      .commit();
  };

  renderBuild({
    zh: `建别名表：概率分布 ${JSON.stringify(probs)}`,
    en: `Building alias table for distribution ${JSON.stringify(probs)}`,
  });

  const buildHooks: AliasBuildHooks = {
    onBuild: (small, large) => {
      buildStep++;
      probView[small] = probView[small]! > 0 ? probView[small]! : 0;
      aliasView[small] = large;
      renderBuild({
        zh: `第 ${buildStep} 步：小桶 ${small} 借大桶 ${large} 的概率，alias[${small}]=${large}`,
        en: `Step ${buildStep}: column ${small} borrows from ${large}, alias[${small}]=${large}`,
      });
    },
  };

  const table = new AliasTable(probs, buildHooks);

  // 复制最终 prob/alias 到视图
  for (let i = 0; i < n; i++) {
    probView[i] = table.prob[i]!;
    aliasView[i] = table.alias[i]!;
  }
  renderBuild({
    zh: `建表完成：prob=${JSON.stringify(probView.map((p) => +p.toFixed(3)))}，alias=${JSON.stringify(aliasView)}`,
    en: `Table built: prob=${JSON.stringify(probView.map((p) => +p.toFixed(3)))}, alias=${JSON.stringify(aliasView)}`,
  });

  // 采样阶段：统计频率
  const rng = makeLcg(seed);
  const counts = table.sampleCounts(samples, rng);
  const freqs = counts.map((c) => c / samples);
  const sum = probs.reduce((a, b) => a + b, 0);

  rec
    .begin({
      zh: `采样 ${samples} 次，频率 ${JSON.stringify(freqs.map((f) => +f.toFixed(3)))}（期望 ${JSON.stringify(probs.map((p) => +(p / sum).toFixed(3)))}）`,
      en: `Sampled ${samples} times, freq ${JSON.stringify(freqs.map((f) => +f.toFixed(3)))} (expected ${JSON.stringify(probs.map((p) => +(p / sum).toFixed(3)))})`,
    })
    .setBars(
      freqs.map((f, i) => ({
        value: Math.round(f * 100),
        role: (i === freqs.indexOf(Math.max(...freqs)) ? 'final' : 'sorted') as BarRole,
        label: `${i}: ${(f * 100).toFixed(1)}%`,
      })),
    )
    .setAux([
      ...counts.map((c, i) => ({
        label: `项 ${i}`,
        value: `${c} (${(freqs[i]! * 100).toFixed(1)}%)`,
        role: 'default' as BarRole,
      })),
      { label: '总采样', value: String(samples), role: 'frontier' },
    ])
    .commit();

  return rec.build();
}

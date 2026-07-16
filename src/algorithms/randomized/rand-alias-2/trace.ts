// 别名法（加权离散采样）· 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildAlias, aliasSample } from './impl.ts';

export const DEFAULT_INPUT = { weights: [1, 2, 3, 4], count: 12 };

export function buildTrace(input: { weights: number[]; count: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();

  rec
    .begin({
      zh: `别名法（权重 [${input.weights.join(', ')}]，采样 ${input.count}）`,
      en: `Alias (weights [${input.weights.join(', ')}]), sample ${input.count}`,
    })
    .setBars(input.weights.map((w) => ({ value: w, role: 'pivot' as BarRole })))
    .commit();

  const table = buildAlias(input.weights, {
    onBuild: (alias, prob) => {
      rec
        .begin({ zh: `构建完成`, en: `Build done` })
        .setBars(prob.map((p) => ({ value: Math.round(p * 100), role: 'frontier' as BarRole })))
        .setAux(
          alias.map((a, i) => ({
            label: `列${i}`,
            value: a >= 0 ? `→${a}` : '—',
            role: 'default' as BarRole,
          })),
        )
        .commit();
    },
  });

  const samples = aliasSample(table, input.count, undefined, {
    onSample: (col, useAlias, val) => {
      rec
        .begin({
          zh: `采样：列 ${col} ${useAlias ? '用别名' : '用本体'} → ${val}`,
          en: `Sample: col ${col} ${useAlias ? 'alias' : 'self'} → ${val}`,
        })
        .setBars(
          input.weights.map((_, i) => ({
            value: i === val ? 1 : 0,
            role: (i === val ? 'final' : 'default') as BarRole,
          })),
        )
        .commit();
    },
  });

  // 统计频次
  const freq = new Array(input.weights.length).fill(0);
  for (const v of samples) freq[v]!++;
  rec
    .begin({ zh: `频次：[${freq.join(', ')}]`, en: `Freq: [${freq.join(', ')}]` })
    .setBars(freq.map((f) => ({ value: f, role: 'sorted' as BarRole })))
    .commit();

  return rec.build();
}

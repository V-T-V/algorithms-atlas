// =============================================================================
// 伯努利数 · 录制帧序列
// 通过 bernoulli 的钩子，把递推过程录成 Frame[]。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { bernoulli, type BernoulliHooks } from './impl.ts';

export const DEFAULT_INPUT = 9;

/** 录制演示帧序列：计算 B_0 .. B_n。 */
export function buildTrace(input: number = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const n = input;
  const table: Array<{ key: string; value: string; role?: BarRole }> = [];

  rec
    .begin({
      zh: `用递推 Σ C(n+1,k)·B_k = 0 计算 B_0 .. B_${n}`,
      en: `Compute B_0 .. B_${n} via Σ C(n+1,k)·B_k = 0`,
    })
    .setMap(table.slice())
    .commit();

  const hooks: BernoulliHooks = {
    onComputed: (m, [p, q]) => {
      table.push({
        key: `B_${m}`,
        value: q === 1 ? `${p}` : `${p}/${q}`,
        role: 'final',
      });
      rec
        .begin({
          zh: `B_${m} = ${q === 1 ? p : `${p}/${q}`}`,
          en: `B_${m} = ${q === 1 ? p : `${p}/${q}`}`,
        })
        .setMap(table.slice())
        .commit();
    },
  };

  bernoulli(n, hooks);

  rec
    .begin({ zh: `计算完成：共 ${n + 1} 项伯努利数`, en: `Done: ${n + 1} Bernoulli numbers` })
    .setMap(table.slice())
    .commit();

  return rec.build();
}

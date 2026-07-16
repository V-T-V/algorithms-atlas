// =============================================================================
// 类欧几里得 · 录制帧序列
// 通过 floorSum 的钩子，把递归化简过程录成 Frame[]。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { floorSum, type FloorSumHooks } from './impl.ts';

export const DEFAULT_INPUT = { n: 10, m: 7, a: 3, b: 2 };

/** 录制演示帧序列。 */
export function buildTrace(
  input: { n: number; m: number; a: number; b: number } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const { n, m, a, b } = input;
  const lines: Array<{ key: string; value: string; role?: BarRole }> = [];

  const snapshot = (note: { zh: string; en: string }, depth: number): void => {
    rec
      .begin(note)
      .setAux([{ label: '递归深度', value: String(depth), role: 'frontier' as BarRole }])
      .setMap(lines.slice())
      .commit();
  };

  let depth = 0;
  lines.push({ key: '问题', value: `Σ_{i=0}^{${n - 1}} ⌊(${a}·i + ${b})/${m}⌋`, role: 'default' });
  rec
    .begin({
      zh: `计算 Σ_{i=0}^{${n - 1}} ⌊(${a}·i + ${b})/${m}⌋`,
      en: `Compute Σ_{i=0}^{${n - 1}} ⌊(${a}·i + ${b})/${m}⌋`,
    })
    .setMap(lines.slice())
    .commit();

  const hooks: FloorSumHooks = {
    onReduce: (nn, mm, aa, bb) => {
      lines.push({
        key: `深度 ${depth}`,
        value: `f(n=${nn}, m=${mm}, a=${aa}, b=${bb})`,
        role: 'compare',
      });
      snapshot(
        {
          zh: `化简 f(n=${nn}, m=${mm}, a=${aa}, b=${bb})`,
          en: `Reduce f(n=${nn}, m=${mm}, a=${aa}, b=${bb})`,
        },
        depth,
      );
      depth++;
    },
    onResult: (sum) => {
      lines.push({ key: '结果', value: `${sum}`, role: 'final' });
      rec
        .begin({ zh: `结果 = ${sum}`, en: `Result = ${sum}` })
        .setAux([{ label: 'Σ', value: String(sum), role: 'final' as BarRole }])
        .setMap(lines.slice())
        .commit();
    },
  };

  floorSum(n, m, a, b, hooks);
  return rec.build();
}

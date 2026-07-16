// =============================================================================
// 位运算交换 · 录制帧序列
// 演示对一对值执行三次 XOR 交换；setAux 展示每步的 a、b。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { swap, type SwapHooks } from './impl.ts';

export const DEFAULT_INPUT: [number, number] = [15, 27];

const bin = (n: number): string => (n >>> 0).toString(2).padStart(8, '0').slice(-8);

/** 录制演示帧序列。 */
export function buildTrace(input: [number, number] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const [a0, b0] = input;

  rec
    .begin({
      zh: `交换 a = ${a0} 与 b = ${b0}（不使用临时变量）`,
      en: `Swap a = ${a0} and b = ${b0} (no temp variable)`,
    })
    .setAux([
      { label: 'a', value: `${a0} (${bin(a0)})`, role: 'pivot' },
      { label: 'b', value: `${b0} (${bin(b0)})`, role: 'pivot' },
    ])
    .commit();

  const notes = [
    { zh: '① a = a ^ b', en: '① a = a ^ b' },
    { zh: '② b = a ^ b（b 变成原 a）', en: '② b = a ^ b (b becomes the original a)' },
    { zh: '③ a = a ^ b（a 变成原 b）', en: '③ a = a ^ b (a becomes the original b)' },
  ];

  const hooks: SwapHooks = {
    onStep: (step, a, b) => {
      rec
        .begin(notes[step]!)
        .setAux([
          { label: 'a', value: `${a} (${bin(a)})`, role: step === 2 ? 'final' : 'frontier' },
          { label: 'b', value: `${b} (${bin(b)})`, role: step === 1 ? 'final' : 'frontier' },
        ] as Array<{ label: string; value: string; role?: BarRole }>)
        .commit();
    },
  };

  const [ra, rb] = swap(input, hooks);

  rec
    .begin({
      zh: `交换完成：a = ${ra}，b = ${rb}`,
      en: `Swap done: a = ${ra}, b = ${rb}`,
    })
    .setAux([
      { label: 'a', value: String(ra), role: 'final' },
      { label: 'b', value: String(rb), role: 'final' },
    ] as Array<{ label: string; value: string; role?: BarRole }>)
    .commit();

  return rec.build();
}

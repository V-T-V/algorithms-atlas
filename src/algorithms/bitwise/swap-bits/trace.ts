// =============================================================================
// 交换指定两位 · 录制帧序列
// =============================================================================

import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { swapBits, toBinary32, type SwapBitsHooks } from './impl.ts';

export const DEFAULT_INPUT = { x: 0b00101100, i: 1, j: 5 };

export function buildTrace(input: { x: number; i: number; j: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { x, i, j } = input;

  rec
    .begin({
      zh: `交换 x=0b${(x >>> 0).toString(2)} 的第 ${i} 位与第 ${j} 位`,
      en: `Swap bit ${i} and bit ${j} of x=0b${(x >>> 0).toString(2)}`,
    })
    .setAux([
      { label: 'x（二进制）', value: toBinary32(x), role: 'pivot' },
      { label: 'i', value: String(i), role: 'pivot' },
      { label: 'j', value: String(j), role: 'pivot' },
    ])
    .commit();

  const hooks: SwapBitsHooks = {
    onExtract: (bi_i, bi_j, b_i, b_j) => {
      rec
        .begin({
          zh: `取位：b[${bi_i}]=${b_i}, b[${bi_j}]=${b_j}`,
          en: `Extract: b[${bi_i}]=${b_i}, b[${bi_j}]=${b_j}`,
        })
        .setAux([
          { label: `b[${bi_i}]`, value: String(b_i), role: 'frontier' },
          { label: `b[${bi_j}]`, value: String(b_j), role: 'compare' },
        ])
        .commit();
    },
    onDiff: (differ) => {
      rec
        .begin({
          zh: `两位${differ ? '不同' : '相同'} → ${differ ? '需交换' : '无需交换'}`,
          en: `Bits ${differ ? 'differ -> swap' : 'same -> no-op'}`,
        })
        .setAux([{ label: '是否不同', value: String(differ), role: 'compare' }])
        .commit();
    },
    onResult: (result) => {
      rec
        .begin({
          zh: `结果：0b${(result >>> 0).toString(2)}`,
          en: `Result: 0b${(result >>> 0).toString(2)}`,
        })
        .setAux([
          { label: 'result（二进制）', value: toBinary32(result), role: 'final' },
          { label: 'result（十进制）', value: String(result >>> 0), role: 'final' },
        ])
        .commit();
    },
  };

  const result = swapBits(x, i, j, hooks);

  rec
    .begin({ zh: `完成：${result >>> 0}`, en: `Done: ${result >>> 0}` })
    .setAux([{ label: 'swapped', value: String(result >>> 0), role: 'final' }])
    .commit();

  return rec.build();
}

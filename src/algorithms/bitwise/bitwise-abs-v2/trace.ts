// =============================================================================
// 位运算绝对值 v2 · 录制帧序列
// setAux 展示输入、mask、异或值、最终结果。
// =============================================================================

import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { bitwiseAbsV2, toBinary32, type AbsV2Hooks } from './impl.ts';

export const DEFAULT_INPUT = -42;

export function buildTrace(x: number = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();

  rec
    .begin({ zh: `输入 x = ${x}`, en: `Input x = ${x}` })
    .setAux([
      { label: 'x（十进制）', value: String(x), role: 'pivot' },
      { label: 'x（二进制）', value: toBinary32(x), role: 'pivot' },
    ])
    .commit();

  const hooks: AbsV2Hooks = {
    onSign: (_v, mask) => {
      rec
        .begin({
          zh: `第 1 步：mask = x >> 31 = ${mask}（${mask === 0 ? '非负' : '负数→全 1'}）`,
          en: `Step 1: mask = x >> 31 = ${mask} (${mask === 0 ? 'non-negative' : 'negative -> all ones'})`,
        })
        .setAux([
          { label: 'mask（十进制）', value: String(mask), role: 'compare' },
          { label: 'mask（二进制）', value: toBinary32(mask), role: 'compare' },
        ])
        .commit();
    },
    onXor: (xored) => {
      rec
        .begin({
          zh: `第 2 步：xored = x ^ mask = ${xored}`,
          en: `Step 2: xored = x ^ mask = ${xored}`,
        })
        .setAux([
          { label: 'xored（十进制）', value: String(xored), role: 'frontier' },
          { label: 'xored（二进制）', value: toBinary32(xored), role: 'frontier' },
        ])
        .commit();
    },
    onResult: (result) => {
      rec
        .begin({
          zh: `第 3 步：result = xored - mask = ${result}`,
          en: `Step 3: result = xored - mask = ${result}`,
        })
        .setAux([
          { label: 'result（十进制）', value: String(result), role: 'final' },
          { label: 'result（二进制）', value: toBinary32(result), role: 'final' },
        ])
        .commit();
    },
  };

  const result = bitwiseAbsV2(x, hooks);

  rec
    .begin({ zh: `完成：|${x}| = ${result}`, en: `Done: |${x}| = ${result}` })
    .setAux([{ label: 'abs', value: String(result), role: 'final' }])
    .commit();

  return rec.build();
}

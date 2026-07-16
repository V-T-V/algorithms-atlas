// =============================================================================
// 并行位计数 · 录制帧序列
// 用 setAux 展示每个 SWAR 阶段后的中间值（十六进制），setArray 展示当前 n 的字节。
// =============================================================================

import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { popcountParallel, type ParallelPopcountHooks } from './impl.ts';

export const DEFAULT_INPUT = 0x7ffff07f; // 大量 1，便于观察

/** 把 32 位整数拆成 4 个字节（高位在前）。 */
function bytes32(n: number): number[] {
  return [(n >>> 24) & 0xff, (n >>> 16) & 0xff, (n >>> 8) & 0xff, n & 0xff];
}

export function buildTrace(x: number = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();

  rec
    .begin({
      zh: `输入 x = 0x${(x >>> 0).toString(16).padStart(8, '0')}，统计其中 1 的个数`,
      en: `Input x = 0x${(x >>> 0).toString(16).padStart(8, '0')}, count 1-bits`,
    })
    .setArray(bytes32(x), undefined, [])
    .setAux([
      {
        label: '输入 x (hex)',
        value: '0x' + (x >>> 0).toString(16).padStart(8, '0'),
        role: 'pivot',
      },
      { label: '阶段', value: 'input', role: 'frontier' },
    ])
    .commit();

  const hooks: ParallelPopcountHooks = {
    onStage: (stage, n) => {
      rec
        .begin({
          zh: `阶段「${stage}」：n = 0x${(n >>> 0).toString(16).padStart(8, '0')}`,
          en: `Stage "${stage}": n = 0x${(n >>> 0).toString(16).padStart(8, '0')}`,
        })
        .setArray(bytes32(n), undefined, [])
        .setAux([
          {
            label: '当前 n (hex)',
            value: '0x' + (n >>> 0).toString(16).padStart(8, '0'),
            role: 'compare',
          },
          { label: '当前 n (dec)', value: String(n >>> 0), role: 'compare' },
          { label: '阶段', value: stage, role: 'frontier' },
        ])
        .commit();
    },
  };

  const result = popcountParallel(x, hooks);

  rec
    .begin({ zh: `完成：x 共有 ${result} 个 1`, en: `Done: x has ${result} one-bit(s)` })
    .setAux([{ label: 'popcount', value: String(result), role: 'final' }])
    .commit();

  return rec.build();
}

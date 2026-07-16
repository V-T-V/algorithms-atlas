// =============================================================================
// 前导零计数（二分变种）· 录制帧序列
// =============================================================================

import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { clz2, type ClzHooks } from './impl.ts';

export const DEFAULT_INPUT = 0x00004000; // 第 14 位为 1 → clz = 17

function bytes32(n: number): number[] {
  return [(n >>> 24) & 0xff, (n >>> 16) & 0xff, (n >>> 8) & 0xff, n & 0xff];
}

export function buildTrace(x: number = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();

  rec
    .begin({
      zh: `输入 x = 0x${(x >>> 0).toString(16).padStart(8, '0')}，求前导零个数`,
      en: `Input x = 0x${(x >>> 0).toString(16).padStart(8, '0')}, count leading zeros`,
    })
    .setArray(bytes32(x), undefined, [])
    .setAux([
      { label: '输入 x', value: '0x' + (x >>> 0).toString(16).padStart(8, '0'), role: 'pivot' },
    ])
    .commit();

  const hooks: ClzHooks = {
    onStep: (n, width, acc) => {
      rec
        .begin({
          zh: `二分宽度 ${width}：n = 0x${(n >>> 0).toString(16).padStart(8, '0')}，已累加 clz = ${acc}`,
          en: `Width ${width}: n = 0x${(n >>> 0).toString(16).padStart(8, '0')}, acc clz = ${acc}`,
        })
        .setArray(bytes32(n), undefined, [])
        .setAux([
          {
            label: '当前 n (hex)',
            value: '0x' + (n >>> 0).toString(16).padStart(8, '0'),
            role: 'compare',
          },
          { label: '当前宽度', value: String(width), role: 'frontier' },
          { label: '已累加 clz', value: String(acc), role: 'pivot' },
        ])
        .commit();
    },
  };

  const result = clz2(x, hooks);

  rec
    .begin({ zh: `完成：clz(x) = ${result}`, en: `Done: clz(x) = ${result}` })
    .setAux([{ label: 'clz 结果', value: String(result), role: 'final' }])
    .commit();

  return rec.build();
}

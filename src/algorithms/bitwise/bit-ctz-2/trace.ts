// =============================================================================
// 末尾零计数（查表变种）· 录制帧序列
// =============================================================================

import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { ctz2, type CtzHooks } from './impl.ts';

export const DEFAULT_INPUT = 0x400; // 第 10 位为 1 → ctz = 10

function bytes32(n: number): number[] {
  return [(n >>> 24) & 0xff, (n >>> 16) & 0xff, (n >>> 8) & 0xff, n & 0xff];
}

export function buildTrace(x: number = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();

  rec
    .begin({
      zh: `输入 x = 0x${(x >>> 0).toString(16).padStart(8, '0')}，求末尾零个数`,
      en: `Input x = 0x${(x >>> 0).toString(16).padStart(8, '0')}, count trailing zeros`,
    })
    .setArray(bytes32(x), undefined, [])
    .setAux([
      { label: '输入 x', value: '0x' + (x >>> 0).toString(16).padStart(8, '0'), role: 'pivot' },
    ])
    .commit();

  const hooks: CtzHooks = {
    onByte: (b, byte, t) => {
      rec
        .begin({
          zh: `检查第 ${b} 字节 = 0x${byte.toString(16).padStart(2, '0')}，查表 ctz = ${t}`,
          en: `Byte ${b} = 0x${byte.toString(16).padStart(2, '0')}, table ctz = ${t}`,
        })
        .setArray(bytes32(x), undefined, [{ index: 3 - b, label: `byte${b}` }])
        .setAux([
          {
            label: `字节 ${b} 值`,
            value: '0x' + byte.toString(16).padStart(2, '0'),
            role: 'compare',
          },
          { label: '该字节 ctz', value: t === 255 ? '全零' : String(t), role: 'frontier' },
        ])
        .commit();
    },
  };

  const result = ctz2(x, hooks);

  rec
    .begin({
      zh: `完成：ctz(x) = ${result === -1 ? '未定义(x=0)' : result}`,
      en: `Done: ctz(x) = ${result === -1 ? 'undefined (x=0)' : result}`,
    })
    .setAux([{ label: 'ctz 结果', value: String(result), role: 'final' }])
    .commit();

  return rec.build();
}

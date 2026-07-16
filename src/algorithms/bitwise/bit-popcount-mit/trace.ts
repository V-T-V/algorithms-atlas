// =============================================================================
// MIT 位计数 · 录制帧序列
// =============================================================================

import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { popcountMit, type MitPopcountHooks } from './impl.ts';

export const DEFAULT_INPUT = 0xdeadbeef;

function bytes32(n: number): number[] {
  return [(n >>> 24) & 0xff, (n >>> 16) & 0xff, (n >>> 8) & 0xff, n & 0xff];
}

export function buildTrace(x: number = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();

  rec
    .begin({
      zh: `输入 x = 0x${(x >>> 0).toString(16).padStart(8, '0')}`,
      en: `Input x = 0x${(x >>> 0).toString(16).padStart(8, '0')}`,
    })
    .setArray(bytes32(x), undefined, [])
    .setAux([
      {
        label: '输入 x (hex)',
        value: '0x' + (x >>> 0).toString(16).padStart(8, '0'),
        role: 'pivot',
      },
    ])
    .commit();

  const hooks: MitPopcountHooks = {
    onStage: (stage, n) => {
      rec
        .begin({
          zh: `阶段「${stage}」：0x${(n >>> 0).toString(16).padStart(8, '0')}`,
          en: `Stage "${stage}": 0x${(n >>> 0).toString(16).padStart(8, '0')}`,
        })
        .setArray(bytes32(n), undefined, [])
        .setAux([
          {
            label: '当前 n (hex)',
            value: '0x' + (n >>> 0).toString(16).padStart(8, '0'),
            role: 'compare',
          },
          { label: '阶段', value: stage, role: 'frontier' },
        ])
        .commit();
    },
  };

  const result = popcountMit(x, hooks);

  rec
    .begin({ zh: `完成：${result} 个 1`, en: `Done: ${result} one-bit(s)` })
    .setAux([{ label: 'popcount', value: String(result), role: 'final' }])
    .commit();

  return rec.build();
}

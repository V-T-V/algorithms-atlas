// =============================================================================
// 位合并 · 录制帧序列
// =============================================================================

import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { mergeBits, type MergeHooks } from './impl.ts';

export const DEFAULT_INPUT = { x: 0xf0f0f0f0, y: 0x0f0f0f0f, m: 0xffff0000 };

function hex32(n: number): string {
  return '0x' + (n >>> 0).toString(16).padStart(8, '0');
}

export function buildTrace(input: { x: number; y: number; m: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { x, y, m } = input;

  rec
    .begin({
      zh: `位合并：result = (x & ~m) | (y & m)\nx=${hex32(x)} y=${hex32(y)} m=${hex32(m)}`,
      en: `Bit merge: result = (x & ~m) | (y & m)\nx=${hex32(x)} y=${hex32(y)} m=${hex32(m)}`,
    })
    .setAux([
      { label: 'x', value: hex32(x), role: 'pivot' },
      { label: 'y', value: hex32(y), role: 'pivot' },
      { label: 'm (mask)', value: hex32(m), role: 'compare' },
    ])
    .commit();

  const hooks: MergeHooks = {
    onParts: (xPart, yPart, result) => {
      rec
        .begin({
          zh: `x & ~m = ${hex32(xPart)}；y & m = ${hex32(yPart)}；合并 → ${hex32(result)}`,
          en: `x & ~m = ${hex32(xPart)}; y & m = ${hex32(yPart)}; merge → ${hex32(result)}`,
        })
        .setAux([
          { label: 'x & ~m', value: hex32(xPart), role: 'frontier' },
          { label: 'y & m', value: hex32(yPart), role: 'frontier' },
          { label: 'result', value: hex32(result), role: 'final' },
        ])
        .commit();
    },
  };

  const result = mergeBits(x, y, m, hooks);

  rec
    .begin({ zh: `完成：合并结果 = ${hex32(result)}`, en: `Done: merged = ${hex32(result)}` })
    .setAux([{ label: 'merge 结果', value: hex32(result), role: 'final' }])
    .commit();

  return rec.build();
}

// =============================================================================
// 仅循环左移 · 录制帧序列
// =============================================================================

import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { rotateLeft, toBinary32, type RotateLeftHooks } from './impl.ts';

export const DEFAULT_INPUT = { x: 0x12345678, shift: 8 };

export function buildTrace(input: { x: number; shift: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { x, shift } = input;

  rec
    .begin({ zh: `ROL(${x.toString(16)}, ${shift})`, en: `ROL(0x${x.toString(16)}, ${shift})` })
    .setAux([
      { label: 'x（二进制）', value: toBinary32(x), role: 'pivot' },
      { label: 'shift', value: String(shift), role: 'pivot' },
    ])
    .commit();

  const hooks: RotateLeftHooks = {
    onNormalize: (_raw, r) => {
      rec
        .begin({ zh: `规范位移：${shift} mod 32 = ${r}`, en: `Normalize: ${shift} mod 32 = ${r}` })
        .setAux([{ label: 'r', value: String(r), role: 'compare' }])
        .commit();
    },
    onRotate: (r, result) => {
      const leftPart = r === 0 ? 0 : ((x >>> 0) << r) >>> 0;
      const rightPart = r === 0 ? 0 : (x >>> 0) >>> (32 - r);
      rec
        .begin({ zh: `结果 = 0x${result.toString(16)}`, en: `Result = 0x${result.toString(16)}` })
        .setAux([
          { label: 'x << r（截断后）', value: toBinary32(leftPart), role: 'frontier' },
          { label: 'x >>> (32-r)', value: toBinary32(rightPart), role: 'compare' },
          { label: 'result（二进制）', value: toBinary32(result), role: 'final' },
          { label: 'result（十六进制）', value: '0x' + result.toString(16), role: 'final' },
        ])
        .commit();
    },
  };

  const result = rotateLeft(x, shift, hooks);

  rec
    .begin({
      zh: `完成：ROL = 0x${result.toString(16)}`,
      en: `Done: ROL = 0x${result.toString(16)}`,
    })
    .setAux([{ label: 'result', value: '0x' + result.toString(16), role: 'final' }])
    .commit();

  return rec.build();
}

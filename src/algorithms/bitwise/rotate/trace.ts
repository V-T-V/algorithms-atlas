// =============================================================================
// 循环移位 · 录制帧序列
// 演示对一个 32 位字按若干位移循环左移；setAux 展示 16 进制与二进制。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { rotate, type RotateHooks } from './impl.ts';

export const DEFAULT_INPUT = { x: 0x12345678, shifts: [4, 8, 16, -8] };

const hex = (n: number): string => '0x' + (n >>> 0).toString(16).padStart(8, '0').toUpperCase();
const bin = (n: number): string => (n >>> 0).toString(2).padStart(32, '0');

/** 录制演示帧序列。 */
export function buildTrace(input: { x: number; shifts: number[] } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { x, shifts } = input;

  rec
    .begin({
      zh: `初始值 ${hex(x)}（二进制 ${bin(x)}）`,
      en: `Initial value ${hex(x)} (binary ${bin(x)})`,
    })
    .setAux([{ label: 'x', value: `${hex(x)}  ${bin(x)}`, role: 'pivot' }])
    .commit();

  let cur = x >>> 0;
  for (const s of shifts) {
    const hooks: RotateHooks = {
      onRotate: (r, result) => {
        cur = result;
        rec
          .begin({
            zh: `位移 ${s}（规范化 r = ${r}）：${hex(x)} 循环左移 ${r} 位 → ${hex(result)}`,
            en: `Shift ${s} (normalized r = ${r}): ${hex(x)} rotated left by ${r} → ${hex(result)}`,
          })
          .setAux([
            { label: '规范位移 r', value: String(r), role: 'compare' },
            { label: '结果', value: `${hex(result)}`, role: 'final' },
            { label: '结果 (二进制)', value: bin(result), role: 'frontier' },
          ] as Array<{ label: string; value: string; role?: BarRole }>)
          .commit();
      },
    };
    rotate(x, s, hooks);
  }

  rec
    .begin({
      zh: `完成：最后一次结果为 ${hex(cur)}`,
      en: `Done: last result is ${hex(cur)}`,
    })
    .setAux([{ label: '最终值', value: hex(cur), role: 'final' as BarRole }])
    .commit();

  return rec.build();
}

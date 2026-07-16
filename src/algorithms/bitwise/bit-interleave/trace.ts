// =============================================================================
// 位交错 (Morton) · 录制帧序列
// setAux 展示 x/y 的扩散结果与最终 Morton 码。
// =============================================================================

import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { mortonCode, toBinary32, type BitInterleaveHooks } from './impl.ts';

export const DEFAULT_INPUT = { x: 5, y: 3 };

export function buildTrace(input: { x: number; y: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { x, y } = input;

  rec
    .begin({ zh: `计算 (${x}, ${y}) 的 Morton 码`, en: `Morton code of (${x}, ${y})` })
    .setAux([
      { label: 'x', value: `${x} = 0b${x.toString(2)}`, role: 'pivot' },
      { label: 'y', value: `${y} = 0b${y.toString(2)}`, role: 'pivot' },
    ])
    .commit();

  const hooks: BitInterleaveHooks = {
    onSpread: (which, spread) => {
      rec
        .begin({ zh: `扩散 ${which}`, en: `Spread ${which}` })
        .setAux([
          {
            label: `${which} 扩散（二进制）`,
            value: toBinary32(spread),
            role: which === 'x' ? 'frontier' : 'compare',
          },
        ])
        .commit();
    },
    onInterleave: (xs, ys, code) => {
      rec
        .begin({ zh: `交错：xs | (ys << 1)`, en: `Interleave: xs | (ys << 1)` })
        .setAux([
          { label: 'xs', value: toBinary32(xs), role: 'frontier' },
          { label: 'ys', value: toBinary32(ys), role: 'compare' },
          { label: 'Morton 码', value: toBinary32(code), role: 'final' },
          { label: 'Morton 码（十进制）', value: String(code), role: 'final' },
        ])
        .commit();
    },
  };

  const code = mortonCode(x, y, hooks);

  rec
    .begin({ zh: `完成：Morton(${x},${y}) = ${code}`, en: `Done: Morton(${x},${y}) = ${code}` })
    .setAux([{ label: 'Morton 码', value: String(code), role: 'final' }])
    .commit();

  return rec.build();
}

// =============================================================================
// 位运算模 2^n · 录制帧序列
// =============================================================================

import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { modPower2, toBinary32, type ModPower2Hooks } from './impl.ts';

export const DEFAULT_INPUT = { x: 100, n: 16 };

export function buildTrace(input: { x: number; n: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { x, n } = input;

  rec
    .begin({ zh: `求 ${x} mod ${n}`, en: `Compute ${x} mod ${n}` })
    .setAux([
      { label: 'x', value: String(x), role: 'pivot' },
      { label: 'n', value: String(n), role: 'pivot' },
    ])
    .commit();

  const hooks: ModPower2Hooks = {
    onCheckPower: (_n, isP2) => {
      rec
        .begin({
          zh: `检查 ${n} 是否 2 的幂：${isP2 ? '是' : '否'}（n & (n-1) = ${n & (n - 1)}）`,
          en: `Check ${n} power-of-two: ${isP2 ? 'yes' : 'no'} (n & (n-1) = ${n & (n - 1)})`,
        })
        .setAux([
          { label: 'n 是 2 的幂', value: String(isP2), role: 'compare' },
          { label: 'n - 1', value: String(n - 1), role: 'frontier' },
        ])
        .commit();
    },
    onMask: (mask) => {
      rec
        .begin({ zh: `掩码 mask = n - 1 = ${mask}`, en: `Mask = n - 1 = ${mask}` })
        .setAux([{ label: 'mask（二进制）', value: toBinary32(mask), role: 'compare' }])
        .commit();
    },
    onResult: (_x, mask, result) => {
      rec
        .begin({
          zh: `${x} & ${mask} = ${result}`,
          en: `${x} & ${mask} = ${result}`,
        })
        .setAux([
          { label: 'x（二进制）', value: toBinary32(x), role: 'frontier' },
          { label: 'mask（二进制）', value: toBinary32(mask), role: 'compare' },
          { label: 'result', value: String(result), role: 'final' },
        ])
        .commit();
    },
  };

  const result = modPower2(x, n, hooks);

  rec
    .begin({ zh: `完成：${x} mod ${n} = ${result}`, en: `Done: ${x} mod ${n} = ${result}` })
    .setAux([{ label: 'mod', value: String(result), role: 'final' }])
    .commit();

  return rec.build();
}

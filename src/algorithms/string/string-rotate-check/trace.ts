// =============================================================================
// 字符串旋转判定 · 录制帧序列
// =============================================================================

import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { isRotation } from './impl.ts';

export const DEFAULT_INPUT: { s1: string; s2: string } = {
  s1: 'abcde',
  s2: 'cdeab',
};

export function buildTrace(input: { s1: string; s2: string } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { s1, s2 } = input;

  rec
    .begin({
      zh: `判定 "${s2}" 是否为 "${s1}" 的旋转`,
      en: `Check if "${s2}" is a rotation of "${s1}"`,
    })
    .setAux([
      { label: 's1', value: s1, role: 'frontier' },
      { label: 's2', value: s2, role: 'compare' },
    ])
    .commit();

  const result = isRotation(s1, s2, {
    onCompare: (i) => {
      rec
        .begin({ zh: `在 "${s1 + s1}" 中扫描位置 ${i}`, en: `Scan position ${i} in "${s1 + s1}"` })
        .setAux([{ label: '扫描', value: String(i), role: 'frontier' }])
        .commit();
    },
    onFound: (rot) => {
      rec
        .begin({ zh: `匹配！旋转量 = ${rot}`, en: `Match! rotation offset = ${rot}` })
        .setAux([{ label: '旋转量', value: String(rot), role: 'final' }])
        .commit();
    },
  });

  rec
    .begin({ zh: `结果：${result ? '是' : '否'}`, en: `Result: ${result ? 'YES' : 'NO'}` })
    .setAux([{ label: 'isRotation', value: String(result), role: result ? 'final' : 'warn' }])
    .commit();

  return rec.build();
}

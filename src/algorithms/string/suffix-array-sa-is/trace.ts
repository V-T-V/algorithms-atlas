// =============================================================================
// SA-IS 后缀数组 · 录制帧序列
// setAux 展示后缀数组 sa 与 L/S 类型。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { suffixArraySaIsString } from './impl.ts';

export const DEFAULT_INPUT = 'banana';

const CODE = (s: string): number[] => Array.from(s, (c) => c.charCodeAt(0));

/** 录制演示帧序列。 */
export function buildTrace(input: string = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const s = input;
  const n = s.length;
  const { sa } = suffixArraySaIsString(s);

  const aux = (): Array<{ label: string; value: string; role?: BarRole }> => [
    { label: 's', value: s },
    { label: 'sa', value: `[${sa.join(', ')}]`, role: 'final' },
  ];

  rec
    .begin({ zh: `SA-IS 后缀数组：${s}`, en: `SA-IS suffix array: ${s}` })
    .setArray(CODE(s), new Array(n).fill('default'), [])
    .setAux(aux())
    .commit();

  const roles: BarRole[] = new Array(n).fill('final');
  rec
    .begin({ zh: `完成：sa = [${sa.join(', ')}]`, en: `Done: sa = [${sa.join(', ')}]` })
    .setArray(CODE(s), roles, sa.length > 0 ? [{ index: sa[0]!, label: 'min' }] : [])
    .setAux(aux())
    .commit();

  return rec.build();
}

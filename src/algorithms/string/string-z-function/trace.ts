// =============================================================================
// Z 函数 · 录制帧序列
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { computeZ, type ZHooks } from './impl.ts';

export const DEFAULT_INPUT: { s: string } = { s: 'aabcaabxaaz' };

export function buildTrace(input: { s: string } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { s } = input;

  rec
    .begin({ zh: `计算 "${s}" 的 Z 数组`, en: `Compute Z-array of "${s}"` })
    .setAux([{ label: 's', value: s, role: 'frontier' }])
    .commit();

  const hooks: ZHooks = {
    onSegment: (l, r) => {
      const roles: BarRole[] = new Array(s.length).fill('default');
      for (let k = l; k < r && k < s.length; k++) roles[k] = 'compare';
      rec
        .begin({ zh: `当前右段 [l=${l}, r=${r})`, en: `Current segment [l=${l}, r=${r})` })
        .setArray(
          Array.from(s, (c) => c.charCodeAt(0)),
          roles,
          [],
        )
        .setAux([
          { label: 'l', value: String(l), role: 'frontier' },
          { label: 'r', value: String(r), role: 'frontier' },
        ])
        .commit();
    },
    onSetZ: (i, value) => {
      const roles: BarRole[] = new Array(s.length).fill('default');
      roles[i] = 'pivot';
      for (let k = 0; k < value && i + k < s.length; k++) roles[i + k] = 'compare';
      rec
        .begin({ zh: `Z[${i}] = ${value}`, en: `Z[${i}] = ${value}` })
        .setArray(
          Array.from(s, (c) => c.charCodeAt(0)),
          roles,
          [],
        )
        .setAux([{ label: `Z[${i}]`, value: String(value), role: 'final' }])
        .commit();
    },
  };

  const z = computeZ(s, hooks);
  rec
    .begin({ zh: `Z 数组 = [${z.join(', ')}]`, en: `Z-array = [${z.join(', ')}]` })
    .setAux([{ label: 'Z', value: `[${z.join(',')}]`, role: 'final' }])
    .commit();

  return rec.build();
}

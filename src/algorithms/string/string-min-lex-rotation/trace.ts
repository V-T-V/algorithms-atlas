// =============================================================================
// 最小字典序旋转 · 录制帧序列
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { minLexRotation, type BoothHooks } from './impl.ts';

export const DEFAULT_INPUT: { s: string } = { s: 'baca' };

export function buildTrace(input: { s: string } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { s } = input;

  rec
    .begin({ zh: `求 "${s}" 的最小字典序旋转`, en: `Find lex-min rotation of "${s}"` })
    .setAux([{ label: 's', value: s, role: 'frontier' }])
    .commit();

  const hooks: BoothHooks = {
    onCandidate: (k) => {
      const roles: BarRole[] = new Array(s.length).fill('default');
      if (k < s.length) roles[k] = 'pivot';
      rec
        .begin({ zh: `新候选起点 k=${k}`, en: `New candidate k=${k}` })
        .setArray(
          Array.from(s, (c) => c.charCodeAt(0)),
          roles,
          [],
        )
        .setAux([{ label: 'k', value: String(k), role: 'frontier' }])
        .commit();
    },
    onCompare: (i, j, cmp) => {
      rec
        .begin({
          zh: `比较 ss[${i}] 与 ss[${j}] → ${cmp < 0 ? 'i 小' : cmp > 0 ? 'j 小' : '等'}`,
          en: `Compare ss[${i}] vs ss[${j}] → ${cmp < 0 ? 'i<)' : cmp > 0 ? 'j<)' : '='}`,
        })
        .setAux([{ label: 'cmp', value: String(cmp), role: 'compare' }])
        .commit();
    },
  };

  const k = minLexRotation(s, hooks);
  const rotated = s.slice(k) + s.slice(0, k);
  const roles: BarRole[] = new Array(s.length).fill('default');
  for (let idx = 0; idx < s.length; idx++) roles[(k + idx) % s.length] = 'final';
  rec
    .begin({ zh: `最小旋转 k=${k} → "${rotated}"`, en: `Min rotation k=${k} → "${rotated}"` })
    .setArray(
      Array.from(s, (c) => c.charCodeAt(0)),
      roles,
      [],
    )
    .setAux([{ label: '结果', value: rotated, role: 'final' }])
    .commit();

  return rec.build();
}

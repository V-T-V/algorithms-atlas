// =============================================================================
// 最长快乐前缀 · 录制帧序列
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { longestHappyPrefix, type HappyHooks } from './impl.ts';

export const DEFAULT_INPUT: { s: string } = { s: 'level' };

export function buildTrace(input: { s: string } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { s } = input;

  rec
    .begin({ zh: `求 "${s}" 的最长快乐前缀`, en: `Find longest happy prefix of "${s}"` })
    .setAux([{ label: 's', value: s, role: 'frontier' }])
    .commit();

  const hooks: HappyHooks = {
    onSetLps: (i, value) => {
      const roles: BarRole[] = new Array(s.length).fill('default');
      roles[i] = 'pivot';
      for (let k = 0; k < value; k++) roles[k] = 'compare';
      rec
        .begin({ zh: `lps[${i}] = ${value}`, en: `lps[${i}] = ${value}` })
        .setArray(
          Array.from(s, (c) => c.charCodeAt(0)),
          roles,
          [],
        )
        .setAux([{ label: `lps[${i}]`, value: String(value), role: 'final' }])
        .commit();
    },
    onFallback: (i, oldJ, newJ) => {
      rec
        .begin({ zh: `i=${i}: j 回退 ${oldJ} → ${newJ}`, en: `i=${i}: j ${oldJ} → ${newJ}` })
        .setAux([{ label: '回退', value: `${oldJ}→${newJ}`, role: 'warn' }])
        .commit();
    },
  };

  const prefix = longestHappyPrefix(s, hooks);
  rec
    .begin({
      zh: `最长快乐前缀 = "${prefix}"（长度 ${prefix.length}）`,
      en: `Happy prefix = "${prefix}" (length ${prefix.length})`,
    })
    .setAux([{ label: '结果', value: prefix || '(无)', role: 'final' }])
    .commit();

  return rec.build();
}

// =============================================================================
// KMP 失败指针 · 录制帧序列
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildLps, type LpsHooks } from './impl.ts';

export const DEFAULT_INPUT: { pat: string } = { pat: 'aabaabaaa' };

export function buildTrace(input: { pat: string } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { pat } = input;

  rec
    .begin({ zh: `为 "${pat}" 构造 LPS 数组`, en: `Build LPS array for "${pat}"` })
    .setAux([{ label: 'pat', value: pat, role: 'frontier' }])
    .commit();

  const hooks: LpsHooks = {
    onCompare: (i, j, eq) => {
      const roles: BarRole[] = new Array(pat.length).fill('default');
      roles[i] = 'pivot';
      if (j < pat.length) roles[j] = 'compare';
      rec
        .begin({
          zh: `比较 pat[${i}]='${pat[i]}' 与 pat[${j}]='${pat[j]}' → ${eq ? '等' : '不等'}`,
          en: `Compare p[${i}]='${pat[i]}' p[${j}]='${pat[j]}' → ${eq ? 'eq' : 'ne'}`,
        })
        .setArray(
          Array.from(pat, (c) => c.charCodeAt(0)),
          roles,
          [],
        )
        .commit();
    },
    onFallback: (i, oldJ, newJ) => {
      rec
        .begin({
          zh: `i=${i}: j 从 ${oldJ} 回退到 ${newJ}`,
          en: `i=${i}: j fallback ${oldJ} → ${newJ}`,
        })
        .setAux([{ label: '回退', value: `${oldJ}→${newJ}`, role: 'warn' }])
        .commit();
    },
    onSetLps: (i, value) => {
      rec
        .begin({ zh: `lps[${i}] = ${value}`, en: `lps[${i}] = ${value}` })
        .setAux([{ label: `lps[${i}]`, value: String(value), role: 'final' }])
        .commit();
    },
  };

  const lps = buildLps(pat, hooks);
  rec
    .begin({ zh: `LPS 数组 = [${lps.join(', ')}]`, en: `LPS = [${lps.join(', ')}]` })
    .setAux([{ label: 'LPS', value: `[${lps.join(',')}]`, role: 'final' }])
    .commit();

  return rec.build();
}

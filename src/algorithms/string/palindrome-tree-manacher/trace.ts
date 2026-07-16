// =============================================================================
// Manacher · 录制帧序列
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { manacher, type ManacherHooks } from './impl.ts';

export const DEFAULT_INPUT: { s: string } = { s: 'babad' };

export function buildTrace(input: { s: string } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { s } = input;

  rec
    .begin({
      zh: `用 Manacher 求 "${s}" 的最长回文子串`,
      en: `Find longest palindrome in "${s}" via Manacher`,
    })
    .setAux([{ label: 's', value: s, role: 'frontier' }])
    .commit();

  const hooks: ManacherHooks = {
    onRadius: (i, rad) => {
      const roles: BarRole[] = new Array(s.length).fill('default');
      // 中心 i 对应原串中心约 i/2 - 1，半径 rad 映射到原串区间
      const origStart = Math.floor((i - rad) / 2);
      const origLen = rad;
      for (let k = origStart; k < origStart + origLen && k < s.length; k++) {
        if (k >= 0) roles[k] = 'compare';
      }
      rec
        .begin({ zh: `中心 ${i} 半径 ${rad}`, en: `Center ${i} radius ${rad}` })
        .setArray(
          Array.from(s, (c) => c.charCodeAt(0)),
          roles,
          [],
        )
        .setAux([
          { label: '中心', value: String(i), role: 'compare' },
          { label: '半径', value: String(rad), role: 'frontier' },
        ])
        .commit();
    },
  };

  const { start, length } = manacher(s, hooks);

  const roles: BarRole[] = new Array(s.length).fill('default');
  for (let k = start; k < start + length && k < s.length; k++) roles[k] = 'final';
  rec
    .begin({
      zh: `最长回文子串 = "${s.slice(start, start + length)}"（起点 ${start}，长度 ${length}）`,
      en: `Longest palindrome = "${s.slice(start, start + length)}" (start ${start}, length ${length})`,
    })
    .setArray(
      Array.from(s, (c) => c.charCodeAt(0)),
      roles,
      [],
    )
    .setAux([{ label: '最长', value: s.slice(start, start + length), role: 'final' }])
    .commit();

  return rec.build();
}

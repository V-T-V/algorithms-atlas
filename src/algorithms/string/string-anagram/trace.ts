// =============================================================================
// 字符串异位词 · 录制帧序列
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { isAnagram, groupAnagrams, type AnagramHooks } from './impl.ts';

export const DEFAULT_INPUT: { a: string; b: string; strs: string[] } = {
  a: 'listen',
  b: 'silent',
  strs: ['eat', 'tea', 'tan', 'ate', 'nat', 'bat'],
};

export function buildTrace(
  input: { a: string; b: string; strs: string[] } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const { a, b, strs } = input;

  rec
    .begin({
      zh: `判定 "${a}" 与 "${b}" 是否为异位词`,
      en: `Check if "${a}" and "${b}" are anagrams`,
    })
    .setAux([
      { label: 'a', value: a, role: 'frontier' },
      { label: 'b', value: b, role: 'compare' },
    ])
    .commit();

  const hooks: AnagramHooks = {
    onCount: (ch, c) => {
      const roles: BarRole[] = new Array(a.length).fill('default');
      rec
        .begin({ zh: `字符 '${ch}' 频次 = ${c}`, en: `Char '${ch}' count = ${c}` })
        .setArray(
          Array.from(a, (cc) => cc.charCodeAt(0)),
          roles,
          [],
        )
        .setAux([{ label: '频次', value: `'${ch}'=${c}`, role: 'frontier' }])
        .commit();
    },
    onDiff: (ch) => {
      rec
        .begin({ zh: `字符 '${ch}' 频次不符`, en: `Char '${ch}' count mismatch` })
        .setAux([{ label: '差异', value: `'${ch}'`, role: 'warn' }])
        .commit();
    },
  };

  const result = isAnagram(a, b, hooks);
  rec
    .begin({
      zh: `结果：${result ? '是异位词' : '非异位词'}`,
      en: `Result: ${result ? 'anagram' : 'not anagram'}`,
    })
    .setAux([{ label: 'isAnagram', value: String(result), role: result ? 'final' : 'warn' }])
    .commit();

  // 分组演示
  const groups = groupAnagrams(strs);
  rec
    .begin({
      zh: `分组 ${JSON.stringify(strs)} → ${groups.length} 组`,
      en: `Grouped into ${groups.length} classes`,
    })
    .setAux([{ label: '组数', value: String(groups.length), role: 'final' }])
    .commit();
  for (let i = 0; i < groups.length; i++) {
    rec
      .begin({
        zh: `第 ${i + 1} 组：${JSON.stringify(groups[i])}`,
        en: `Group ${i + 1}: ${JSON.stringify(groups[i])}`,
      })
      .setAux([{ label: `组${i + 1}`, value: JSON.stringify(groups[i]), role: 'sorted' }])
      .commit();
  }

  return rec.build();
}

// =============================================================================
// 移位字符串分组 · 录制帧序列
// =============================================================================

import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { groupShifted, type ShiftHooks } from './impl.ts';

export const DEFAULT_INPUT: { strs: string[] } = {
  strs: ['abc', 'bcd', 'acef', 'xyz', 'az', 'ba', 'a', 'z'],
};

export function buildTrace(input: { strs: string[] } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { strs } = input;

  rec
    .begin({
      zh: `对 ${JSON.stringify(strs)} 按移位等价分组`,
      en: `Group ${JSON.stringify(strs)} by shift equivalence`,
    })
    .setAux([{ label: '串数', value: String(strs.length), role: 'frontier' }])
    .commit();

  const hooks: ShiftHooks = {
    onKey: (s, key) => {
      rec
        .begin({
          zh: `"${s}" 的签名 = "${key || '(单字符)'}"`,
          en: `Key of "${s}" = "${key || '(single)'}"`,
        })
        .setAux([{ label: '签名', value: key || '(单)', role: 'compare' }])
        .commit();
    },
    onGroup: (key, members) => {
      rec
        .begin({
          zh: `组 [${key || '(单字符)'}]：${JSON.stringify(members)}`,
          en: `Group [${key || '(single)'}]: ${JSON.stringify(members)}`,
        })
        .setAux([{ label: '组员', value: JSON.stringify(members), role: 'final' }])
        .commit();
    },
  };

  const groups = groupShifted(strs, hooks);
  rec
    .begin({ zh: `完成，共 ${groups.length} 组`, en: `Done, ${groups.length} groups` })
    .setAux([{ label: '组数', value: String(groups.length), role: 'final' }])
    .commit();

  return rec.build();
}

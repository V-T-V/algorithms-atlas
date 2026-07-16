// =============================================================================
// AC 自动机 fail 构建 · 录制帧序列
// =============================================================================

import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildAcAutomaton, type AcBuildHooks } from './impl.ts';

export const DEFAULT_INPUT: { patterns: string[] } = { patterns: ['he', 'she', 'his', 'hers'] };

export function buildTrace(input: { patterns: string[] } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { patterns } = input;

  rec
    .begin({
      zh: `为模式串 ${JSON.stringify(patterns)} 构建 AC 自动机`,
      en: `Build AC automaton for patterns ${JSON.stringify(patterns)}`,
    })
    .setAux([{ label: '模式数', value: String(patterns.length), role: 'frontier' }])
    .commit();

  const failLog: Array<[number, number]> = [];
  const hooks: AcBuildHooks = {
    onInsert: (id, ch) => {
      rec
        .begin({ zh: `插入新节点 #${id}（字符 '${ch}'）`, en: `Insert node #${id} (char '${ch}')` })
        .setAux([{ label: '新节点', value: `#${id} '${ch}'`, role: 'compare' }])
        .commit();
    },
    onMarkEnd: (id) => {
      rec
        .begin({ zh: `标记节点 #${id} 为模式结尾`, en: `Mark node #${id} as pattern end` })
        .setAux([{ label: '结尾', value: `#${id}`, role: 'final' }])
        .commit();
    },
    onFail: (id, fail) => {
      failLog.push([id, fail]);
      rec
        .begin({ zh: `BFS：fail[#${id}] = #${fail}`, en: `BFS: fail[#${id}] = #${fail}` })
        .setAux([{ label: 'fail', value: `#${id} → #${fail}`, role: 'frontier' }])
        .commit();
    },
  };

  buildAcAutomaton(patterns, hooks);

  rec
    .begin({
      zh: `构建完成，共 ${failLog.length} 条 fail 链`,
      en: `Done, ${failLog.length} fail links`,
    })
    .setAux([{ label: 'fail 总数', value: String(failLog.length), role: 'final' }])
    .commit();

  return rec.build();
}

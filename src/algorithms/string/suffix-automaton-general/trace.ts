// =============================================================================
// 广义后缀自动机 · 录制帧序列
// =============================================================================

import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildGeneralSAM, type GSAMHooks } from './impl.ts';

export const DEFAULT_INPUT: { strings: string[]; query: string } = {
  strings: ['abcbc', 'bcab'],
  query: 'bcb',
};

export function buildTrace(input: { strings: string[]; query?: string } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { strings, query } = input;

  rec
    .begin({
      zh: `为 ${JSON.stringify(strings)} 构造广义后缀自动机`,
      en: `Build GSAM for ${JSON.stringify(strings)}`,
    })
    .setAux([{ label: '串集合', value: strings.join(', '), role: 'frontier' }])
    .commit();

  const hooks: GSAMHooks = {
    onCreate: (id, len) => {
      rec
        .begin({ zh: `新建状态 #${id}，len=${len}`, en: `Create state #${id}, len=${len}` })
        .setAux([
          { label: '状态', value: String(id), role: 'compare' },
          { label: 'len', value: String(len), role: 'frontier' },
        ])
        .commit();
    },
    onTransition: (from, c, to) => {
      rec
        .begin({
          zh: `转移：#${from} --'${c}'--> #${to}`,
          en: `Transition: #${from} --'${c}'--> #${to}`,
        })
        .setAux([{ label: '转移', value: `#${from}--${c}-->#${to}`, role: 'frontier' }])
        .commit();
    },
  };

  const sam = buildGeneralSAM(strings, hooks);

  const q = query ?? '';
  const found = sam.contains(q);
  rec
    .begin({
      zh: `查询 "${q}"：${found ? '存在' : '不存在'}（共 ${sam.states.length} 状态）`,
      en: `Query "${q}": ${found ? 'present' : 'absent'} (${sam.states.length} states)`,
    })
    .setAux([
      { label: '查询', value: q, role: 'final' },
      { label: '结果', value: found ? '存在' : '不存在', role: found ? 'final' : 'warn' },
      { label: '状态数', value: String(sam.states.length), role: 'default' },
    ])
    .commit();

  return rec.build();
}

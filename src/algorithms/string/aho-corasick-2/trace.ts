// =============================================================================
// AC 自动机 v2（转移表 DFA）· 录制帧序列
// setArray 展示文本（字符码），pointer 标注当前 i；setAux 展示当前状态与已命中模式。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { ahoCorasick2, type AhoCorasick2Hooks } from './impl.ts';

export const DEFAULT_INPUT: { text: string; patterns: string[] } = {
  text: 'ushers',
  patterns: ['he', 'she', 'his', 'hers'],
};

const CODE = (s: string): number[] => Array.from(s, (c) => c.charCodeAt(0));

/** 录制演示帧序列。 */
export function buildTrace(input: { text: string; patterns: string[] } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { text, patterns } = input;
  const n = text.length;
  let i = -1;
  let curState = 0;
  let roleI: BarRole = 'default';
  const found: Array<{ start: number; pattern: string }> = [];

  const aux = (): Array<{ label: string; value: string; role?: BarRole }> => [
    { label: 'text', value: text },
    { label: 'patterns', value: patterns.join(' / ') },
    { label: 'i', value: i < 0 ? '-' : String(i), role: 'compare' },
    { label: 'state', value: String(curState), role: 'frontier' },
    { label: 'hits', value: found.map((f) => `${f.pattern}@${f.start}`).join(', ') || '-' },
  ];

  const snap = (note: { zh: string; en: string }): void => {
    const roles: BarRole[] = new Array(n).fill('default');
    const pointers: Array<{ index: number; label: string }> = [];
    if (i >= 0) {
      pointers.push({ index: i, label: 'i' });
      roles[i] = roleI;
    }
    // 高亮已命中区间
    for (const f of found) {
      for (let k = 0; k < f.pattern.length; k++) roles[f.start + k] = 'final';
    }
    rec.begin(note).setArray(CODE(text), roles, pointers).setAux(aux()).commit();
    roleI = 'default';
  };

  snap({
    zh: `多模式 DFA 匹配：${patterns.join(', ')}`,
    en: `Multi-pattern DFA: ${patterns.join(', ')}`,
  });

  const hooks: AhoCorasick2Hooks = {
    onInsertEdge: () => {},
    onFail: () => {},
    onTransfer: (t, st, nst) => {
      i = t;
      curState = nst;
      snap({ zh: `text[${t}] → state=${nst}`, en: `text[${t}] -> state=${nst}` });
    },
    onFound: (t, pi) => {
      const pat = patterns[pi]!;
      found.push({ start: t - pat.length + 1, pattern: pat });
      roleI = 'final';
      snap({
        zh: `命中 '${pat}' @${t - pat.length + 1}`,
        en: `Found '${pat}' @${t - pat.length + 1}`,
      });
    },
  };

  ahoCorasick2(text, patterns, hooks);

  const roles: BarRole[] = new Array(n).fill('default');
  for (const f of found) for (let k = 0; k < f.pattern.length; k++) roles[f.start + k] = 'final';
  rec
    .begin({ zh: `完成：${found.length} 次命中`, en: `Done: ${found.length} hits` })
    .setArray(CODE(text), roles, [])
    .setAux(aux())
    .commit();

  return rec.build();
}

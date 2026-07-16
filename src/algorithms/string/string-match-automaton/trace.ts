// =============================================================================
// 字符串匹配自动机 · 录制帧序列
// setArray 展示主串（字符码），pointer 标注当前 i；setAux 展示状态 q / 转移。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { stringMatchAutomaton, type StringMatchAutomatonHooks } from './impl.ts';

export const DEFAULT_INPUT: { text: string; pat: string } = {
  text: 'AABAACAADAABAABA',
  pat: 'AABA',
};

const CODE = (s: string): number[] => Array.from(s, (c) => c.charCodeAt(0));

/** 录制演示帧序列。 */
export function buildTrace(input: { text: string; pat: string } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { text, pat } = input;
  const n = text.length;
  const m = pat.length;
  let i = -1;
  let curQ = 0;
  let roleI: BarRole = 'default';
  const matches: number[] = [];

  const aux = (): Array<{ label: string; value: string; role?: BarRole }> => [
    { label: 'text', value: text },
    { label: 'pat', value: pat },
    { label: 'i', value: i < 0 ? '-' : String(i), role: 'compare' },
    { label: 'q', value: String(curQ), role: 'frontier' },
  ];

  const snap = (note: { zh: string; en: string }): void => {
    const roles: BarRole[] = new Array(n).fill('default');
    const pointers: Array<{ index: number; label: string }> = [];
    if (i >= 0) {
      pointers.push({ index: i, label: 'i' });
      roles[i] = roleI;
    }
    rec.begin(note).setArray(CODE(text), roles, pointers).setAux(aux()).commit();
    roleI = 'default';
  };

  snap({ zh: `匹配自动机：${pat}（DFA 转移）`, en: `Match automaton: ${pat}` });

  const hooks: StringMatchAutomatonHooks = {
    onBuildTrans: () => {},
    onTransfer: (idx, q, nq) => {
      i = idx;
      curQ = nq;
      snap({ zh: `text[${idx}] → q=${nq}`, en: `text[${idx}] -> q=${nq}` });
    },
    onFound: (end) => {
      matches.push(end - m + 1);
      roleI = 'final';
      curQ = m;
      snap({ zh: `命中！起点 ${end - m + 1}`, en: `Found! start ${end - m + 1}` });
    },
  };

  stringMatchAutomaton(text, pat, hooks);

  const roles: BarRole[] = new Array(n).fill('default');
  for (const st of matches) for (let k = 0; k < m; k++) roles[st + k] = 'final';
  rec
    .begin({ zh: `完成：[${matches.join(', ')}]`, en: `Done: [${matches.join(', ')}]` })
    .setArray(CODE(text), roles, [])
    .setAux(aux())
    .commit();
  return rec.build();
}

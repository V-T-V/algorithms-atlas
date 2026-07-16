// =============================================================================
// NFA → DFA 子集构造法 · 录制帧序列
// 用 setGrid 展示 DFA 转移表（行=DFA 状态，列=符号），aux 展示子集构成。
// =============================================================================

import type { BarRole, Cell, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import {
  subsetConstruction,
  dfaMatch,
  epsilonClosure,
  SAMPLE_NFA,
  type EpsilonNfa,
  type Dfa,
  type SubsetHooks,
} from './impl.ts';

export const DEFAULT_INPUT = 'aabb';

/** 录制演示帧序列。 */
export function buildTrace(input: string = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const nfa = SAMPLE_NFA;

  const hooks: SubsetHooks = {
    onDiscover: (id, subset) => {
      // 暂存，下面在构造完后再渲染表（因为构造时表不断变化）
      void id;
      void subset;
    },
  };

  rec
    .begin({
      zh: `NFA→DFA 子集构造：NFA 有 ${nfa.states} 状态，字母表 {a, b}。识别 (a|b)*ab。`,
      en: `NFA→DFA subset construction: NFA has ${nfa.states} states, alphabet {a, b}. Matches (a|b)*ab.`,
    })
    .setAux([
      { label: 'NFA 状态数', value: String(nfa.states), role: 'pivot' as BarRole },
      { label: 'NFA 起始', value: String(nfa.start), role: 'compare' as BarRole },
      { label: 'NFA 接受', value: String(nfa.accept), role: 'compare' as BarRole },
      {
        label: 'ε-闭包({0})',
        value: `{${[...epsilonClosure([nfa.start], nfa)].sort((a, b) => a - b).join(',')}}`,
        role: 'frontier' as BarRole,
      },
    ])
    .commit();

  const dfa = subsetConstruction(nfa, hooks);

  // 渲染 DFA 转移表
  const renderTable = (dfa: Dfa, matchPos: number, matchState: number): Cell[][] => {
    const header: Cell[] = [
      { v: 'DFA状态', role: 'default' },
      { v: '子集', role: 'default' },
    ];
    for (const a of dfa.alphabet) header.push({ v: a, role: 'pivot' });
    header.push({ v: '接受?', role: 'default' });
    const rows: Cell[][] = [header];
    for (let i = 0; i < dfa.states; i++) {
      const isMatchState = i === matchState;
      const isStart = i === dfa.start;
      const isAccept = dfa.accept.has(i);
      let labelRole: BarRole = 'default';
      if (isMatchState) labelRole = 'swap';
      else if (isStart) labelRole = 'frontier';
      else if (isAccept) labelRole = 'final';
      const row: Cell[] = [
        { v: `${i}${isStart ? '(起)' : ''}`, role: labelRole },
        { v: `{${dfa.subsets[i]!.join(',')}}`, role: 'compare' },
      ];
      for (const a of dfa.alphabet) {
        const t = dfa.transitions.find((tr) => tr.from === i && tr.symbol === a);
        row.push({ v: t ? `→${t.to}` : '·', role: t ? 'sorted' : 'default' });
      }
      row.push({ v: isAccept ? '✓' : '', role: isAccept ? 'final' : 'default' });
      rows.push(row);
    }
    return rows;
  };

  // 展示构造完成后的 DFA 表
  rec
    .begin({
      zh: `构造完成：DFA 共 ${dfa.states} 个状态（每个对应一个 NFA 子集），${dfa.accept.size} 个接受态。`,
      en: `Construction done: DFA has ${dfa.states} states (each an NFA subset), ${dfa.accept.size} accepting.`,
    })
    .setGrid(renderTable(dfa, -1, -1))
    .setAux([
      { label: 'DFA 状态数', value: String(dfa.states), role: 'final' as BarRole },
      { label: '接受态数', value: String(dfa.accept.size), role: 'final' as BarRole },
      { label: '转移数', value: String(dfa.transitions.length), role: 'default' as BarRole },
      ...dfa.subsets.map((s, i) => ({
        label: `DFA ${i}`,
        value: `{${s.join(',')}}`,
        role: (dfa.accept.has(i) ? 'final' : 'default') as BarRole,
      })),
    ])
    .commit();

  // 用输入串演示 DFA 匹配（逐步）
  let cur = dfa.start;
  for (let i = 0; i <= input.length; i++) {
    const accepted = dfa.accept.has(cur);
    rec
      .begin({
        zh:
          i < input.length
            ? `匹配 "${input.slice(0, i)}" + 读 '${input[i]}'：DFA 状态 ${cur}${accepted ? '（接受）' : ''}`
            : `匹配完成：DFA 状态 ${cur}${accepted ? '（接受 → 匹配成功）' : '（非接受 → 匹配失败）'}`,
        en:
          i < input.length
            ? `Matched "${input.slice(0, i)}" + read '${input[i]}': DFA state ${cur}${accepted ? ' (accept)' : ''}`
            : `Match done: DFA state ${cur}${accepted ? ' (accept → match)' : ' (no accept → no match)'}`,
      })
      .setGrid(renderTable(dfa, i, cur))
      .setAux([
        { label: '当前 DFA 状态', value: String(cur), role: 'swap' as BarRole },
        { label: '已读', value: input.slice(0, i) || 'ε', role: 'compare' as BarRole },
        { label: '剩余', value: input.slice(i) || '$', role: 'default' as BarRole },
        {
          label: '是否接受态',
          value: accepted ? 'YES' : 'NO',
          role: (accepted ? 'final' : 'warn') as BarRole,
        },
      ])
      .commit();
    if (i < input.length) {
      const ch = input[i]!;
      const t = dfa.transitions.find((tr) => tr.from === cur && tr.symbol === ch);
      if (t === undefined) break;
      cur = t.to;
    }
  }

  // 终态
  const matched = dfaMatch(input, dfa);
  rec
    .begin({
      zh: matched ? `完成：输入 "${input}" 被 DFA 接受` : `完成：输入 "${input}" 被拒绝`,
      en: matched
        ? `Done: input "${input}" accepted by DFA`
        : `Done: input "${input}" rejected by DFA`,
    })
    .setGrid(renderTable(dfa, -1, -1))
    .setAux([
      {
        label: '匹配结果',
        value: matched ? 'ACCEPT' : 'REJECT',
        role: (matched ? 'final' : 'warn') as BarRole,
      },
      { label: 'DFA 状态数', value: String(dfa.states), role: 'pivot' as BarRole },
      { label: 'NFA 状态数', value: String(nfa.states), role: 'compare' as BarRole },
    ])
    .commit();

  return rec.build();
}

export { SAMPLE_NFA };
export type { EpsilonNfa };

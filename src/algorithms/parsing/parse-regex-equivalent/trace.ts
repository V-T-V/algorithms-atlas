// =============================================================================
// DFA/正则等价判定 · 录制帧序列
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { areEquivalent, type DFA, type EquivalenceHooks } from './impl.ts';

export const DEFAULT_INPUT: { a: DFA; b: DFA } = {
  // A: a+ （至少一个 a）
  a: {
    states: ['s0', 's1'],
    alphabet: ['a'],
    transitions: { s0: { a: 's1' }, s1: { a: 's1' } },
    start: 's0',
    accept: ['s1'],
  },
  // B: a·a*（也匹配一个或多个 a）—— 应等价
  b: {
    states: ['t0', 't1', 't2'],
    alphabet: ['a'],
    transitions: { t0: { a: 't1' }, t1: { a: 't2' }, t2: { a: 't2' } },
    start: 't0',
    accept: ['t1', 't2'],
  },
};

/** 录制演示帧序列。 */
export function buildTrace(input: { a: DFA; b: DFA } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { a, b } = input;

  rec
    .begin({
      zh: `比较两个 DFA：A（${a.states.length} 状态）与 B（${b.states.length} 状态）。构造叉积 BFS。`,
      en: `Compare two DFAs: A (${a.states.length} states) and B (${b.states.length} states). Product BFS.`,
    })
    .setAux([
      { label: 'A 状态', value: a.states.join(','), role: 'pivot' as BarRole },
      { label: 'A 接受', value: a.accept.join(','), role: 'compare' as BarRole },
      { label: 'B 状态', value: b.states.join(','), role: 'pivot' as BarRole },
      { label: 'B 接受', value: b.accept.join(','), role: 'compare' as BarRole },
      {
        label: '字母表',
        value: [...new Set([...a.alphabet, ...b.alphabet])].join(','),
        role: 'frontier' as BarRole,
      },
    ])
    .commit();

  let visits = 0;
  const hooks: EquivalenceHooks = {
    onVisit: (p, q, depth) => {
      visits++;
      // 只在深度小的几步里记录（避免过多）
      if (depth <= 4) {
        rec
          .begin({
            zh: `访问叉积态 (${p}, ${q})，深度 ${depth}。`,
            en: `Visit product state (${p}, ${q}), depth ${depth}.`,
          })
          .setAux([
            { label: 'A 状态', value: p, role: 'pivot' as BarRole },
            { label: 'B 状态', value: q, role: 'compare' as BarRole },
            { label: '深度', value: String(depth), role: 'frontier' as BarRole },
          ])
          .commit();
      }
    },
    onDistinguish: (p, q) => {
      rec
        .begin({
          zh: `区分态：(${p}, ${q}) —— 恰好一方接受，故不等价。`,
          en: `Distinguish: (${p}, ${q}) — exactly one accepts, so not equivalent.`,
        })
        .setAux([
          { label: '事件', value: '区分', role: 'warn' as BarRole },
          { label: 'A 状态', value: p, role: 'pivot' as BarRole },
          { label: 'B 状态', value: q, role: 'compare' as BarRole },
        ])
        .commit();
    },
  };

  const result = areEquivalent(a, b, hooks);

  rec
    .begin({
      zh: result.equivalent
        ? `结论：等价（探索 ${result.explored} 个叉积态）。`
        : `结论：不等价，反例 "${result.counterexample.join('')}"。`,
      en: result.equivalent
        ? `Verdict: equivalent (${result.explored} product states explored).`
        : `Verdict: NOT equivalent, counterexample "${result.counterexample.join('')}".`,
    })
    .setAux([
      {
        label: '结论',
        value: result.equivalent ? 'EQUIVALENT' : 'NOT EQUIVALENT',
        role: (result.equivalent ? 'final' : 'warn') as BarRole,
      },
      {
        label: '反例',
        value: result.counterexample.join(''),
        role: 'compare' as BarRole,
      },
      { label: '探索态数', value: String(result.explored), role: 'frontier' as BarRole },
      { label: '总访问', value: String(visits), role: 'default' as BarRole },
    ])
    .commit();

  return rec.build();
}

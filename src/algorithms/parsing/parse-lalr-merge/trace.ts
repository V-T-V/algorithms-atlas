// =============================================================================
// LALR 状态合并 · 录制帧序列
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { mergeLALR, detectMergeConflicts, type LR1State, type MergeHooks } from './impl.ts';

// 演示：两个 LR(1) 状态拥有相同 LR(0) 核（A→·a, B→a·），但 lookahead 不同。
export const DEFAULT_INPUT: { states: LR1State[]; prods: Array<{ lhs: string; rhs: string[] }> } = {
  states: [
    {
      id: 0,
      items: [
        { core: { prodIndex: 0, dot: 0 }, lookaheads: ['$'] },
        { core: { prodIndex: 1, dot: 1 }, lookaheads: ['$'] },
      ],
    },
    {
      id: 1,
      items: [
        { core: { prodIndex: 0, dot: 0 }, lookaheads: [','] },
        { core: { prodIndex: 1, dot: 1 }, lookaheads: [','] },
      ],
    },
    {
      id: 2,
      items: [{ core: { prodIndex: 0, dot: 1 }, lookaheads: ['$', ','] }],
    },
  ],
  prods: [
    { lhs: 'S', rhs: ['A'] },
    { lhs: 'A', rhs: ['a'] },
  ],
};

export function buildTrace(
  input: { states: LR1State[]; prods: Array<{ lhs: string; rhs: string[] }> } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const { states, prods } = input;

  rec
    .begin({
      zh: `LR(1) 自动机共 ${states.length} 个状态。按 LR(0) 核分组合并 lookahead。`,
      en: `LR(1) automaton has ${states.length} states. Grouping by LR(0) core and merging lookaheads.`,
    })
    .setAux([
      {
        label: 'LR(1) 状态',
        value: states
          .map(
            (s) =>
              `I${s.id}: ${s.items.map((it) => `${it.core.prodIndex}.${it.core.dot}/{${it.lookaheads.join(',')}}`).join(' ')}`,
          )
          .join('\n'),
        role: 'frontier' as BarRole,
      },
    ])
    .commit();

  const hooks: MergeHooks = {
    onGroup: (sourceIds, mergedItems) => {
      rec
        .begin({
          zh: `合并 LR(1) 状态 ${sourceIds.map((i) => 'I' + i).join(' + ')}（同心）。lookahead 取并集。`,
          en: `Merge LR(1) states ${sourceIds.map((i) => 'I' + i).join(' + ')} (same core). Union lookaheads.`,
        })
        .setAux([
          {
            label: '来源',
            value: sourceIds.map((i) => 'I' + i).join(' + '),
            role: 'pivot' as BarRole,
          },
          {
            label: '合并后',
            value: mergedItems
              .map((it) => `${it.core.prodIndex}.${it.core.dot}/{${it.lookaheads.join(',')}}`)
              .join(' '),
            role: 'final' as BarRole,
          },
        ])
        .commit();
    },
  };

  const result = mergeLALR(states, hooks);
  const conflicts = detectMergeConflicts(result.lalrStates, prods);

  rec
    .begin({
      zh: `合并完成：${states.length} → ${result.lalrStates.length} 个 LALR 状态。${conflicts.length} 处合并冲突。`,
      en: `Merged: ${states.length} → ${result.lalrStates.length} LALR states. ${conflicts.length} merge conflicts.`,
    })
    .setAux([
      { label: '原状态数', value: String(states.length), role: 'compare' as BarRole },
      { label: 'LALR 状态数', value: String(result.lalrStates.length), role: 'final' as BarRole },
      {
        label: '合并冲突',
        value: String(conflicts.length),
        role: (conflicts.length > 0 ? 'warn' : 'default') as BarRole,
      },
      {
        label: 'LALR 状态',
        value: result.lalrStates
          .map(
            (s) =>
              `[${s.sourceIds.map((i) => 'I' + i).join(' + ')}]: ${s.items.map((it) => `${it.core.prodIndex}.${it.core.dot}/{${it.lookaheads.join(',')}}`).join(' ')}`,
          )
          .join('\n'),
        role: 'frontier' as BarRole,
      },
    ])
    .commit();

  return rec.build();
}

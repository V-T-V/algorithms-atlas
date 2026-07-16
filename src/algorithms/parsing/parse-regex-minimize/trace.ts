// =============================================================================
// DFA 最小化 · 录制帧序列
// 展示「原始 DFA → 每轮划分细化 → 最小 DFA」。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { minimizeDFA, type DFA, type MinimizeHooks } from './impl.ts';

// DFA 识别 (a|b)*abb 末尾。来源：Dragon Book 经典示例。
// 状态 q0..q10，其中接受等价对可合并。
export const DEFAULT_INPUT: DFA = {
  states: ['A', 'B', 'C', 'D'],
  alphabet: ['a', 'b'],
  transitions: {
    A: { a: 'B', b: 'C' },
    B: { a: 'B', b: 'D' },
    C: { a: 'B', b: 'C' },
    D: { a: 'B', b: 'C' },
  },
  start: 'A',
  accept: ['D'],
};

/** 录制演示帧序列。 */
export function buildTrace(input: DFA = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();

  rec
    .begin({
      zh: `原始 DFA：${input.states.length} 个状态（${input.states.join(', ')}），接受 { ${input.accept.join(', ')} }。开始划分细化。`,
      en: `Original DFA: ${input.states.length} states (${input.states.join(', ')}), accept { ${input.accept.join(', ')} }. Refining partitions.`,
    })
    .setAux([
      { label: '状态数', value: String(input.states.length), role: 'pivot' as BarRole },
      { label: '字母表', value: input.alphabet.join(','), role: 'compare' as BarRole },
      { label: '起始', value: input.start, role: 'frontier' as BarRole },
      { label: '接受', value: input.accept.join(','), role: 'final' as BarRole },
    ])
    .commit();

  const hooks: MinimizeHooks = {
    onPartition: (iter, partition) => {
      rec
        .begin({
          zh:
            iter === 0
              ? `初始划分：按接受/非接受分 ${partition.length} 组。`
              : `第 ${iter} 轮：细化为 ${partition.length} 组。`,
          en:
            iter === 0
              ? `Initial partition: ${partition.length} groups (accept/non-accept).`
              : `Round ${iter}: refined into ${partition.length} groups.`,
        })
        .setAux([
          { label: '轮次', value: String(iter), role: 'pivot' as BarRole },
          { label: '组数', value: String(partition.length), role: 'compare' as BarRole },
          ...partition.map((g, i) => ({
            label: `组 ${i}`,
            value: g.join(','),
            role: 'frontier' as BarRole,
          })),
        ])
        .commit();
    },
  };

  const result = minimizeDFA(input, hooks);

  rec
    .begin({
      zh: `收敛：${result.iterations} 轮后稳定，最小 DFA 有 ${result.dfa.states.length} 个状态。`,
      en: `Converged after ${result.iterations} rounds; minimal DFA has ${result.dfa.states.length} states.`,
    })
    .setAux([
      { label: '原状态数', value: String(input.states.length), role: 'compare' as BarRole },
      { label: '现状态数', value: String(result.dfa.states.length), role: 'final' as BarRole },
      { label: '起始', value: result.dfa.start, role: 'pivot' as BarRole },
      { label: '接受', value: result.dfa.accept.join(','), role: 'frontier' as BarRole },
      {
        label: '状态映射',
        value: Object.entries(result.mapping)
          .map(([k, v]) => `${k}→${v}`)
          .join(' '),
        role: 'default' as BarRole,
      },
    ])
    .commit();

  return rec.build();
}

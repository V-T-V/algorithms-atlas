// =============================================================================
// FIRST 集计算 · 录制帧序列
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { computeFirst, type CFG, type FirstHooks } from './impl.ts';

export const DEFAULT_INPUT: CFG = {
  start: 'S',
  nonTerminals: new Set(['S', 'A', 'B']),
  productions: [
    { lhs: 'S', rhs: ['A', 'B'] },
    { lhs: 'A', rhs: ['a'] },
    { lhs: 'A', rhs: [] }, // ε
    { lhs: 'B', rhs: ['b'] },
    { lhs: 'B', rhs: [] },
  ],
};

/** 录制演示帧序列。 */
export function buildTrace(input: CFG = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();

  rec
    .begin({
      zh: `文法 ${input.productions.length} 条产生式，非终结符 ${[...input.nonTerminals].join(',')}。不动点迭代求 FIRST。`,
      en: `Grammar with ${input.productions.length} productions, NTs ${[...input.nonTerminals].join(',')}. Fixpoint FIRST.`,
    })
    .setAux([
      {
        label: '产生式',
        value: input.productions
          .map((p) => `${p.lhs} → ${p.rhs.length === 0 ? 'ε' : p.rhs.join(' ')}`)
          .join('\n'),
        role: 'frontier' as BarRole,
      },
    ])
    .commit();

  const hooks: FirstHooks = {
    onPass: (iter, snap) => {
      const entries = Object.entries(snap).map(([k, v]) => ({
        label: `FIRST(${k})`,
        value: `{ ${v.join(', ')} }`,
        role: (iter === 0 ? 'default' : 'compare') as BarRole,
      }));
      rec
        .begin({
          zh: iter === 0 ? `第 0 轮（初始化，所有 FIRST 为空）。` : `第 ${iter} 轮扫描完成。`,
          en: iter === 0 ? `Round 0 (init, all FIRST empty).` : `Round ${iter} scan done.`,
        })
        .setAux([{ label: '轮次', value: String(iter), role: 'pivot' as BarRole }, ...entries])
        .commit();
    },
  };

  const result = computeFirst(input, hooks);

  // 终态：用网格展示每个非终结符的 FIRST 集
  const header = ['NT', 'FIRST'];
  const rows = [
    header,
    ...[...input.nonTerminals].map((nt) => [nt, `{ ${[...result.first[nt]!].sort().join(', ')} }`]),
  ];
  rec
    .begin({
      zh: `收敛：${result.iterations} 轮后 FIRST 集稳定。`,
      en: `Converged: FIRST stable after ${result.iterations} rounds.`,
    })
    .setGrid(rec.gridFrom(rows))
    .setAux([
      { label: '收敛轮数', value: String(result.iterations), role: 'final' as BarRole },
      { label: '非终结符数', value: String(input.nonTerminals.size), role: 'compare' as BarRole },
    ])
    .commit();

  return rec.build();
}

// =============================================================================
// FOLLOW 集计算 · 录制帧序列
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { computeFollow, type CFG, type FollowHooks } from './impl.ts';

export const DEFAULT_INPUT: CFG = {
  start: 'S',
  nonTerminals: new Set(['S', 'A', 'B']),
  productions: [
    { lhs: 'S', rhs: ['A', 'B'] },
    { lhs: 'A', rhs: ['a'] },
    { lhs: 'A', rhs: [] },
    { lhs: 'B', rhs: ['b'] },
    { lhs: 'B', rhs: [] },
  ],
};

export function buildTrace(input: CFG = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();

  rec
    .begin({
      zh: `文法 ${input.productions.length} 条，起始 ${input.start}。FOLLOW(${input.start}) 初始化为 { $ }。`,
      en: `Grammar ${input.productions.length} productions, start ${input.start}. FOLLOW(${input.start}) := { $ }.`,
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

  const hooks: FollowHooks = {
    onPass: (iter, snap) => {
      const entries = Object.entries(snap).map(([k, v]) => ({
        label: `FOLLOW(${k})`,
        value: `{ ${v.join(', ')} }`,
        role: (iter === 0 ? 'default' : 'compare') as BarRole,
      }));
      rec
        .begin({
          zh: iter === 0 ? `第 0 轮（初始化）。` : `第 ${iter} 轮扫描完成。`,
          en: iter === 0 ? `Round 0 (init).` : `Round ${iter} scan done.`,
        })
        .setAux([{ label: '轮次', value: String(iter), role: 'pivot' as BarRole }, ...entries])
        .commit();
    },
  };

  const result = computeFollow(input, hooks);

  const header = ['NT', 'FOLLOW'];
  const rows = [
    header,
    ...[...input.nonTerminals].map((nt) => [
      nt,
      `{ ${[...result.follow[nt]!].sort().join(', ')} }`,
    ]),
  ];
  rec
    .begin({
      zh: `收敛：${result.iterations} 轮后 FOLLOW 集稳定。`,
      en: `Converged: FOLLOW stable after ${result.iterations} rounds.`,
    })
    .setGrid(rec.gridFrom(rows))
    .setAux([{ label: '收敛轮数', value: String(result.iterations), role: 'final' as BarRole }])
    .commit();

  return rec.build();
}

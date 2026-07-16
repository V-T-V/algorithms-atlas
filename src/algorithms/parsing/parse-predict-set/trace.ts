// =============================================================================
// PREDICT 预测集 · 录制帧序列
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { computePredict, prodStr, type CFG, type PredictHooks } from './impl.ts';

export const DEFAULT_INPUT: CFG = {
  start: 'S',
  nonTerminals: new Set(['S', 'A']),
  productions: [
    { lhs: 'S', rhs: ['A', 'a'] },
    { lhs: 'A', rhs: ['b'] },
    { lhs: 'A', rhs: [] }, // ε
  ],
};

export function buildTrace(input: CFG = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();

  rec
    .begin({
      zh: `文法 ${input.productions.length} 条产生式。计算每条 PREDICT 集并检测相交。`,
      en: `Grammar ${input.productions.length} productions. Compute PREDICT sets and check overlap.`,
    })
    .setAux([
      {
        label: '产生式',
        value: input.productions.map(prodStr).join('\n'),
        role: 'frontier' as BarRole,
      },
    ])
    .commit();

  const hooks: PredictHooks = {
    onProduction: (p, predict) => {
      rec
        .begin({
          zh: `PREDICT(${prodStr(p)}) = { ${[...predict].join(', ')} }`,
          en: `PREDICT(${prodStr(p)}) = { ${[...predict].join(', ')} }`,
        })
        .setAux([
          { label: '产生式', value: prodStr(p), role: 'pivot' as BarRole },
          { label: 'PREDICT', value: `{ ${[...predict].join(', ')} }`, role: 'compare' as BarRole },
        ])
        .commit();
    },
    onConflict: (nt, p1, p2, overlap) => {
      rec
        .begin({
          zh: `冲突：${nt} 的两条候选在 { ${overlap.join(', ')} } 上相交。`,
          en: `Conflict: two alternatives of ${nt} overlap on { ${overlap.join(', ')} }.`,
        })
        .setAux([
          { label: '非终结符', value: nt, role: 'warn' as BarRole },
          { label: '候选1', value: prodStr(p1), role: 'compare' as BarRole },
          { label: '候选2', value: prodStr(p2), role: 'compare' as BarRole },
          { label: '相交', value: overlap.join(','), role: 'warn' as BarRole },
        ])
        .commit();
    },
  };

  const result = computePredict(input, hooks);

  // 汇总表
  const header = ['产生式', 'PREDICT'];
  const rows = [
    header,
    ...result.entries.map((e) => [
      prodStr(e.production),
      `{ ${[...e.predict].sort().join(', ')} }`,
    ]),
  ];
  rec
    .begin({
      zh: result.isLL1
        ? `PREDICT 集两两不相交，文法是 LL(1)。`
        : `检测到 ${result.conflicts.length} 处相交，文法非 LL(1)。`,
      en: result.isLL1
        ? `PREDICT sets disjoint; grammar is LL(1).`
        : `${result.conflicts.length} overlaps; grammar is NOT LL(1).`,
    })
    .setGrid(rec.gridFrom(rows))
    .setAux([
      {
        label: '判定',
        value: result.isLL1 ? 'LL(1)' : '非 LL(1)',
        role: (result.isLL1 ? 'final' : 'warn') as BarRole,
      },
      { label: '冲突数', value: String(result.conflicts.length), role: 'compare' as BarRole },
    ])
    .commit();

  return rec.build();
}

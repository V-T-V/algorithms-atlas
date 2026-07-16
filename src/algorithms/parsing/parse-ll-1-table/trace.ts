// =============================================================================
// LL(1) 分析表构建 · 录制帧序列
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildLL1Table, prodStr, type CFG, type TableHooks } from './impl.ts';

// 经典文法 E → T E'；E' → + T E' | ε；T → F T'；T' → * F T' | ε；F → ( E ) | id
export const DEFAULT_INPUT: CFG = {
  start: 'E',
  nonTerminals: new Set(['E', "E'", 'T', "T'", 'F']),
  productions: [
    { lhs: 'E', rhs: ['T', "E'"] },
    { lhs: "E'", rhs: ['+', 'T', "E'"] },
    { lhs: "E'", rhs: [] },
    { lhs: 'T', rhs: ['F', "T'"] },
    { lhs: "T'", rhs: ['*', 'F', "T'"] },
    { lhs: "T'", rhs: [] },
    { lhs: 'F', rhs: ['(', 'E', ')'] },
    { lhs: 'F', rhs: ['id'] },
  ],
};

/** 录制演示帧序列。 */
export function buildTrace(input: CFG = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();

  rec
    .begin({
      zh: `文法 ${input.productions.length} 条产生式，起始 ${input.start}。先计算 FIRST/FOLLOW，再填表。`,
      en: `Grammar with ${input.productions.length} productions, start ${input.start}. Compute FIRST/FOLLOW then fill table.`,
    })
    .setAux([
      {
        label: '产生式',
        value: input.productions.map(prodStr).join('\n'),
        role: 'frontier' as BarRole,
      },
      { label: '非终结符', value: [...input.nonTerminals].join(','), role: 'pivot' as BarRole },
    ])
    .commit();

  const hooks: TableHooks = {
    onFirst: (nt, set) => {
      rec
        .begin({
          zh: `FIRST(${nt}) = { ${[...set].join(', ')} }`,
          en: `FIRST(${nt}) = { ${[...set].join(', ')} }`,
        })
        .setAux([
          { label: '非终结符', value: nt, role: 'pivot' as BarRole },
          { label: 'FIRST', value: `{ ${[...set].join(', ')} }`, role: 'compare' as BarRole },
        ])
        .commit();
    },
    onFollow: (nt, set) => {
      rec
        .begin({
          zh: `FOLLOW(${nt}) = { ${[...set].join(', ')} }`,
          en: `FOLLOW(${nt}) = { ${[...set].join(', ')} }`,
        })
        .setAux([
          { label: '非终结符', value: nt, role: 'pivot' as BarRole },
          { label: 'FOLLOW', value: `{ ${[...set].join(', ')} }`, role: 'compare' as BarRole },
        ])
        .commit();
    },
    onConflict: (nt, terminal, prods) => {
      rec
        .begin({
          zh: `冲突：M[${nt}][${terminal}] 有 ${prods.length} 条产生式`,
          en: `Conflict: M[${nt}][${terminal}] has ${prods.length} productions`,
        })
        .setAux([
          { label: '冲突格', value: `${nt},${terminal}`, role: 'warn' as BarRole },
          { label: '产生式', value: prods.map(prodStr).join(' | '), role: 'compare' as BarRole },
        ])
        .commit();
    },
  };

  const table = buildLL1Table(input, hooks);

  // 把分析表渲染成 2D 网格
  const header = ['NT\\T', ...table.terminals];
  const rows: Array<Array<string | number | undefined>> = [header];
  for (const nt of table.nonTerminals) {
    const row: Array<string | undefined> = [nt];
    for (const t of table.terminals) {
      const cell = table.cells[nt]?.[t] ?? [];
      row.push(cell.length === 0 ? '' : cell.map(prodStr).join(' | '));
    }
    rows.push(row);
  }
  const roles: Record<string, BarRole> = {};
  // 标记冲突格
  for (const c of table.conflicts) {
    const ci = table.terminals.indexOf(c.terminal) + 1;
    const ri = table.nonTerminals.indexOf(c.nonTerminal) + 1;
    roles[`${ri},${ci}`] = 'warn';
  }

  rec
    .begin({
      zh: table.isLL1
        ? `文法是 LL(1)：分析表无冲突。`
        : `文法非 LL(1)：${table.conflicts.length} 处冲突。`,
      en: table.isLL1
        ? `Grammar is LL(1): no conflicts.`
        : `Grammar is NOT LL(1): ${table.conflicts.length} conflicts.`,
    })
    .setGrid(rec.gridFrom(rows, roles))
    .setAux([
      {
        label: '判定',
        value: table.isLL1 ? 'LL(1)' : '非 LL(1)',
        role: (table.isLL1 ? 'final' : 'warn') as BarRole,
      },
      { label: '冲突数', value: String(table.conflicts.length), role: 'compare' as BarRole },
    ])
    .commit();

  return rec.build();
}

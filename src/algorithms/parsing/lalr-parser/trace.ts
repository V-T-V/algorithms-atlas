// =============================================================================
// LALR(1) 分析器 · 录制帧序列
// 展示合并同心状态后的项目集 + ACTION/GOTO 表，对比 LR(1) 状态数。
// =============================================================================

import type { BarRole, Cell, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import {
  lalrParse,
  buildLalrTable,
  buildLalrItemSets,
  buildLr1TableForComparison,
  makeSampleGrammar,
  type Grammar,
  type LalrHooks,
} from './impl.ts';

export const DEFAULT_INPUT = ['c', 'd', 'd'];

/** 录制演示帧序列。 */
export function buildTrace(input: string[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const g = makeSampleGrammar();
  const { sets } = buildLalrItemSets(g);
  const { table, originalCount } = buildLalrTable(g);
  const lr1Cmp = buildLr1TableForComparison(g);

  const terminals = [...g.terminals, '$'];
  const nonTerminals = [...g.nonTerminals].filter((nt) => nt !== g.productions[0]!.lhs);

  // 帧 1：文法 + 对比
  const grammarAux = g.productions.map((p, i) => ({
    label: `(${i})`,
    value: `${p.lhs} → ${p.rhs.length === 0 ? 'ε' : p.rhs.join(' ')}`,
    role: (i === 0 ? 'pivot' : 'default') as BarRole,
  }));
  rec
    .begin({
      zh: `LALR(1) 文法（增广 S'→S）。输入：${input.join(' ')} $。LR(1) 有 ${lr1Cmp.count} 状态，LALR 合并为 ${sets.length}。`,
      en: `LALR(1) grammar (augmented S'→S). Input: ${input.join(' ')} $. LR(1) has ${lr1Cmp.count} states; LALR merges to ${sets.length}.`,
    })
    .setAux([
      ...grammarAux,
      { label: 'LR(1) 状态数', value: String(lr1Cmp.count), role: 'compare' as BarRole },
      { label: 'LALR 状态数', value: String(sets.length), role: 'final' as BarRole },
      { label: '合并掉', value: String(originalCount - sets.length), role: 'swap' as BarRole },
    ])
    .commit();

  // 帧 2：LALR 项目集
  const itemGrid: Cell[][] = [
    [
      { v: 'state', role: 'default' },
      { v: 'LALR(1) items', role: 'pivot' },
    ],
  ];
  for (const s of sets) {
    itemGrid.push([
      { v: `I${s.id}`, role: 'pivot' },
      {
        v: s.items
          .map((it) => {
            const p = g.productions[it.prod]!;
            const rhs = [...p.rhs];
            rhs.splice(it.dot, 0, '·');
            return `[${p.lhs}→${rhs.join(' ')}, ${it.la}]`;
          })
          .join('   '),
        role: 'sorted',
      },
    ]);
  }
  rec
    .begin({
      zh: `LALR(1) 项目集（同心状态已合并）：${sets.length} 状态`,
      en: `LALR(1) item sets (core-equivalent states merged): ${sets.length} states`,
    })
    .setGrid(itemGrid)
    .setAux([{ label: '状态数', value: String(sets.length), role: 'final' as BarRole }])
    .commit();

  // 帧 3：ACTION/GOTO 表
  const header: Cell[] = [{ v: 'state', role: 'default' }];
  for (const t of terminals) header.push({ v: t, role: 'pivot' });
  for (const nt of nonTerminals) header.push({ v: nt, role: 'frontier' });
  const tableGrid: Cell[][] = [header];
  for (const s of sets) {
    const row: Cell[] = [{ v: s.id, role: 'pivot' }];
    for (const t of terminals) {
      const act = table.action.get(`${s.id},${t}`);
      let v = '';
      let role: BarRole = 'default';
      if (act) {
        if (act.type === 'shift') {
          v = `s${act.target}`;
          role = 'swap';
        } else if (act.type === 'reduce') v = `r${act.prod}`;
        else {
          v = 'acc';
          role = 'final';
        }
      }
      row.push({ v, role });
    }
    for (const nt of nonTerminals) {
      const gt = table.goto.get(`${s.id},${nt}`);
      row.push({
        v: gt !== undefined ? String(gt) : '',
        role: gt !== undefined ? 'sorted' : 'default',
      });
    }
    tableGrid.push(row);
  }
  rec
    .begin({
      zh: `ACTION/GOTO 表（冲突 ${table.conflicts}）`,
      en: `ACTION/GOTO table (${table.conflicts} conflicts)`,
    })
    .setGrid(tableGrid)
    .setAux([
      {
        label: '冲突数',
        value: String(table.conflicts),
        role: (table.conflicts === 0 ? 'final' : 'warn') as BarRole,
      },
      { label: 'LR(1) 冲突', value: String(lr1Cmp.conflicts), role: 'compare' as BarRole },
    ])
    .commit();

  // 分析过程
  const hooks: LalrHooks = {
    onShift: (token, from, to) => {
      rec
        .begin({
          zh: `移进 "${token}"：状态 ${from} → ${to}`,
          en: `Shift "${token}": state ${from} → ${to}`,
        })
        .setGrid(tableGrid)
        .setAux([
          { label: '动作', value: `shift "${token}"`, role: 'swap' as BarRole },
          { label: '说明', value: `${from}→${to}`, role: 'pivot' as BarRole },
        ])
        .commit();
    },
    onReduce: (prodIndex, lhs) => {
      const prod = g.productions[prodIndex]!;
      rec
        .begin({
          zh: `归约：用产生式 (${prodIndex}) ${lhs} → ${prod.rhs.length === 0 ? 'ε' : prod.rhs.join(' ')}`,
          en: `Reduce: by production (${prodIndex}) ${lhs} → ${prod.rhs.length === 0 ? 'ε' : prod.rhs.join(' ')}`,
        })
        .setGrid(tableGrid)
        .setAux([
          { label: '动作', value: `reduce (${prodIndex})`, role: 'final' as BarRole },
          {
            label: '产生式',
            value: `${lhs} → ${prod.rhs.length === 0 ? 'ε' : prod.rhs.join(' ')}`,
            role: 'compare' as BarRole,
          },
        ])
        .commit();
    },
    onAccept: () => {
      rec
        .begin({ zh: `接受：输入符合文法`, en: `Accept: input matches the grammar` })
        .setGrid(tableGrid)
        .setAux([{ label: '结果', value: 'ACCEPT', role: 'final' as BarRole }])
        .commit();
    },
    onError: (token, state) => {
      rec
        .begin({
          zh: `报错：状态 ${state} 遇到 "${token}" 无动作`,
          en: `Error: no action in state ${state} for "${token}"`,
        })
        .setGrid(tableGrid)
        .setAux([{ label: '结果', value: 'ERROR', role: 'warn' as BarRole }])
        .commit();
    },
  };

  const result = lalrParse(input, g, hooks);

  rec
    .begin({
      zh: result.accepted
        ? `完成：输入被接受（${result.steps.length} 步）`
        : `完成：输入被拒绝（${result.steps.length} 步）`,
      en: result.accepted
        ? `Done: input accepted (${result.steps.length} steps)`
        : `Done: input rejected (${result.steps.length} steps)`,
    })
    .setGrid(tableGrid)
    .setAux([
      {
        label: '结果',
        value: result.accepted ? 'ACCEPT' : 'REJECT',
        role: (result.accepted ? 'final' : 'warn') as BarRole,
      },
      { label: '步数', value: String(result.steps.length), role: 'default' as BarRole },
      { label: 'LALR 状态数', value: String(sets.length), role: 'pivot' as BarRole },
      { label: 'LR(1) 状态数', value: String(lr1Cmp.count), role: 'compare' as BarRole },
    ])
    .commit();

  return rec.build();
}

export { makeSampleGrammar };
export type { Grammar };

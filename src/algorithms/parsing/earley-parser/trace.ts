// =============================================================================
// Earley 分析器 · 录制帧序列
// 用 setGrid 展示每位置的状态集（chart），aux 展示当前操作。
// =============================================================================

import type { BarRole, Cell, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { earleyParse, SAMPLE_GRAMMAR, type Grammar, type EarleyHooks, type State } from './impl.ts';

export const DEFAULT_INPUT = ['id', '+', 'id', '*', 'id'];

function stateStr(s: State, g: Grammar): string {
  const p = g.productions[s.prod]!;
  const rhs = [...p.rhs];
  rhs.splice(s.dot, 0, '·');
  return `${p.lhs}→${rhs.join(' ')} @${s.origin}`;
}

/** 录制演示帧序列。 */
export function buildTrace(input: string[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const g = SAMPLE_GRAMMAR;
  const n = input.length;

  // 先跑一遍获取最终 chart（用于初始展示空 chart）
  const final = earleyParse(input, g);

  const renderChart = (chart: State[][], curPos: number): Cell[][] => {
    const header: Cell[] = [{ v: 'pos', role: 'default' }];
    for (let i = 0; i <= n; i++)
      header.push({ v: `S${i}${i < n ? `:${input[i]}` : ':$'}`, role: 'pivot' });
    const rows: Cell[][] = [header];
    const maxLen = Math.max(...chart.map((s) => s.length), 0);
    for (let r = 0; r < Math.max(maxLen, 1); r++) {
      const row: Cell[] = [{ v: `#${r}`, role: 'pivot' }];
      for (let i = 0; i <= n; i++) {
        const st = chart[i]![r];
        if (st === undefined) {
          row.push({ v: '', role: 'default' });
        } else {
          let role: BarRole = 'sorted';
          if (i === curPos) role = 'compare';
          row.push({ v: stateStr(st, g), role });
        }
      }
      rows.push(row);
    }
    return rows;
  };

  // 初始空 chart
  const emptyChart: State[][] = [];
  for (let i = 0; i <= n; i++) emptyChart.push([]);
  // 注入起始预测
  for (let p = 0; p < g.productions.length; p++) {
    if (g.productions[p]!.lhs === g.start) emptyChart[0]!.push({ prod: p, dot: 0, origin: 0 });
  }

  rec
    .begin({
      zh: `Earley 分析：输入 ${input.join(' ')} $（${n} token）。文法起始符 ${g.start}。`,
      en: `Earley parse: input ${input.join(' ')} $ (${n} tokens). Start ${g.start}.`,
    })
    .setGrid(renderChart(emptyChart, 0))
    .setAux([
      { label: '操作', value: '初始化 S_0', role: 'frontier' as BarRole },
      { label: '当前位置', value: '0', role: 'pivot' as BarRole },
      ...g.productions.map((p, i) => ({
        label: `(${i})`,
        value: `${p.lhs} → ${p.rhs.length === 0 ? 'ε' : p.rhs.join(' ')}`,
        role: 'default' as BarRole,
      })),
    ])
    .commit();

  // 用钩子增量展示
  // 重建 chart 副本随操作增长
  const liveChart: State[][] = [];
  for (let i = 0; i <= n; i++) liveChart.push([]);
  for (let p = 0; p < g.productions.length; p++) {
    if (g.productions[p]!.lhs === g.start) liveChart[0]!.push({ prod: p, dot: 0, origin: 0 });
  }

  const hooks: EarleyHooks = {
    onPredict: (pos, st) => {
      const prod = g.productions[st.prod]!;
      const sym = prod.rhs[st.dot]!;
      rec
        .begin({
          zh: `位置 ${pos} 预测：${sym} 的产生式加入 S_${pos}`,
          en: `Pos ${pos} predict: add ${sym}'s productions to S_${pos}`,
        })
        .setGrid(renderChart(final.chart, pos))
        .setAux([
          { label: '操作', value: `predict ${sym}`, role: 'compare' as BarRole },
          { label: '触发状态', value: stateStr(st, g), role: 'pivot' as BarRole },
          { label: '位置', value: String(pos), role: 'frontier' as BarRole },
        ])
        .commit();
    },
    onScan: (pos, st, token) => {
      rec
        .begin({
          zh: `位置 ${pos} 扫描：token "${token}" 匹配，推进到 S_${pos + 1}`,
          en: `Pos ${pos} scan: token "${token}" matches, advance to S_${pos + 1}`,
        })
        .setGrid(renderChart(final.chart, pos))
        .setAux([
          { label: '操作', value: `scan "${token}"`, role: 'swap' as BarRole },
          { label: '触发状态', value: stateStr(st, g), role: 'pivot' as BarRole },
          { label: '推进到', value: `S_${pos + 1}`, role: 'final' as BarRole },
        ])
        .commit();
    },
    onComplete: (pos, st) => {
      const prod = g.productions[st.prod]!;
      rec
        .begin({
          zh: `位置 ${pos} 完成：${prod.lhs}→${prod.rhs.length === 0 ? 'ε' : prod.rhs.join(' ')}·@${st.origin}，激活起源集中的等待者`,
          en: `Pos ${pos} complete: ${prod.lhs}→${prod.rhs.length === 0 ? 'ε' : prod.rhs.join(' ')}·@${st.origin}, advance awaiters in origin set`,
        })
        .setGrid(renderChart(final.chart, pos))
        .setAux([
          { label: '操作', value: `complete ${prod.lhs}`, role: 'final' as BarRole },
          { label: '完成态', value: stateStr(st, g), role: 'pivot' as BarRole },
          { label: '起源', value: String(st.origin), role: 'compare' as BarRole },
        ])
        .commit();
    },
  };

  void liveChart;
  earleyParse(input, g, hooks);

  // 终态：完整 chart
  rec
    .begin({
      zh: final.accepted
        ? `完成：输入被接受（${final.chart.reduce((a, s) => a + s.length, 0)} 状态）`
        : `完成：输入被拒绝`,
      en: final.accepted
        ? `Done: input accepted (${final.chart.reduce((a, s) => a + s.length, 0)} states)`
        : `Done: input rejected`,
    })
    .setGrid(renderChart(final.chart, -1))
    .setAux([
      {
        label: '结果',
        value: final.accepted ? 'ACCEPT' : 'REJECT',
        role: (final.accepted ? 'final' : 'warn') as BarRole,
      },
      {
        label: '状态总数',
        value: String(final.chart.reduce((a, s) => a + s.length, 0)),
        role: 'default' as BarRole,
      },
      { label: '位置数', value: String(n + 1), role: 'pivot' as BarRole },
    ])
    .commit();

  return rec.build();
}

export { SAMPLE_GRAMMAR };
export type { Grammar };

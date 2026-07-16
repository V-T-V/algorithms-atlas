// =============================================================================
// 正则 → NFA · 录制帧序列
// 用 setGraph 展示 NFA 状态与转移；ε 转移用 frontier 色，字符转移用 compare 色。
// =============================================================================

import type { BarRole, Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { regexToNfa, type Nfa, type RegexNfaHooks } from './impl.ts';

export const DEFAULT_INPUT = '(a|b)*';

/** 把 NFA 渲染成 graph 节点/边。 */
function renderGraph(nfa: Nfa): { nodes: GraphNode[]; edges: GraphEdge[] } {
  // 按状态编号排成水平线
  const nodes: GraphNode[] = [];
  for (let i = 0; i < nfa.states; i++) {
    let role: BarRole = 'default';
    if (i === nfa.start) role = 'pivot';
    else if (i === nfa.accept) role = 'final';
    nodes.push({
      id: `q${i}`,
      label: `q${i}`,
      role,
      // 简单均匀布局
      x: nfa.states > 1 ? i / (nfa.states - 1) : 0.5,
      y: 0.5,
    });
  }
  const edges: GraphEdge[] = nfa.transitions.map((t) => ({
    from: `q${t.from}`,
    to: `q${t.to}`,
    label: t.symbol === null ? 'ε' : t.symbol,
    role: t.symbol === null ? ('frontier' as BarRole) : ('compare' as BarRole),
    directed: true,
  }));
  return { nodes, edges };
}

/** 录制演示帧序列。 */
export function buildTrace(input: string = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();

  rec
    .begin({
      zh: `把正则 "${input}" 转换为 ε-NFA（Thompson 构造）`,
      en: `Convert regex "${input}" to ε-NFA (Thompson construction)`,
    })
    .setAux([
      { label: '正则', value: input, role: 'compare' as BarRole },
      {
        label: '支持的运算',
        value: '拼接 / | 选择 / * 星号 / ( ) 分组',
        role: 'default' as BarRole,
      },
    ])
    .commit();

  const hooks: RegexNfaHooks = {
    onFragment: (kind, nfa) => {
      const { nodes, edges } = renderGraph(nfa);
      const kindLabel: Record<string, string> = {
        char: '字符',
        concat: '拼接',
        alt: '选择',
        star: '星号',
      };
      rec
        .begin({
          zh: `构造 ${kindLabel[kind]} 片段（当前 ${nfa.states} 状态）`,
          en: `Build ${kind} fragment (${nfa.states} states so far)`,
        })
        .setGraph(nodes, edges)
        .setAux([
          { label: '片段类型', value: kind, role: 'pivot' as BarRole },
          { label: '状态数', value: String(nfa.states), role: 'default' as BarRole },
          { label: '起/止', value: `q${nfa.start} → q${nfa.accept}`, role: 'frontier' as BarRole },
          { label: '正则', value: input, role: 'compare' as BarRole },
        ])
        .commit();
    },
    onResult: (nfa) => {
      const { nodes, edges } = renderGraph(nfa);
      rec
        .begin({
          zh: `完成：NFA 共 ${nfa.states} 个状态，起=q${nfa.start}，接受=q${nfa.accept}`,
          en: `Done: NFA has ${nfa.states} states, start=q${nfa.start}, accept=q${nfa.accept}`,
        })
        .setGraph(nodes, edges)
        .setAux([
          { label: '总状态数', value: String(nfa.states), role: 'final' as BarRole },
          { label: '转移数', value: String(nfa.transitions.length), role: 'default' as BarRole },
          { label: '正则', value: input, role: 'compare' as BarRole },
        ])
        .commit();
    },
  };

  regexToNfa(input, hooks);

  return rec.build();
}

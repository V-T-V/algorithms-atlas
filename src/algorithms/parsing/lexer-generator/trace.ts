// =============================================================================
// 词法分析器生成器 · 录制帧序列
// 用 graph 可视化展示 DFA（状态节点 + 字符转移边），用 aux 展示扫描进度与 token。
// =============================================================================

import type { BarRole, Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { generateLexer, DEMO_RULES, DEMO_INPUT, type Dfa } from './impl.ts';

export const DEFAULT_INPUT = DEMO_INPUT;

/** 把 DFA 渲染为图节点/边（仅展示接受态与典型转移）。 */
function dfaToGraph(
  dfa: Dfa,
  current?: number,
  acceptKinds?: Map<number, string>,
): { nodes: GraphNode[]; edges: GraphEdge[] } {
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];
  // 简单环形布局
  const n = dfa.numStates;
  for (let s = 0; s < n; s++) {
    const isAccept = dfa.accept.has(s);
    const role: BarRole =
      s === current ? 'frontier' : isAccept ? 'final' : s === 0 ? 'pivot' : 'default';
    const label =
      acceptKinds && isAccept ? `S${s}·${acceptKinds.get(dfa.accept.get(s)!)}` : `S${s}`;
    const angle = (s / Math.max(n, 1)) * Math.PI * 2;
    nodes.push({
      id: `S${s}`,
      label,
      x: 0.5 + 0.35 * Math.cos(angle),
      y: 0.5 + 0.35 * Math.sin(angle),
      role,
    });
  }
  // 边：合并同目标、按字符标注
  for (let s = 0; s < n; s++) {
    const trans = dfa.transitions[s]!;
    // 按目标分组
    const byTarget = new Map<number, string[]>();
    for (const [c, t] of trans) {
      const arr = byTarget.get(t) ?? [];
      arr.push(c);
      byTarget.set(t, arr);
    }
    for (const [t, chars] of byTarget) {
      edges.push({ from: `S${s}`, to: `S${t}`, weight: chars.length, role: 'default' });
    }
  }
  return { nodes, edges };
}

export function buildTrace(input: string = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const lex = generateLexer(DEMO_RULES);
  const dfa = lex.dfa;
  const acceptKinds = new Map<number, string>();
  for (const [s, r] of dfa.accept) acceptKinds.set(s, DEMO_RULES[r]!.kind);

  const g = dfaToGraph(dfa, 0, acceptKinds);

  // 初始帧：展示 DFA
  rec
    .begin({
      zh: `生成的 DFA：${dfa.numStates} 个状态`,
      en: `Generated DFA: ${dfa.numStates} states`,
    })
    .setGraph(g.nodes, g.edges)
    .setAux([
      {
        label: '规则',
        value: DEMO_RULES.map((r) => `${r.kind}=${r.pattern}`).join('  '),
        role: 'default' as BarRole,
      },
      { label: '输入', value: input, role: 'compare' as BarRole },
      { label: '状态数', value: String(dfa.numStates), role: 'frontier' as BarRole },
    ])
    .commit();

  // 扫描并逐 token 录帧
  const collected: Array<{ kind: string; text: string; start: number; end: number }> = [];
  lex.scan(input, {
    onToken: (tok) => {
      collected.push({ kind: tok.kind, text: tok.text, start: tok.start, end: tok.end });
      const consumed = input.slice(0, tok.end);
      const remaining = input.slice(tok.end);
      rec
        .begin({
          zh: `匹配 token ${tok.kind}："${tok.text}"`,
          en: `Match token ${tok.kind}: "${tok.text}"`,
        })
        .setGraph(g.nodes, g.edges)
        .setAux([
          { label: '输入', value: `[${consumed}] ▍ ${remaining}`, role: 'compare' as BarRole },
          {
            label: '当前 token',
            value: `${tok.kind}:'${tok.text}'@${tok.start}-${tok.end}`,
            role: 'final' as BarRole,
          },
          {
            label: '已识别',
            value: collected.map((t) => `${t.kind}:'${t.text}'`).join(' '),
            role: 'default' as BarRole,
          },
        ])
        .commit();
    },
    onError: (ch, pos) => {
      rec
        .begin({
          zh: `跳过无法识别字符 '${ch}'@${pos}`,
          en: `Skip unrecognized char '${ch}'@${pos}`,
        })
        .setGraph(g.nodes, g.edges)
        .setAux([{ label: '错误', value: `无法识别 '${ch}'@${pos}`, role: 'warn' as BarRole }])
        .commit();
    },
  });

  // 最终帧
  rec
    .begin({ zh: '扫描完成', en: 'Scan complete' })
    .setGraph(g.nodes, g.edges)
    .setAux([
      { label: 'token 数', value: String(collected.length), role: 'final' as BarRole },
      {
        label: '结果',
        value: collected.map((t) => `${t.kind}:'${t.text}'`).join('  '),
        role: 'compare' as BarRole,
      },
    ])
    .commit();

  return rec.build();
}

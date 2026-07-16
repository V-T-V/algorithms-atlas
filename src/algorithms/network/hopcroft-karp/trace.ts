// =============================================================================
// Hopcroft-Karp 二分图匹配 · 录制帧序列
// 用 setGraph 展示二分图，匹配边标 'final'，本轮增广标 'compare'。
// =============================================================================

import type { BarRole, Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { hopcroftKarp, type BipartiteEdge, type HopcroftKarpHooks } from './impl.ts';

/** 演示二分图：左 4 个，右 4 个。 */
export const DEFAULT_INPUT = {
  nLeft: 4,
  nRight: 4,
  edges: [
    [0, 0],
    [0, 1],
    [1, 1],
    [1, 2],
    [2, 2],
    [2, 3],
    [3, 0],
    [3, 3],
  ] as BipartiteEdge[],
};

export function buildTrace(
  input: { nLeft: number; nRight: number; edges: BipartiteEdge[] } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const { nLeft, nRight, edges } = input;

  // 当前匹配（双向）
  const pairU = new Array<number>(nLeft).fill(-1);
  const pairV = new Array<number>(nRight).fill(-1);
  const newEdges = new Set<string>(); // 本轮新增的匹配边
  let round = 0;

  const render = (note: { zh: string; en: string }): void => {
    const nodes: GraphNode[] = [];
    for (let l = 0; l < nLeft; l++) {
      nodes.push({
        id: `L${l}`,
        label: `L${l}`,
        x: 0.2,
        y: (l + 1) / (nLeft + 1),
        role: (pairU[l] !== -1 ? 'final' : 'default') as BarRole,
      });
    }
    for (let r = 0; r < nRight; r++) {
      nodes.push({
        id: `R${r}`,
        label: `R${r}`,
        x: 0.8,
        y: (r + 1) / (nRight + 1),
        role: (pairV[r] !== -1 ? 'final' : 'default') as BarRole,
      });
    }
    const e2: GraphEdge[] = edges.map(([l, r]) => {
      const key = `L${l}>R${r}`;
      let role: BarRole = 'default';
      if (pairU[l] === r) role = 'final';
      if (newEdges.has(key)) role = 'compare';
      return { from: `L${l}`, to: `R${r}`, role };
    });
    const matched = pairU.filter((r) => r !== -1).length;
    const aux = [
      { label: '轮次', value: round > 0 ? `第 ${round} 轮` : '初始', role: 'pivot' as BarRole },
      { label: '当前匹配数', value: String(matched), role: 'final' as BarRole },
    ];
    rec.begin(note).setGraph(nodes, e2).setAux(aux).commit();
  };

  render({ zh: '初始二分图', en: 'Initial bipartite graph' });

  const hooks: HopcroftKarpHooks = {
    onLayer: () => {
      newEdges.clear();
    },
    onAugment: (l, r) => {
      pairU[l] = r;
      pairV[r] = l;
      newEdges.add(`L${l}>R${r}`);
    },
    onRound: (rd, newMatches, total) => {
      round = rd;
      render({
        zh: `第 ${rd} 轮：新增 ${newMatches} 条，累计 ${total}`,
        en: `Round ${rd}: +${newMatches}, total ${total}`,
      });
      newEdges.clear();
    },
  };

  const result = hopcroftKarp(nLeft, nRight, edges, hooks);

  // 终态
  const nodes: GraphNode[] = [];
  for (let l = 0; l < nLeft; l++) {
    nodes.push({
      id: `L${l}`,
      label: `L${l}`,
      x: 0.2,
      y: (l + 1) / (nLeft + 1),
      role: 'final' as BarRole,
    });
  }
  for (let r = 0; r < nRight; r++) {
    nodes.push({
      id: `R${r}`,
      label: `R${r}`,
      x: 0.8,
      y: (r + 1) / (nRight + 1),
      role: 'final' as BarRole,
    });
  }
  rec
    .begin({ zh: `完成，最大匹配 = ${result}`, en: `Done, max matching = ${result}` })
    .setGraph(
      nodes,
      edges.map(([l, r]) => ({
        from: `L${l}`,
        to: `R${r}`,
        role: (pairU[l] === r ? 'final' : 'default') as BarRole,
      })),
    )
    .setAux([{ label: '最大匹配', value: String(result), role: 'final' as BarRole }])
    .commit();

  return rec.build();
}

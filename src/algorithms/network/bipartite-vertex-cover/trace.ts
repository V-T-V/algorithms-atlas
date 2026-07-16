// =============================================================================
// 二分图最小点覆盖 · 录制帧序列
// 用 setGraph 展示二分图，高亮最大匹配边、交替路、最终覆盖点。
// =============================================================================

import type { BarRole, Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { bipartiteVertexCover, type BvcEdge, type BvcHooks } from './impl.ts';

export const DEFAULT_INPUT = {
  nLeft: 4,
  nRight: 4,
  edges: [
    { from: 0, to: 0 },
    { from: 0, to: 1 },
    { from: 1, to: 0 },
    { from: 1, to: 2 },
    { from: 2, to: 1 },
    { from: 2, to: 3 },
    { from: 3, to: 2 },
    { from: 3, to: 3 },
  ] as BvcEdge[],
};

export function buildTrace(
  input: { nLeft: number; nRight: number; edges: BvcEdge[] } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const { nLeft, nRight, edges } = input;

  const matchL = new Array<number>(nLeft).fill(-1);
  const visitedL = new Array<boolean>(nLeft).fill(false);
  const visitedR = new Array<boolean>(nRight).fill(false);
  const activeNodes = new Set<string>();

  const render = (
    note: { zh: string; en: string },
    finalCover?: { l: Set<number>; r: Set<number> },
  ): void => {
    const nodes: GraphNode[] = [];
    for (let i = 0; i < nLeft; i++) {
      let role: BarRole = 'default';
      if (finalCover ? finalCover.l.has(i) : false) role = 'final';
      else if (matchL[i]! !== -1) role = 'frontier';
      if (activeNodes.has(`L${i}`)) role = 'compare';
      nodes.push({
        id: `L${i}`,
        label: `L${i}`,
        x: 0.15,
        y: nLeft === 1 ? 0.5 : (i / (nLeft - 1)) * 0.8 + 0.1,
        role,
      });
    }
    for (let i = 0; i < nRight; i++) {
      let role: BarRole = 'default';
      if (finalCover ? finalCover.r.has(i) : false) role = 'final';
      if (activeNodes.has(`R${i}`)) role = 'compare';
      nodes.push({
        id: `R${i}`,
        label: `R${i}`,
        x: 0.85,
        y: nRight === 1 ? 0.5 : (i / (nRight - 1)) * 0.8 + 0.1,
        role,
      });
    }
    const e2: GraphEdge[] = edges.map((e) => {
      const matched = matchL[e.from]! === e.to;
      return {
        from: `L${e.from}`,
        to: `R${e.to}`,
        directed: false,
        role: (matched ? 'final' : 'default') as BarRole,
      };
    });
    const aux: Array<{ label: string; value: string; role?: BarRole }> = finalCover
      ? [
          {
            label: '左覆盖',
            value: [...finalCover.l].map((i) => `L${i}`).join(',') || '∅',
            role: 'final' as BarRole,
          },
          {
            label: '右覆盖',
            value: [...finalCover.r].map((i) => `R${i}`).join(',') || '∅',
            role: 'final' as BarRole,
          },
          {
            label: '覆盖大小',
            value: String(finalCover.l.size + finalCover.r.size),
            role: 'frontier' as BarRole,
          },
        ]
      : [
          {
            label: '已匹配数',
            value: String(matchL.filter((x) => x !== -1).length),
            role: 'frontier' as BarRole,
          },
        ];
    rec.begin(note).setGraph(nodes, e2).setAux(aux).commit();
  };

  render({
    zh: `初始二分图：${nLeft} 左 × ${nRight} 右`,
    en: `Initial: ${nLeft} left × ${nRight} right`,
  });

  const hooks: BvcHooks = {
    onMatching: (size) => {
      render({
        zh: `最大匹配求出，匹配数 = ${size}`,
        en: `Maximum matching found, size = ${size}`,
      });
    },
    onAlternatingStart: (u) => {
      activeNodes.clear();
      activeNodes.add(`L${u}`);
      visitedL[u] = true;
      render({
        zh: `从未匹配左点 L${u} 出发走交替路`,
        en: `Alternating path from unmatched L${u}`,
      });
    },
    onAlternatingVisit: (side, node) => {
      if (side === 'left') visitedL[node] = true;
      else visitedR[node] = true;
      activeNodes.add(`${side === 'left' ? 'L' : 'R'}${node}`);
      render({
        zh: `交替路访问 ${side === 'left' ? 'L' : 'R'}${node}`,
        en: `Alternating visit ${side === 'left' ? 'L' : 'R'}${node}`,
      });
    },
  };

  const result = bipartiteVertexCover(nLeft, nRight, edges, hooks);

  // 终态
  const nodes: GraphNode[] = [];
  for (let i = 0; i < nLeft; i++) {
    nodes.push({
      id: `L${i}`,
      label: `L${i}`,
      x: 0.15,
      y: nLeft === 1 ? 0.5 : (i / (nLeft - 1)) * 0.8 + 0.1,
      role: (result.leftCover.has(i) ? 'final' : 'default') as BarRole,
    });
  }
  for (let i = 0; i < nRight; i++) {
    nodes.push({
      id: `R${i}`,
      label: `R${i}`,
      x: 0.85,
      y: nRight === 1 ? 0.5 : (i / (nRight - 1)) * 0.8 + 0.1,
      role: (result.rightCover.has(i) ? 'final' : 'default') as BarRole,
    });
  }
  rec
    .begin({
      zh: `完成，最小覆盖大小 = ${result.size}（= 最大匹配 ${result.matchingSize}）`,
      en: `Done, min cover size = ${result.size} (= max matching ${result.matchingSize})`,
    })
    .setGraph(
      nodes,
      edges.map((e) => ({
        from: `L${e.from}`,
        to: `R${e.to}`,
        directed: false,
        role: (matchL[e.from]! === e.to ? 'final' : 'default') as BarRole,
      })),
    )
    .setAux([
      {
        label: '左覆盖',
        value: [...result.leftCover].map((i) => `L${i}`).join(',') || '∅',
        role: 'final' as BarRole,
      },
      {
        label: '右覆盖',
        value: [...result.rightCover].map((i) => `R${i}`).join(',') || '∅',
        role: 'final' as BarRole,
      },
      { label: '覆盖大小', value: String(result.size), role: 'frontier' as BarRole },
    ])
    .commit();

  return rec.build();
}

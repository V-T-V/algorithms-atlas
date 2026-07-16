// =============================================================================
// Kuhn 匹配 · 录制帧序列
// 用 setGraph 展示二分图；左点在左侧，右点在右侧；高亮当前增广路与已匹配边。
// =============================================================================

import type { BarRole, Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { kuhnMatching, type KuhnEdge, type KuhnHooks } from './impl.ts';

/** 演示二分图：4 左 4 右，最大匹配 = 4。 */
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
  ] as KuhnEdge[],
};

export function buildTrace(
  input: { nLeft: number; nRight: number; edges: KuhnEdge[] } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const { nLeft, nRight, edges } = input;

  const matchL = new Array<number>(nLeft).fill(-1); // 左→右
  const matchR = new Array<number>(nRight).fill(-1); // 右→左
  let curLeft = -1;
  const activeEdges = new Set<string>();

  const render = (note: { zh: string; en: string }): void => {
    const nodes: GraphNode[] = [];
    for (let i = 0; i < nLeft; i++) {
      let role: BarRole = 'default';
      if (i === curLeft) role = 'pivot';
      else if (matchL[i]! !== -1) role = 'final';
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
      if (matchR[i]! !== -1) role = 'final';
      nodes.push({
        id: `R${i}`,
        label: `R${i}`,
        x: 0.85,
        y: nRight === 1 ? 0.5 : (i / (nRight - 1)) * 0.8 + 0.1,
        role,
      });
    }
    const e2: GraphEdge[] = edges.map((e) => {
      const key = `${e.from}>${e.to}`;
      const matched = matchL[e.from]! === e.to;
      let role: BarRole = 'default';
      if (matched) role = 'final';
      else if (activeEdges.has(key)) role = 'compare';
      return {
        from: `L${e.from}`,
        to: `R${e.to}`,
        directed: false,
        role,
      };
    });
    const aux = [
      {
        label: '已匹配数',
        value: String(matchL.filter((x) => x !== -1).length),
        role: 'frontier' as BarRole,
      },
      ...edges
        .filter((e) => matchL[e.from]! === e.to)
        .map((e) => ({
          label: `L${e.from} — R${e.to}`,
          value: '已匹配',
          role: 'final' as BarRole,
        })),
    ];
    rec.begin(note).setGraph(nodes, e2).setAux(aux).commit();
  };

  render({
    zh: `初始二分图：${nLeft} 左 × ${nRight} 右`,
    en: `Initial bipartite: ${nLeft} left × ${nRight} right`,
  });

  const hooks: KuhnHooks = {
    onTryLeft: (u) => {
      curLeft = u;
      render({ zh: `尝试为 L${u} 找增广路`, en: `Try augmenting path for L${u}` });
    },
    onVisitRight: (u, r, success) => {
      activeEdges.clear();
      activeEdges.add(`${u}>${r}`);
      if (success) {
        matchL[u] = r;
        matchR[r] = u;
      }
      render({
        zh: success ? `L${u} — R${r} 匹配成功` : `L${u} 访问 R${r} 失败`,
        en: success ? `L${u} — R${r} matched` : `L${u} visit R${r} failed`,
      });
      activeEdges.clear();
    },
    onResult: (u, matched) => {
      curLeft = -1;
      render({
        zh: `L${u} ${matched ? '找到增广路' : '未找到增广路'}`,
        en: `L${u} ${matched ? 'augmented' : 'no augmenting path'}`,
      });
    },
  };

  const result = kuhnMatching(nLeft, nRight, edges, hooks);

  // 终态
  const nodes: GraphNode[] = [];
  for (let i = 0; i < nLeft; i++) {
    nodes.push({
      id: `L${i}`,
      label: `L${i}`,
      x: 0.15,
      y: nLeft === 1 ? 0.5 : (i / (nLeft - 1)) * 0.8 + 0.1,
      role: (matchL[i]! !== -1 ? 'final' : 'default') as BarRole,
    });
  }
  for (let i = 0; i < nRight; i++) {
    nodes.push({
      id: `R${i}`,
      label: `R${i}`,
      x: 0.85,
      y: nRight === 1 ? 0.5 : (i / (nRight - 1)) * 0.8 + 0.1,
      role: (matchR[i]! !== -1 ? 'final' : 'default') as BarRole,
    });
  }
  rec
    .begin({ zh: `完成，最大匹配 = ${result}`, en: `Done, maximum matching = ${result}` })
    .setGraph(
      nodes,
      edges.map((e) => ({
        from: `L${e.from}`,
        to: `R${e.to}`,
        directed: false,
        role: (matchL[e.from]! === e.to ? 'final' : 'default') as BarRole,
      })),
    )
    .setAux([{ label: '最大匹配数', value: String(result), role: 'frontier' as BarRole }])
    .commit();

  return rec.build();
}

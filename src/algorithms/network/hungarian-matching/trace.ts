// =============================================================================
// 匈牙利（Kuhn）二分图匹配 · 录制帧序列
// 用 setGraph 展示二分图，匹配边标 'final'，当前尝试标 'compare'。
// =============================================================================

import type { BarRole, Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { hungarian, type BipartiteEdge, type HungarianHooks } from './impl.ts';

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

  const matchR = new Array<number>(nRight).fill(-1); // r -> l
  const matchL = new Array<number>(nLeft).fill(-1); // l -> r
  let curTry: { l: number; r: number } | null = null;
  let justMatched = -1;

  const render = (note: { zh: string; en: string }): void => {
    const nodes: GraphNode[] = [];
    for (let l = 0; l < nLeft; l++) {
      let role: BarRole = 'default';
      if (matchL[l] !== -1) role = 'final';
      if (curTry && curTry.l === l) role = 'pivot';
      nodes.push({ id: `L${l}`, label: `L${l}`, x: 0.2, y: (l + 1) / (nLeft + 1), role });
    }
    for (let r = 0; r < nRight; r++) {
      let role: BarRole = 'default';
      if (matchR[r] !== -1) role = 'final';
      if (curTry && curTry.r === r) role = 'compare';
      nodes.push({ id: `R${r}`, label: `R${r}`, x: 0.8, y: (r + 1) / (nRight + 1), role });
    }
    const e2: GraphEdge[] = edges.map(([l, r]) => {
      let role: BarRole = 'default';
      if (matchL[l] === r) role = 'final';
      if (curTry && curTry.l === l && curTry.r === r) role = 'compare';
      return { from: `L${l}`, to: `R${r}`, role };
    });
    const matched = matchL.filter((r) => r !== -1).length;
    const aux = [
      { label: '当前匹配数', value: String(matched), role: 'final' as BarRole },
      {
        label: '状态',
        value: justMatched >= 0 ? `刚匹配 L${matchR[justMatched]}→R${justMatched}` : '尝试增广中',
        role: (justMatched >= 0 ? 'final' : 'pivot') as BarRole,
      },
    ];
    rec.begin(note).setGraph(nodes, e2).setAux(aux).commit();
    justMatched = -1;
  };

  render({ zh: '初始二分图', en: 'Initial bipartite graph' });

  const hooks: HungarianHooks = {
    onTryLeft: (l) => {
      curTry = { l, r: -1 };
    },
    onVisit: (_l, r) => {
      if (curTry) curTry = { l: curTry.l, r };
    },
    onAugment: (l, r) => {
      // 清除旧的左侧匹配
      const prevL = matchR[r]!;
      if (prevL !== -1) matchL[prevL] = -1;
      matchR[r] = l;
      matchL[l] = r;
      justMatched = r;
      curTry = { l, r };
    },
  };

  // 关键步骤帧（每访问一个右侧点都渲染）
  const wrappedHooks: HungarianHooks = {
    onTryLeft: (l) => {
      hooks.onTryLeft?.(l);
      render({ zh: `尝试为 L${l} 找增广路`, en: `Try augmenting for L${l}` });
    },
    onVisit: (l, r, matchedTo) => {
      hooks.onVisit?.(l, r, matchedTo);
      render({
        zh: `L${l} → R${r}（${matchedTo === -1 ? '未匹配' : `已被 L${matchedTo} 占用`}）`,
        en: `L${l} -> R${r} (${matchedTo === -1 ? 'free' : `owned by L${matchedTo}`})`,
      });
    },
    onAugment: (l, r) => {
      hooks.onAugment?.(l, r);
      render({ zh: `增广：L${l} 与 R${r} 匹配`, en: `Augment: match L${l} with R${r}` });
    },
    onDone: hooks.onDone,
  };

  const result = hungarian(nLeft, nRight, edges, wrappedHooks);
  curTry = null;

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
        role: (matchL[l] === r ? 'final' : 'default') as BarRole,
      })),
    )
    .setAux([{ label: '最大匹配', value: String(result), role: 'final' as BarRole }])
    .commit();

  return rec.build();
}

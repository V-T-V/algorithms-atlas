// =============================================================================
// 斯坦纳树 · 录制帧序列
import type { BarRole, Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { steinerTree, type GraphInput, type SteinerHooks } from './impl.ts';

/** 示例：4 顶点正方形，权 1，终点 A、C（对角）；最优 Steiner 树 = A-B-C 或 A-D-C 代价 2。
 *  这里设 A、C 为终点，B、D 为可选 Steiner 点。 */
export const DEFAULT_INPUT: { input: GraphInput; terminals: string[] } = {
  input: {
    nodes: ['A', 'B', 'C', 'D'],
    edges: [
      { from: 'A', to: 'B', weight: 1 },
      { from: 'B', to: 'C', weight: 1 },
      { from: 'C', to: 'D', weight: 1 },
      { from: 'D', to: 'A', weight: 1 },
      { from: 'A', to: 'C', weight: 3 },
    ],
  },
  terminals: ['A', 'C'],
};

const POS: Record<string, { x: number; y: number }> = {
  A: { x: 0.2, y: 0.25 },
  B: { x: 0.8, y: 0.25 },
  C: { x: 0.8, y: 0.8 },
  D: { x: 0.2, y: 0.8 },
};

export function buildTrace(
  input: { input: GraphInput; terminals: string[] } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const { input: graph, terminals } = input;
  const nodeIds = graph.nodes;

  const inTree = new Set<string>();
  const treeEdgeSet = new Set<string>();
  let curMask = 0;
  let curV: string | null = null;
  let finalCost = Infinity;
  let done = false;

  const mkNodes = (): GraphNode[] =>
    nodeIds.map((id) => {
      let role: BarRole = 'default';
      if (terminals.includes(id)) role = 'pivot';
      if (inTree.has(id)) role = 'final';
      if (id === curV) role = 'compare';
      return {
        id,
        label: terminals.includes(id) ? `${id}\n(终)` : id,
        x: POS[id]?.x ?? 0.5,
        y: POS[id]?.y ?? 0.5,
        role,
      };
    });
  const mkEdges = (): GraphEdge[] =>
    graph.edges.map((e) => ({
      from: e.from,
      to: e.to,
      weight: e.weight,
      role: (done && (treeEdgeSet.has(`${e.from},${e.to}`) || treeEdgeSet.has(`${e.to},${e.from}`))
        ? 'final'
        : 'default') as BarRole,
    }));

  const snap = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setGraph(mkNodes(), mkEdges())
      .setAux([
        { label: '终点', value: terminals.join(','), role: 'pivot' },
        { label: '当前 mask', value: `0b${curMask.toString(2)}`, role: 'compare' },
        { label: '当前根', value: curV ?? '∅' },
        { label: '最优代价', value: done ? String(finalCost) : '（计算中）', role: 'final' },
      ])
      .commit();
  };

  snap({
    zh: `初始图，终点 {${terminals.join(',')}}`,
    en: `Initial; terminals {${terminals.join(',')}}`,
  });

  const hooks: SteinerHooks = {
    onInit: (t) => {
      snap({ zh: `终点集 = {${t.join(',')}}`, en: `Terminals = {${t.join(',')}}` });
    },
    onCombine: (v, mask, cost) => {
      curV = v;
      curMask = mask;
      snap({
        zh: `合并：dp[${mask.toString(2)}][${v}] = ${cost}`,
        en: `Combine dp[${mask.toString(2)}][${v}] = ${cost}`,
      });
    },
    onRelax: (v, mask, cost) => {
      curV = v;
      curMask = mask;
      snap({
        zh: `松弛：dp[${mask.toString(2)}][${v}] = ${cost}`,
        en: `Relax dp[${mask.toString(2)}][${v}] = ${cost}`,
      });
    },
    onResult: (edges, cost) => {
      done = true;
      finalCost = cost;
      curV = null;
      treeEdgeSet.clear();
      inTree.clear();
      for (const e of edges) {
        treeEdgeSet.add(`${e.from},${e.to}`);
        inTree.add(e.from);
        inTree.add(e.to);
      }
      snap({
        zh: `Steiner 树代价 ${cost}，${edges.length} 条边`,
        en: `Steiner tree cost ${cost}, ${edges.length} edges`,
      });
    },
  };

  steinerTree(graph, terminals, hooks);

  rec
    .begin({ zh: `完成：代价 ${finalCost}`, en: `Done: cost ${finalCost}` })
    .setGraph(mkNodes(), mkEdges())
    .setAux([{ label: '代价', value: String(finalCost), role: 'final' }])
    .commit();

  return rec.build();
}

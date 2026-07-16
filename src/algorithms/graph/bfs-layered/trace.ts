// =============================================================================
// 分层 BFS · 录制帧序列
import type { BarRole, Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { bfsLayered, type GraphInput, type BfsLayeredHooks } from './impl.ts';

/** 示例：A 为根的二叉树状图。 */
export const DEFAULT_INPUT: { input: GraphInput; source: string } = {
  input: {
    nodes: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
    edges: [
      { from: 'A', to: 'B' },
      { from: 'A', to: 'C' },
      { from: 'B', to: 'D' },
      { from: 'B', to: 'E' },
      { from: 'C', to: 'F' },
      { from: 'C', to: 'G' },
    ],
  },
  source: 'A',
};

const POS: Record<string, { x: number; y: number }> = {
  A: { x: 0.5, y: 0.15 },
  B: { x: 0.25, y: 0.45 },
  C: { x: 0.75, y: 0.45 },
  D: { x: 0.1, y: 0.85 },
  E: { x: 0.35, y: 0.85 },
  F: { x: 0.65, y: 0.85 },
  G: { x: 0.9, y: 0.85 },
};

export function buildTrace(input: { input: GraphInput; source: string } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { input: graph, source } = input;
  const nodeIds = graph.nodes;

  const dist = new Map<string, number>();
  const visited = new Set<string>();
  let curLayer = -1;
  let cur: string | null = null;

  const mkNodes = (): GraphNode[] =>
    nodeIds.map((id) => {
      let role: BarRole = 'default';
      if (visited.has(id)) role = 'final';
      if (dist.get(id) === curLayer) role = 'frontier';
      if (id === cur) role = 'compare';
      return {
        id,
        label: `${id}${dist.has(id) ? `\nL${dist.get(id)}` : ''}`,
        x: POS[id]?.x ?? 0.5,
        y: POS[id]?.y ?? 0.5,
        role,
      };
    });
  const mkEdges = (): GraphEdge[] =>
    graph.edges.map((e) => ({ from: e.from, to: e.to, role: 'default' as BarRole }));

  const snap = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setGraph(mkNodes(), mkEdges())
      .setAux([
        { label: '当前层', value: curLayer >= 0 ? `L${curLayer}` : '∅', role: 'frontier' },
        { label: '已访问', value: `${visited.size}/${nodeIds.length}` },
        { label: '最大距离', value: String(curLayer >= 0 ? curLayer : 0), role: 'final' },
      ])
      .commit();
  };

  snap({ zh: `从 ${source} 开始分层 BFS`, en: `Layered BFS from ${source}` });

  const hooks: BfsLayeredHooks = {
    onVisit: (v, layer) => {
      dist.set(v, layer);
      visited.add(v);
      cur = v;
      curLayer = layer;
      snap({ zh: `访问 ${v}（第 ${layer} 层）`, en: `Visit ${v} (layer ${layer})` });
    },
    onLayer: (layer, members) => {
      curLayer = layer;
      snap({
        zh: `第 ${layer} 层：{ ${members.join(', ')} }`,
        en: `Layer ${layer}: { ${members.join(', ')} }`,
      });
    },
    onResult: (layers, d) => {
      cur = null;
      dist.clear();
      for (const [k, v] of d) dist.set(k, v);
      snap({ zh: `完成：共 ${layers.length} 层`, en: `Done: ${layers.length} layers` });
    },
  };

  bfsLayered(graph, source, hooks);

  rec
    .begin({ zh: `完成：${dist.size} 个可达点`, en: `Done: ${dist.size} reachable` })
    .setGraph(mkNodes(), mkEdges())
    .setAux([{ label: '可达点', value: String(dist.size), role: 'final' }])
    .commit();

  return rec.build();
}

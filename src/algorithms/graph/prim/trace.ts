// =============================================================================
// Prim 最小生成树 · 录制帧序列
// 通过 prim 的钩子，把执行过程录成 Frame[]。
// =============================================================================

import type { BarRole, Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { prim, type GraphInput, type PrimHooks } from './impl.ts';

/** 演示用加权无向图：与 kruskal 同图，便于对比两种 MST 算法。 */
export const DEFAULT_INPUT: GraphInput = {
  nodes: ['A', 'B', 'C', 'D', 'E', 'F'],
  edges: [
    { from: 'A', to: 'B', weight: 4 },
    { from: 'A', to: 'C', weight: 4 },
    { from: 'B', to: 'C', weight: 2 },
    { from: 'B', to: 'D', weight: 6 },
    { from: 'C', to: 'D', weight: 5 },
    { from: 'C', to: 'E', weight: 9 },
    { from: 'D', to: 'E', weight: 7 },
    { from: 'D', to: 'F', weight: 8 },
    { from: 'E', to: 'F', weight: 1 },
  ],
};

export const DEFAULT_START = 'A';

/** 归一化坐标：环形布局。 */
const POS: Record<string, { x: number; y: number }> = (() => {
  const ring = ['A', 'B', 'C', 'D', 'E', 'F'];
  const cx = 0.5;
  const cy = 0.5;
  const r = 0.34;
  const pos: Record<string, { x: number; y: number }> = {};
  ring.forEach((id, i) => {
    const ang = -Math.PI / 2 + (i * 2 * Math.PI) / ring.length;
    pos[id] = { x: cx + r * Math.cos(ang), y: cy + r * Math.sin(ang) };
  });
  return pos;
})();

const fmt = (d: number): string => (Number.isFinite(d) ? String(d) : '∞');

/** 录制演示帧序列。 */
export function buildTrace(input: GraphInput = DEFAULT_INPUT, start = DEFAULT_START): Frame[] {
  const rec = new TraceRecorder();
  const nodeIds = input.nodes;

  const inTree = new Set<string>();
  const mstEdges = new Set<string>(); // "from>to"
  const key = new Map<string, number>(nodeIds.map((n) => [n, Infinity]));
  let adding: string | null = null;
  let examEdge: { from: string; to: string } | null = null;
  let totalWeight = 0;

  const render = (note: { zh: string; en: string }): void => {
    const nodes: GraphNode[] = nodeIds.map((id) => {
      let role: BarRole = 'default';
      if (inTree.has(id)) role = 'final';
      else if (Number.isFinite(key.get(id) ?? Infinity)) role = 'frontier';
      if (id === adding) role = 'pivot';
      return {
        id,
        label: inTree.has(id) ? id : `${id}\nkey=${fmt(key.get(id) ?? Infinity)}`,
        x: POS[id]?.x ?? 0.5,
        y: POS[id]?.y ?? 0.5,
        role,
      };
    });
    const edges: GraphEdge[] = input.edges.map((e) => {
      let role: BarRole = 'default';
      if (mstEdges.has(`${e.from}>${e.to}`) || mstEdges.has(`${e.to}>${e.from}`)) role = 'final';
      if (
        examEdge &&
        ((examEdge.from === e.from && examEdge.to === e.to) ||
          (examEdge.from === e.to && examEdge.to === e.from))
      ) {
        role = 'compare';
      }
      return { from: e.from, to: e.to, weight: e.weight, role };
    });
    rec
      .begin(note)
      .setGraph(nodes, edges)
      .setAux([
        { label: 'MST 权重 / weight', value: String(totalWeight), role: 'final' },
        { label: '已选 / picked', value: String(inTree.size), role: 'frontier' },
      ])
      .commit();
  };

  key.set(start, 0);
  render({
    zh: `从 ${start} 起步，其 key=0，其余为 ∞`,
    en: `Start from ${start} (key=0), others ∞`,
  });

  const hooks: PrimHooks = {
    onAddNode: (node, parent, w) => {
      adding = node;
      inTree.add(node);
      if (parent !== node) {
        mstEdges.add(`${parent}>${node}`);
        totalWeight += w;
      }
      render({
        zh:
          parent === node
            ? `纳入起点 ${node}`
            : `纳入 ${node}（连 ${parent}，w=${w}），累计 ${totalWeight}`,
        en:
          parent === node
            ? `Add start ${node}`
            : `Add ${node} (via ${parent}, w=${w}), total ${totalWeight}`,
      });
      adding = null;
    },
    onUpdateKey: (node, candidateParent, newKey, improved) => {
      examEdge = { from: candidateParent, to: node };
      if (improved) key.set(node, newKey);
      render({
        zh: `考察 ${candidateParent}—${node} (w=${newKey})：${improved ? `key 更新为 ${newKey}` : '不更优'}`,
        en: `Cut ${candidateParent}—${node} (w=${newKey}): ${improved ? `key → ${newKey}` : 'no update'}`,
      });
      examEdge = null;
    },
    onDone: (tw, n) => {
      totalWeight = tw;
      render({
        zh: `完成：MST 共 ${n} 条边，总权重 ${tw}`,
        en: `Done: MST has ${n} edges, total weight ${tw}`,
      });
    },
  };

  prim(input, start, hooks);

  // 终态
  rec
    .begin({
      zh: `最小生成树完成，总权重 ${totalWeight}`,
      en: `MST complete, total weight ${totalWeight}`,
    })
    .setGraph(
      nodeIds.map((id) => ({
        id,
        label: id,
        x: POS[id]?.x ?? 0.5,
        y: POS[id]?.y ?? 0.5,
        role: 'final' as BarRole,
      })),
      input.edges.map((e) => ({
        from: e.from,
        to: e.to,
        weight: e.weight,
        role: (mstEdges.has(`${e.from}>${e.to}`) || mstEdges.has(`${e.to}>${e.from}`)
          ? 'final'
          : 'default') as BarRole,
      })),
    )
    .commit();

  return rec.build();
}

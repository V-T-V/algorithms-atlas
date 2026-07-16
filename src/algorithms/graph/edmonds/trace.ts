// =============================================================================
// 有向最小生成树（Edmonds）· 录制帧序列
// 可视化：setGraph（有向带权图），role:当前选中入边='compare'，环边='pivot'，
// 已收缩='warn'，最终选中='final'。setAux 展示阶段与累计权。
// =============================================================================

import type { BarRole, Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { edmonds, type DirectedGraphInput, type EdmondsHooks } from './impl.ts';

/** 演示有向图（含一个环 A→B→C→A，根 R）：
 *   R→A(1), R→B(5)
 *   A→B(1), B→C(1), C→A(1)   ← 环
 *   R→C(6)
 *   最优：R→A(1) + A→B(1) + B→C(1) = 3（破开环选最便宜入边） */
export const DEFAULT_INPUT: DirectedGraphInput = {
  nodes: ['R', 'A', 'B', 'C'],
  edges: [
    { from: 'R', to: 'A', weight: 1 },
    { from: 'R', to: 'B', weight: 5 },
    { from: 'R', to: 'C', weight: 6 },
    { from: 'A', to: 'B', weight: 1 },
    { from: 'B', to: 'C', weight: 1 },
    { from: 'C', to: 'A', weight: 1 },
  ],
  root: 'R',
};

const POS: Record<string, { x: number; y: number }> = {
  R: { x: 0.1, y: 0.5 },
  A: { x: 0.4, y: 0.2 },
  B: { x: 0.7, y: 0.5 },
  C: { x: 0.4, y: 0.8 },
};

/** 录制演示帧序列。 */
export function buildTrace(input: DirectedGraphInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const nodeIds = input.nodes;

  const selEdges = new Set<string>();
  const cycleEdges = new Set<string>();
  const finalEdges = new Set<string>();
  let phase = 'init';
  let totalWeight = 0;

  const render = (note: { zh: string; en: string }): void => {
    const nodes: GraphNode[] = nodeIds.map((id) => {
      let role: BarRole = 'default';
      if (id === input.root) role = 'frontier';
      return { id, label: id, x: POS[id]?.x ?? 0.5, y: POS[id]?.y ?? 0.5, role };
    });
    const edges: GraphEdge[] = input.edges.map((e) => {
      const k = `${e.from}>${e.to}`;
      let role: BarRole = 'default';
      if (finalEdges.has(k)) role = 'final';
      if (cycleEdges.has(k)) role = 'pivot';
      if (selEdges.has(k)) role = 'compare';
      return { from: e.from, to: e.to, directed: true, weight: e.weight, role };
    });
    rec
      .begin(note)
      .setGraph(nodes, edges)
      .setAux([
        { label: '阶段 / phase', value: phase, role: 'frontier' },
        { label: '累计权 / weight', value: String(totalWeight), role: 'final' },
      ])
      .commit();
  };

  render({ zh: `初始有向图（根 ${input.root}）`, en: `Initial digraph (root ${input.root})` });

  const hooks: EdmondsHooks = {
    onSelectMinIn: (node, e) => {
      selEdges.clear();
      selEdges.add(`${e.from}>${e.to}`);
      phase = `选 ${node} 最小入边`;
      render({
        zh: `${node} 选最小入边：${e.from}→${e.to} (w=${e.weight})`,
        en: `${node} min in-edge: ${e.from}->${e.to} (w=${e.weight})`,
      });
    },
    onCycle: (cycle) => {
      cycleEdges.clear();
      for (let i = 0; i < cycle.length; i++) {
        const a = cycle[i]!;
        const b = cycle[(i + 1) % cycle.length]!;
        cycleEdges.add(`${a}>${b}`);
      }
      phase = '检测到环';
      render({ zh: `检测到环：${cycle.join('→')}`, en: `Cycle detected: ${cycle.join('->')}` });
    },
    onContract: (cycle, superNode) => {
      phase = `收缩为 ${superNode}`;
      render({
        zh: `收缩环 [${cycle.join(',')}] 为 ${superNode}`,
        en: `Contract [${cycle.join(',')}] into ${superNode}`,
      });
      cycleEdges.clear();
    },
    onDone: (tw, edges) => {
      totalWeight = tw;
      finalEdges.clear();
      for (const e of edges) finalEdges.add(`${e.from}>${e.to}`);
      phase = '完成';
      render({ zh: `完成，最小权 = ${tw}`, en: `Done, min weight = ${tw}` });
    },
  };

  const result = edmonds(input, hooks);
  void result;

  return rec.build();
}

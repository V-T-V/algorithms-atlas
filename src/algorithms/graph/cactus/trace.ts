// =============================================================================
// 仙人掌 DP · 录制帧序列
// 可视化：setGraph，role:当前='compare'，环边='final'，已访问='frontier'；
// setAux 展示当前直径。
// =============================================================================

import type { BarRole, Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { cactus, type CactusHooks, type GraphInput } from './impl.ts';

/** 演示仙人掌：根 0 连到一个三元环 {1,2,3}（边权 1），3→4 桥（权 2），4 子树链。
 *  环：1-2-3-1（各边权 1）。直径路径取 0→1→(环)→3→4 之类。 */
export const DEFAULT_INPUT: GraphInput = {
  nodes: ['0', '1', '2', '3', '4'],
  edges: [
    { from: '0', to: '1', weight: 1 },
    { from: '1', to: '2', weight: 1 },
    { from: '2', to: '3', weight: 1 },
    { from: '3', to: '1', weight: 1 },
    { from: '3', to: '4', weight: 2 },
  ],
};

const POS: Record<string, { x: number; y: number }> = {
  '0': { x: 0.08, y: 0.5 },
  '1': { x: 0.35, y: 0.5 },
  '2': { x: 0.55, y: 0.25 },
  '3': { x: 0.55, y: 0.75 },
  '4': { x: 0.9, y: 0.75 },
};

/** 录制演示帧序列。 */
export function buildTrace(input: GraphInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const nodeIds = input.nodes;

  const visited = new Set<string>();
  const cycleEdges = new Set<string>(); // "a|b"
  let cur: string | null = null;
  let examEdge: { from: string; to: string } | null = null;
  let diameter = 0;

  const ek = (a: string, b: string): string => (a < b ? `${a}|${b}` : `${b}|${a}`);

  const render = (note: { zh: string; en: string }): void => {
    const nodes: GraphNode[] = nodeIds.map((id) => {
      let role: BarRole = 'default';
      if (visited.has(id)) role = 'frontier';
      if (id === cur) role = 'compare';
      return { id, label: id, x: POS[id]?.x ?? 0.5, y: POS[id]?.y ?? 0.5, role };
    });
    const edges: GraphEdge[] = input.edges.map((e) => {
      let role: BarRole = 'default';
      if (cycleEdges.has(ek(e.from, e.to))) role = 'final';
      if (examEdge && examEdge.from === e.from && examEdge.to === e.to) role = 'compare';
      return { from: e.from, to: e.to, weight: e.weight, role };
    });
    rec
      .begin(note)
      .setGraph(nodes, edges)
      .setAux([{ label: '当前直径', value: String(diameter), role: 'final' }])
      .commit();
  };

  render({ zh: '初始仙人掌图', en: 'Initial cactus' });

  const hooks: CactusHooks = {
    onDiscover: (v) => {
      visited.add(v);
      cur = v;
      render({ zh: `访问 ${v}`, en: `Visit ${v}` });
    },
    onTreeEdge: (u, v) => {
      examEdge = { from: u, to: v };
      cur = u;
      render({ zh: `树边 ${u}→${v}`, en: `Tree edge ${u}→${v}` });
      examEdge = null;
    },
    onBackEdge: (v, u) => {
      examEdge = { from: v, to: u };
      render({ zh: `回边 ${v}→${u}（发现环）`, en: `Back edge ${v}→${u} (cycle)` });
      examEdge = null;
    },
    onCycle: (root, len) => {
      cur = root;
      render({ zh: `处理环：顶=${root}，周长=${len}`, en: `Cycle: top=${root}, len=${len}` });
    },
    onUpdateDiameter: (d) => {
      diameter = d;
      render({ zh: `更新直径 = ${d}`, en: `Diameter updated = ${d}` });
    },
  };

  const result = cactus(input, hooks);

  cur = null;
  rec
    .begin({ zh: `完成：直径 = ${result.diameter}`, en: `Done: diameter = ${result.diameter}` })
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
        role: (cycleEdges.has(ek(e.from, e.to)) ? 'final' : 'default') as BarRole,
      })),
    )
    .setAux([{ label: '直径 / diameter', value: String(result.diameter), role: 'final' }])
    .commit();

  return rec.build();
}

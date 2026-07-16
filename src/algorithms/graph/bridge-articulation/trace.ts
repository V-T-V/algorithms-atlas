// =============================================================================
// 桥与割点 · 录制帧序列
// 可视化：setGraph（节点+边），role: 桥='final'，割点='pivot'，当前考察='compare'，栈中已访问='frontier'；
// setAux 展示 dfn / low。
// =============================================================================

import type { BarRole, Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import {
  bridgeArticulation,
  edgeKey,
  type BridgeArticulationHooks,
  type GraphInput,
} from './impl.ts';

/** 演示用无向图：两个三角环由桥 (2-3) 相连，故仅 1 条桥与 2 个割点 (2, 3)。
 *  环 A：0-1-2-0；桥：2-3；环 B：3-4-5-3。 */
export const DEFAULT_INPUT: GraphInput = {
  nodes: ['0', '1', '2', '3', '4', '5'],
  edges: [
    { from: '0', to: '1' },
    { from: '1', to: '2' },
    { from: '2', to: '0' },
    { from: '2', to: '3' }, // 桥
    { from: '3', to: '4' },
    { from: '4', to: '5' },
    { from: '5', to: '3' },
  ],
};

/** 归一化坐标：左三角 + 桥 + 右星形。 */
const POS: Record<string, { x: number; y: number }> = {
  '0': { x: 0.15, y: 0.3 },
  '1': { x: 0.15, y: 0.7 },
  '2': { x: 0.38, y: 0.5 },
  '3': { x: 0.62, y: 0.5 },
  '4': { x: 0.85, y: 0.3 },
  '5': { x: 0.85, y: 0.7 },
};

/** 录制演示帧序列。 */
export function buildTrace(input: GraphInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const nodeIds = input.nodes;

  const dfn = new Map<string, number>();
  const low = new Map<string, number>();
  const visited = new Set<string>();
  const bridges = new Set<string>();
  const articulation = new Set<string>();
  let cur: string | null = null;
  let examEdge: { from: string; to: string } | null = null;

  const fmt = (m: Map<string, number>, id: string): string => {
    const v = m.get(id);
    return v === undefined ? '·' : String(v);
  };

  const render = (note: { zh: string; en: string }): void => {
    const nodes: GraphNode[] = nodeIds.map((id) => {
      let role: BarRole = 'default';
      if (articulation.has(id)) role = 'pivot';
      if (visited.has(id) && !articulation.has(id)) role = 'frontier';
      if (id === cur) role = 'compare';
      return {
        id,
        label: `${id}\ndfn=${fmt(dfn, id)}\nlow=${fmt(low, id)}`,
        x: POS[id]?.x ?? 0.5,
        y: POS[id]?.y ?? 0.5,
        role,
      };
    });
    const edges: GraphEdge[] = input.edges.map((e) => {
      let role: BarRole = 'default';
      if (bridges.has(edgeKey(e.from, e.to))) role = 'final';
      if (examEdge && examEdge.from === e.from && examEdge.to === e.to) role = 'compare';
      return { from: e.from, to: e.to, role };
    });
    rec
      .begin(note)
      .setGraph(nodes, edges)
      .setAux([
        { label: 'dfn', value: nodeIds.map((n) => `${n}:${fmt(dfn, n)}`).join('  ') },
        { label: 'low', value: nodeIds.map((n) => `${n}:${fmt(low, n)}`).join('  ') },
        {
          label: '桥 / bridges',
          value: bridges.size ? [...bridges].join(', ') : '∅',
          role: 'final',
        },
        {
          label: '割点 / articulation',
          value: articulation.size ? [...articulation].join(', ') : '∅',
          role: 'pivot',
        },
      ])
      .commit();
  };

  render({ zh: '初始无向图', en: 'Initial undirected graph' });

  const hooks: BridgeArticulationHooks = {
    onDiscover: (v, d) => {
      dfn.set(v, d);
      low.set(v, d);
      visited.add(v);
      cur = v;
      render({ zh: `访问 ${v}：dfn=low=${d}`, en: `Visit ${v}: dfn=low=${d}` });
    },
    onExamine: (u, v, kind) => {
      examEdge = { from: u, to: v };
      cur = u;
      const map = { tree: '树边', back: '回边', parent: '父边（跳过）' };
      const mapEn = { tree: 'tree edge', back: 'back edge', parent: 'parent edge (skip)' };
      render({
        zh: `考察 ${u}→${v}（${map[kind]}）`,
        en: `Examine ${u}→${v} (${mapEn[kind]})`,
      });
      examEdge = null;
    },
    onUpdateLow: (u, newLow) => {
      const old = low.get(u) ?? Infinity;
      low.set(u, newLow);
      cur = u;
      render({
        zh: `更新 low[${u}] = ${newLow}（原 ${old}）`,
        en: `Update low[${u}] = ${newLow} (was ${old})`,
      });
    },
    onBridge: (u, v) => {
      bridges.add(edgeKey(u, v));
      cur = u;
      render({
        zh: `${u}—${v} 是桥（删除后图不连通）`,
        en: `${u}—${v} is a bridge (removal disconnects)`,
      });
    },
    onArticulation: (u, reason) => {
      articulation.add(u);
      cur = u;
      const r = reason === 'root-multi-children' ? '根有 ≥2 个子树' : '存在子 v 使 low[v]≥dfn[u]';
      const re =
        reason === 'root-multi-children'
          ? 'root has >=2 subtrees'
          : 'exists child v with low[v]>=dfn[u]';
      render({
        zh: `${u} 是割点（${r}）`,
        en: `${u} is an articulation point (${re})`,
      });
    },
  };

  bridgeArticulation(input, hooks);

  // 终态
  cur = null;
  rec
    .begin({
      zh: `完成：桥 ${bridges.size} 条，割点 ${articulation.size} 个`,
      en: `Done: ${bridges.size} bridge(s), ${articulation.size} articulation point(s)`,
    })
    .setGraph(
      nodeIds.map((id) => ({
        id,
        label: id,
        x: POS[id]?.x ?? 0.5,
        y: POS[id]?.y ?? 0.5,
        role: (articulation.has(id) ? 'pivot' : 'final') as BarRole,
      })),
      input.edges.map((e) => ({
        from: e.from,
        to: e.to,
        role: (bridges.has(edgeKey(e.from, e.to)) ? 'final' : 'default') as BarRole,
      })),
    )
    .setAux([
      { label: '桥 / bridges', value: [...bridges].join(', ') || '∅', role: 'final' },
      { label: '割点 / articulation', value: [...articulation].join(', ') || '∅', role: 'pivot' },
    ])
    .commit();

  return rec.build();
}

// =============================================================================
// SPFA 最短路 · 录制帧序列
// 可视化：setGraph（节点+边），role: 队列中='frontier'，松弛中='compare'，已确定='final'；
// setAux 展示距离表与队列。
// =============================================================================

import type { BarRole, Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { spfa, type GraphInput, type SpfaHooks } from './impl.ts';

/** 演示用有向图（含一条负权边）：S 为源。 */
export const DEFAULT_INPUT: GraphInput = {
  nodes: ['S', 'A', 'B', 'C', 'D', 'T'],
  directed: true,
  edges: [
    { from: 'S', to: 'A', weight: 4 },
    { from: 'S', to: 'B', weight: 2 },
    { from: 'A', to: 'C', weight: 5 },
    { from: 'B', to: 'A', weight: -1 }, // 负权边
    { from: 'B', to: 'C', weight: 8 },
    { from: 'B', to: 'D', weight: 10 },
    { from: 'C', to: 'D', weight: 2 },
    { from: 'C', to: 'T', weight: 6 },
    { from: 'D', to: 'T', weight: 3 },
  ],
};

export const DEFAULT_SOURCE = 'S';

/** 归一化坐标。 */
const POS: Record<string, { x: number; y: number }> = {
  S: { x: 0.1, y: 0.5 },
  A: { x: 0.32, y: 0.2 },
  B: { x: 0.32, y: 0.8 },
  C: { x: 0.56, y: 0.2 },
  D: { x: 0.56, y: 0.8 },
  T: { x: 0.85, y: 0.5 },
};

const fmt = (d: number): string => (Number.isFinite(d) ? String(d) : '∞');

/** 录制演示帧序列。 */
export function buildTrace(input: GraphInput = DEFAULT_INPUT, source = DEFAULT_SOURCE): Frame[] {
  const rec = new TraceRecorder();
  const nodeIds = input.nodes;

  const dist = new Map<string, number>(nodeIds.map((n) => [n, Infinity]));
  const inQueue = new Set<string>();
  const settled = new Set<string>();
  const treeEdges = new Set<string>();
  const queue: string[] = [];
  let dequeuing: string | null = null;
  let examEdge: { from: string; to: string } | null = null;

  const render = (note: { zh: string; en: string }): void => {
    const nodes: GraphNode[] = nodeIds.map((id) => {
      let role: BarRole = 'default';
      if (settled.has(id)) role = 'final';
      if (inQueue.has(id)) role = 'frontier';
      if (id === dequeuing) role = 'compare';
      return {
        id,
        label: `${id}=${fmt(dist.get(id) ?? Infinity)}`,
        x: POS[id]?.x ?? 0.5,
        y: POS[id]?.y ?? 0.5,
        role,
      };
    });
    const edges: GraphEdge[] = input.edges.map((e) => {
      let role: BarRole = 'default';
      if (treeEdges.has(`${e.from}>${e.to}`)) role = 'final';
      if (examEdge && examEdge.from === e.from && examEdge.to === e.to) role = 'compare';
      return { from: e.from, to: e.to, weight: e.weight, directed: input.directed, role };
    });
    rec
      .begin(note)
      .setGraph(nodes, edges)
      .setAux([
        {
          label: '距离 / dist',
          value: nodeIds.map((n) => `${n}:${fmt(dist.get(n) ?? Infinity)}`).join('  '),
        },
        { label: '队列 / queue', value: queue.length ? queue.join(' → ') : '∅', role: 'frontier' },
      ])
      .commit();
  };

  dist.set(source, 0);
  render({ zh: `初始化：源 ${source}=0，其余 ∞`, en: `Init: ${source}=0, others ∞` });

  const hooks: SpfaHooks = {
    onInit: () => {},
    onEnqueue: (node) => {
      inQueue.add(node);
      if (!queue.includes(node)) queue.push(node);
      render({ zh: `${node} 入队`, en: `Enqueue ${node}` });
    },
    onDequeue: (node) => {
      dequeuing = node;
      const idx = queue.indexOf(node);
      if (idx >= 0) queue.splice(idx, 1);
      inQueue.delete(node);
      settled.add(node);
      render({ zh: `${node} 出队，松弛其出边`, en: `Dequeue ${node}, relax its out-edges` });
    },
    onRelax: (from, to, newDist, improved) => {
      examEdge = { from, to };
      if (improved) {
        dist.set(to, newDist);
        treeEdges.add(`${from}>${to}`);
        for (const k of [...treeEdges]) {
          if (k !== `${from}>${to}` && k.endsWith(`>${to}`)) treeEdges.delete(k);
        }
      }
      render({
        zh: `松弛 ${from}→${to}：候选 ${fmt(newDist)}${improved ? ' ✅ 更新' : '（不更优）'}`,
        en: `Relax ${from}→${to}: ${fmt(newDist)}${improved ? ' ✅ improved' : ' (no update)'}`,
      });
      examEdge = null;
    },
    onNegativeCycle: (node) => {
      render({
        zh: `检测到负环（${node} 入队过多次）`,
        en: `Negative cycle detected (${node} enqueued too often)`,
      });
    },
    onDone: () => {},
  };

  const result = spfa(input, source, hooks);

  // 终态
  dequeuing = null;
  rec
    .begin({
      zh: `完成${result.hasNegativeCycle ? '（存在负环）' : ''}`,
      en: `Done${result.hasNegativeCycle ? ' (negative cycle)' : ''}`,
    })
    .setGraph(
      nodeIds.map((id) => ({
        id,
        label: `${id}=${fmt(result.dist.get(id) ?? Infinity)}`,
        x: POS[id]?.x ?? 0.5,
        y: POS[id]?.y ?? 0.5,
        role: 'final' as BarRole,
      })),
      input.edges.map((e) => ({
        from: e.from,
        to: e.to,
        weight: e.weight,
        directed: input.directed,
        role: (treeEdges.has(`${e.from}>${e.to}`) ? 'final' : 'default') as BarRole,
      })),
    )
    .setAux([
      {
        label: '距离 / dist',
        value: nodeIds.map((n) => `${n}:${fmt(result.dist.get(n) ?? Infinity)}`).join('  '),
        role: 'final',
      },
      { label: '负环 / neg cycle', value: result.hasNegativeCycle ? '是 / yes' : '否 / no' },
    ])
    .commit();

  return rec.build();
}

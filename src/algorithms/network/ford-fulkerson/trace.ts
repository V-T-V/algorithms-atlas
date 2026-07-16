// =============================================================================
// 最大流 Ford-Fulkerson · 录制帧序列
// 通过 fordFulkerson 的钩子，把执行过程录成 Frame[]。
// =============================================================================

import type { BarRole, Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { fordFulkerson, type FlowNetworkInput, type FordFulkersonHooks } from './impl.ts';

/** 演示用流网络：S 源、T 汇，中间 A/B/C。 */
export const DEFAULT_INPUT: FlowNetworkInput = {
  nodes: ['S', 'A', 'B', 'C', 'T'],
  edges: [
    { from: 'S', to: 'A', capacity: 10 },
    { from: 'S', to: 'B', capacity: 10 },
    { from: 'A', to: 'B', capacity: 2 },
    { from: 'A', to: 'C', capacity: 4 },
    { from: 'A', to: 'T', capacity: 8 },
    { from: 'B', to: 'C', capacity: 9 },
    { from: 'C', to: 'T', capacity: 10 },
  ],
  source: 'S',
  sink: 'T',
};

/** 归一化坐标：S 居左，T 居右，A/B/C 居中。 */
const POS: Record<string, { x: number; y: number }> = {
  S: { x: 0.1, y: 0.5 },
  A: { x: 0.38, y: 0.22 },
  B: { x: 0.38, y: 0.78 },
  C: { x: 0.66, y: 0.5 },
  T: { x: 0.92, y: 0.5 },
};

/** 录制演示帧序列。 */
export function buildTrace(input: FlowNetworkInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const nodeIds = input.nodes;
  const cap = new Map<string, number>();
  for (const e of input.edges) cap.set(`${e.from}>${e.to}`, e.capacity);

  // flow[from>to]：当前流量（仅原图边）
  const flow = new Map<string, number>(input.edges.map((e) => [`${e.from}>${e.to}`, 0]));
  const pathEdges = new Set<string>(); // 当前增广路用到的原图/反向边
  let curPath: string[] = [];

  const render = (note: { zh: string; en: string }): void => {
    const nodes: GraphNode[] = nodeIds.map((id) => {
      const role: BarRole = id === input.source || id === input.sink ? 'pivot' : 'default';
      const inPath = curPath.includes(id);
      return {
        id,
        label: id,
        x: POS[id]?.x ?? 0.5,
        y: POS[id]?.y ?? 0.5,
        role: inPath ? 'compare' : role,
      };
    });
    const edges: GraphEdge[] = input.edges.map((e) => {
      const key = `${e.from}>${e.to}`;
      const f = flow.get(key) ?? 0;
      let role: BarRole = 'default';
      if (f > 0) role = 'frontier';
      if (pathEdges.has(key)) role = 'compare';
      return {
        from: e.from,
        to: e.to,
        weight: e.capacity,
        directed: true,
        role,
        // 用 label 体现「flow/capacity」（weight 字段保留容量，label 由播放器可选渲染）
      };
    });
    // 用 aux 展示每条边 flow/capacity，避免依赖未文档化的边 label
    const aux = input.edges.map((e) => {
      const key = `${e.from}>${e.to}`;
      const f = flow.get(key) ?? 0;
      return {
        label: `${e.from}→${e.to}`,
        value: `${f}/${e.capacity}`,
        role: (pathEdges.has(key) ? 'compare' : f > 0 ? 'frontier' : 'default') as BarRole,
      };
    });
    rec.begin(note).setGraph(nodes, edges).setAux(aux).commit();
  };

  render({
    zh: `初始网络：源 ${input.source}，汇 ${input.sink}`,
    en: `Initial network: source ${input.source}, sink ${input.sink}`,
  });

  const hooks: FordFulkersonHooks = {
    onAugment: (path, bottleneck, total) => {
      // 标记路径上的原图边
      pathEdges.clear();
      for (let i = 0; i + 1 < path.length; i++) pathEdges.add(`${path[i]!}>${path[i + 1]!}`);
      curPath = path;
      render({
        zh: `增广路 ${path.join('→')}，瓶颈 ${bottleneck}，累计流 ${total}`,
        en: `Augment ${path.join('→')}, bottleneck ${bottleneck}, total ${total}`,
      });
      // 提交后沿原图边累加瓶颈流量（本演示的增广路均为正向，可直接累加；
      // 若用到反向边则该 key 不在 flow 中、被跳过，最终帧用真实流量覆盖纠正）。
      for (let i = 0; i + 1 < path.length; i++) {
        const key = `${path[i]!}>${path[i + 1]!}`;
        if (flow.has(key)) flow.set(key, (flow.get(key) ?? 0) + bottleneck);
      }
      pathEdges.clear();
      curPath = [];
      render({ zh: `已推进流量，当前各边流量见右侧`, en: `Flow pushed; edge flows at right` });
    },
    onNoPath: (total) => {
      render({
        zh: `无更多增广路，最大流 = ${total}`,
        en: `No more augmenting path; max flow = ${total}`,
      });
    },
  };

  const result = fordFulkerson(input, hooks);

  // 终态：用算法返回的真实流量覆盖（保证正确）
  for (const fe of result.flows) flow.set(`${fe.from}>${fe.to}`, fe.flow);
  rec
    .begin({ zh: `完成，最大流 = ${result.maxFlow}`, en: `Done, max flow = ${result.maxFlow}` })
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
        weight: e.capacity,
        directed: true,
        role: ((flow.get(`${e.from}>${e.to}`) ?? 0) > 0 ? 'final' : 'default') as BarRole,
      })),
    )
    .setAux(
      input.edges.map((e) => ({
        label: `${e.from}→${e.to}`,
        value: `${flow.get(`${e.from}>${e.to}`) ?? 0}/${e.capacity}`,
        role: 'final' as BarRole,
      })),
    )
    .commit();

  return rec.build();
}

// =============================================================================
// 找桥·迭代 DFS · 录制帧序列
import type { BarRole, Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { bridgeFindingIter, type GraphInput, type BridgeHooks } from './impl.ts';

// 0-1-2 三角环 + 2-3 桥 + 3-4-5 三角环；桥为 2-3
export const DEFAULT_INPUT: GraphInput = {
  nodes: ['0', '1', '2', '3', '4', '5'],
  edges: [
    { from: '0', to: '1' },
    { from: '1', to: '2' },
    { from: '0', to: '2' },
    { from: '2', to: '3' },
    { from: '3', to: '4' },
    { from: '4', to: '5' },
    { from: '3', to: '5' },
  ],
};

const POS: Record<string, { x: number; y: number }> = {
  '0': { x: 0.15, y: 0.3 },
  '1': { x: 0.15, y: 0.7 },
  '2': { x: 0.4, y: 0.5 },
  '3': { x: 0.6, y: 0.5 },
  '4': { x: 0.85, y: 0.3 },
  '5': { x: 0.85, y: 0.7 },
};

export function buildTrace(input: GraphInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const nodeIds = input.nodes;

  const dfn = new Map<string, number>();
  const low = new Map<string, number>();
  const visited = new Set<string>();
  const bridgeSet = new Set<string>();
  let cur: string | null = null;
  let examEdge: { from: string; to: string } | null = null;

  const fmt = (m: Map<string, number>, id: string): string => {
    const v = m.get(id);
    return v === undefined ? '·' : String(v);
  };

  const edgeKey = (a: string, b: string): string => [a, b].sort().join('-');

  const render = (note: { zh: string; en: string }): void => {
    const nodes: GraphNode[] = nodeIds.map((id) => {
      let role: BarRole = 'default';
      if (visited.has(id)) role = 'frontier';
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
      const k = edgeKey(e.from, e.to);
      if (bridgeSet.has(k)) role = 'warn';
      if (examEdge && edgeKey(examEdge.from, examEdge.to) === k) role = 'compare';
      return { from: e.from, to: e.to, role };
    });
    rec
      .begin(note)
      .setGraph(nodes, edges)
      .setAux([
        { label: 'dfn', value: nodeIds.map((n) => `${n}:${fmt(dfn, n)}`).join('  ') },
        { label: 'low', value: nodeIds.map((n) => `${n}:${fmt(low, n)}`).join('  ') },
        {
          label: '桥',
          value: bridgeSet.size ? [...bridgeSet].join(', ') : '（暂无）',
          role: 'warn',
        },
      ])
      .commit();
  };

  render({ zh: '初始无向图（双三角+连接边）', en: 'Initial undirected graph (two triangles)' });

  const hooks: BridgeHooks = {
    onDiscover: (v, _pe, d) => {
      dfn.set(v, d);
      low.set(v, d);
      visited.add(v);
      cur = v;
      render({ zh: `访问 ${v}：dfn=low=${d}`, en: `Visit ${v}: dfn=low=${d}` });
    },
    onExamine: (u, v, kind) => {
      examEdge = { from: u, to: v };
      cur = u;
      const m = { tree: '树边', back: '回边' };
      const me = { tree: 'tree', back: 'back' };
      render({ zh: `考察 ${u}—${v}（${m[kind]}）`, en: `Examine ${u}—${v} (${me[kind]})` });
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
    onBridge: (from, to) => {
      bridgeSet.add(edgeKey(from, to));
      cur = null;
      render({ zh: `${from}—${to} 是桥`, en: `${from}—${to} is a bridge` });
    },
  };

  bridgeFindingIter(input, hooks);

  cur = null;
  rec
    .begin({ zh: `完成：${bridgeSet.size} 座桥`, en: `Done: ${bridgeSet.size} bridges` })
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
        role: (bridgeSet.has(edgeKey(e.from, e.to)) ? 'warn' : 'final') as BarRole,
      })),
    )
    .setAux([{ label: '桥', value: [...bridgeSet].join(', ') || '无', role: 'warn' }])
    .commit();

  return rec.build();
}

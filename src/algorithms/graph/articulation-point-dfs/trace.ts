// =============================================================================
// 割点·标准 DFS · 录制帧序列
import type { BarRole, Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { articulationPointDfs, type GraphInput, type ArticulationHooks } from './impl.ts';

// 经典例子：节点 2 是割点（删去则 0,1 与 3,4 断开）
export const DEFAULT_INPUT: GraphInput = {
  nodes: ['0', '1', '2', '3', '4'],
  edges: [
    { from: '0', to: '1' },
    { from: '1', to: '2' },
    { from: '2', to: '3' },
    { from: '3', to: '4' },
  ],
};

const POS: Record<string, { x: number; y: number }> = {
  '0': { x: 0.1, y: 0.5 },
  '1': { x: 0.3, y: 0.5 },
  '2': { x: 0.5, y: 0.5 },
  '3': { x: 0.7, y: 0.5 },
  '4': { x: 0.9, y: 0.5 },
};

export function buildTrace(input: GraphInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const nodeIds = input.nodes;

  const dfn = new Map<string, number>();
  const low = new Map<string, number>();
  const isArt = new Set<string>();
  const visited = new Set<string>();
  let cur: string | null = null;
  let examEdge: { from: string; to: string } | null = null;

  const fmt = (m: Map<string, number>, id: string): string => {
    const v = m.get(id);
    return v === undefined ? '·' : String(v);
  };

  const render = (note: { zh: string; en: string }): void => {
    const nodes: GraphNode[] = nodeIds.map((id) => {
      let role: BarRole = 'default';
      if (isArt.has(id)) role = 'warn';
      if (visited.has(id)) role = 'frontier';
      if (id === cur) role = 'compare';
      if (isArt.has(id) && id === cur) role = 'warn';
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
      if (
        examEdge &&
        ((examEdge.from === e.from && examEdge.to === e.to) ||
          (examEdge.from === e.to && examEdge.to === e.from))
      )
        role = 'compare';
      return { from: e.from, to: e.to, role };
    });
    rec
      .begin(note)
      .setGraph(nodes, edges)
      .setAux([
        { label: 'dfn', value: nodeIds.map((n) => `${n}:${fmt(dfn, n)}`).join('  ') },
        { label: 'low', value: nodeIds.map((n) => `${n}:${fmt(low, n)}`).join('  ') },
        { label: '割点', value: isArt.size ? [...isArt].join(', ') : '（暂无）', role: 'warn' },
      ])
      .commit();
  };

  render({ zh: '初始无向图（链状）', en: 'Initial undirected graph (path)' });

  const hooks: ArticulationHooks = {
    onDiscover: (v, _parent, d) => {
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
    onArticulation: (v) => {
      isArt.add(v);
      cur = v;
      render({ zh: `${v} 是割点`, en: `${v} is an articulation point` });
    },
  };

  articulationPointDfs(input, hooks);

  cur = null;
  rec
    .begin({
      zh: `完成：割点 { ${[...isArt].join(', ')} }`,
      en: `Done: articulation points { ${[...isArt].join(', ')} }`,
    })
    .setGraph(
      nodeIds.map((id) => ({
        id,
        label: id,
        x: POS[id]?.x ?? 0.5,
        y: POS[id]?.y ?? 0.5,
        role: (isArt.has(id) ? 'warn' : 'final') as BarRole,
      })),
      input.edges.map((e) => ({ from: e.from, to: e.to })),
    )
    .setAux([{ label: '割点', value: [...isArt].join(', ') || '无', role: 'warn' }])
    .commit();

  return rec.build();
}

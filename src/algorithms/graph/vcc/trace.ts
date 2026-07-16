// =============================================================================
// 点双连通 · 录制帧序列
// 可视化：setGraph，role:同一 VCC 同色 'final'，割点='pivot'，当前考察='compare'，已访问='frontier'；
// setAux 展示 dfn / low / 割点。
// =============================================================================

import type { BarRole, Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { vcc, type GraphInput, type VccHooks } from './impl.ts';

/** 演示无向图：两个三角环由桥 (2-3) 相连，割点 2,3。
 *  环 A：0-1-2-0；桥：2-3；环 B：3-4-5-3。
 *  点双：{0,1,2}, {2,3}(桥也是点双), {3,4,5} */
export const DEFAULT_INPUT: GraphInput = {
  nodes: ['0', '1', '2', '3', '4', '5'],
  edges: [
    { from: '0', to: '1' },
    { from: '1', to: '2' },
    { from: '2', to: '0' },
    { from: '2', to: '3' },
    { from: '3', to: '4' },
    { from: '4', to: '5' },
    { from: '5', to: '3' },
  ],
};

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
  const cut = new Set<string>();
  const compOf = new Map<string, number>(); // 节点首次所属分量编号（同色用）
  let cur: string | null = null;
  let examEdge: { from: string; to: string } | null = null;
  let compCount = 0;

  const fmt = (m: Map<string, number>, id: string): string => {
    const v = m.get(id);
    return v === undefined ? '·' : String(v);
  };

  const render = (note: { zh: string; en: string }): void => {
    const nodes: GraphNode[] = nodeIds.map((id) => {
      let role: BarRole = 'default';
      if (cut.has(id)) role = 'pivot';
      else if (visited.has(id)) role = 'frontier';
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
      if (compOf.has(e.from) && compOf.has(e.to) && compOf.get(e.from) === compOf.get(e.to))
        role = 'final';
      if (examEdge && examEdge.from === e.from && examEdge.to === e.to) role = 'compare';
      return { from: e.from, to: e.to, role };
    });
    rec
      .begin(note)
      .setGraph(nodes, edges)
      .setAux([
        { label: 'dfn', value: nodeIds.map((n) => `${n}:${fmt(dfn, n)}`).join('  ') },
        { label: 'low', value: nodeIds.map((n) => `${n}:${fmt(low, n)}`).join('  ') },
        { label: '割点 / cut', value: cut.size ? [...cut].join(', ') : '∅', role: 'pivot' },
      ])
      .commit();
  };

  render({ zh: '初始无向图', en: 'Initial undirected graph' });

  const hooks: VccHooks = {
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
      const m = { tree: '树边', back: '回边', parent: '父边' };
      const me = { tree: 'tree', back: 'back', parent: 'parent' };
      render({ zh: `考察 ${u}→${v}（${m[kind]}）`, en: `Examine ${u}→${v} (${me[kind]})` });
      examEdge = null;
    },
    onUpdateLow: (u, newLow) => {
      const old = low.get(u) ?? Infinity;
      low.set(u, newLow);
      cur = u;
      render({ zh: `更新 low[${u}] = ${newLow}（原 ${old}）`, en: `Update low[${u}] = ${newLow}` });
    },
    onComponent: (comp) => {
      compCount++;
      for (const id of comp) if (!compOf.has(id)) compOf.set(id, compCount);
      // 割点节点同时进入新分量：保持 pivot
      cur = null;
      render({
        zh: `发现点双 #${compCount}：{ ${comp.join(', ')} }`,
        en: `VCC #${compCount}: { ${comp.join(', ')} }`,
      });
    },
  };

  const result = vcc(input, hooks);
  cut.clear();
  result.cutVertices.forEach((c) => cut.add(c));

  cur = null;
  rec
    .begin({
      zh: `完成：${result.components.length} 个点双，割点 ${result.cutVertices.length} 个`,
      en: `Done: ${result.components.length} VCC(s), ${result.cutVertices.length} cut(s)`,
    })
    .setGraph(
      nodeIds.map((id) => ({
        id,
        label: id,
        x: POS[id]?.x ?? 0.5,
        y: POS[id]?.y ?? 0.5,
        role: (cut.has(id) ? 'pivot' : 'final') as BarRole,
      })),
      input.edges.map((e) => ({ from: e.from, to: e.to, role: 'final' as BarRole })),
    )
    .setAux([{ label: '割点 / cut', value: [...cut].join(', ') || '∅', role: 'pivot' }])
    .commit();

  return rec.build();
}

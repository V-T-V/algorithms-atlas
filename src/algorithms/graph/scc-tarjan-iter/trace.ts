// =============================================================================
// 强连通迭代 · 录制帧序列
// 可视化：setGraph（节点+边），role:同一 SCC 同色 'final'，栈中 'frontier'，当前 'compare'；
// setAux 展示 dfn / low / 栈。
// =============================================================================

import type { BarRole, Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { sccTarjanIter, type GraphInput, type SccTarjanIterHooks } from './impl.ts';

/** 演示用有向图：含两个环 + 桥接边。
 *  环 1：0→1→2→0；环 2：3→4→5→3；4→1 桥接。 */
export const DEFAULT_INPUT: GraphInput = {
  nodes: ['0', '1', '2', '3', '4', '5'],
  edges: [
    { from: '0', to: '1' },
    { from: '1', to: '2' },
    { from: '2', to: '0' },
    { from: '3', to: '4' },
    { from: '4', to: '5' },
    { from: '5', to: '3' },
    { from: '4', to: '1' },
  ],
};

const POS: Record<string, { x: number; y: number }> = {
  '0': { x: 0.2, y: 0.3 },
  '1': { x: 0.2, y: 0.55 },
  '2': { x: 0.2, y: 0.8 },
  '3': { x: 0.7, y: 0.3 },
  '4': { x: 0.7, y: 0.55 },
  '5': { x: 0.7, y: 0.8 },
};

/** 录制演示帧序列。 */
export function buildTrace(input: GraphInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const nodeIds = input.nodes;

  const dfn = new Map<string, number>();
  const low = new Map<string, number>();
  const onStack = new Set<string>();
  const stack: string[] = [];
  const done = new Set<string>();
  const sccOf = new Map<string, number>();
  let cur: string | null = null;
  let examEdge: { from: string; to: string } | null = null;
  let sccCount = 0;

  const fmt = (m: Map<string, number>, id: string): string => {
    const v = m.get(id);
    return v === undefined ? '·' : String(v);
  };

  const render = (note: { zh: string; en: string }): void => {
    const nodes: GraphNode[] = nodeIds.map((id) => {
      let role: BarRole = 'default';
      if (done.has(id)) role = 'final';
      if (onStack.has(id)) role = 'frontier';
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
      if (sccOf.has(e.from) && sccOf.get(e.from) === sccOf.get(e.to)) role = 'final';
      if (examEdge && examEdge.from === e.from && examEdge.to === e.to) role = 'compare';
      return { from: e.from, to: e.to, directed: true, role };
    });
    rec
      .begin(note)
      .setGraph(nodes, edges)
      .setAux([
        { label: 'dfn', value: nodeIds.map((n) => `${n}:${fmt(dfn, n)}`).join('  ') },
        { label: 'low', value: nodeIds.map((n) => `${n}:${fmt(low, n)}`).join('  ') },
        { label: '栈', value: stack.length ? stack.join(' → ') : '∅', role: 'frontier' },
      ])
      .commit();
  };

  render({ zh: '初始有向图（显式栈迭代）', en: 'Initial directed graph (iterative)' });

  const hooks: SccTarjanIterHooks = {
    onDiscover: (v, d) => {
      dfn.set(v, d);
      low.set(v, d);
      cur = v;
      render({ zh: `访问 ${v}：dfn=low=${d}，入栈`, en: `Visit ${v}: dfn=low=${d}, push` });
    },
    onExamine: (u, v, kind) => {
      examEdge = { from: u, to: v };
      cur = u;
      const m = { tree: '树边', back: '回溯边', cross: '横叉边', forward: '前向边' };
      const me = { tree: 'tree', back: 'back', cross: 'cross', forward: 'forward' };
      render({ zh: `考察 ${u}→${v}（${m[kind]}）`, en: `Examine ${u}→${v} (${me[kind]})` });
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
    onComponent: (comp) => {
      sccCount++;
      for (const id of comp) {
        done.add(id);
        sccOf.set(id, sccCount);
        onStack.delete(id);
        const idx = stack.lastIndexOf(id);
        if (idx >= 0) stack.splice(idx, 1);
      }
      cur = null;
      render({
        zh: `发现 SCC #${sccCount}：{ ${comp.join(', ')} }`,
        en: `SCC #${sccCount}: { ${comp.join(', ')} }`,
      });
    },
  };

  sccTarjanIter(input, hooks);

  cur = null;
  rec
    .begin({ zh: `完成：共 ${sccCount} 个 SCC`, en: `Done: ${sccCount} SCCs` })
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
        directed: true,
        role: (sccOf.get(e.from) === sccOf.get(e.to) ? 'final' : 'default') as BarRole,
      })),
    )
    .setAux([{ label: 'SCC 总数', value: String(sccCount), role: 'final' }])
    .commit();

  return rec.build();
}

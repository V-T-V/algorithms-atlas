// =============================================================================
// Tarjan 强连通分量 · 录制帧序列
// 通过 tarjanScc 的钩子把执行过程录成 Frame[]。
// 可视化：setGraph（节点+边），role:同一 SCC 同色 'final'，栈中 'frontier'，当前 'compare'；
// setAux 展示 dfn / low / 栈。
// =============================================================================

import type { BarRole, Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { tarjanScc, type GraphInput, type TarjanHooks } from './impl.ts';

/** 演示用有向图：含两个环 + 一个桥接边。
 *  环 1：0→1→2→0；环 2：3→4→5→3；4→1 桥接（不形成更大 SCC，因 1 无法回到 4）。 */
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

/** 归一化坐标：环 1 在左，环 2 在右。 */
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
  const done = new Set<string>(); // 已归入某 SCC
  const sccOf = new Map<string, number>(); // 节点 → SCC 编号（用于同色）
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
      // 同一已确定 SCC 内的边标 final
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

  render({
    zh: '初始有向图（含两个环 + 桥接边）',
    en: 'Initial directed graph (two cycles + bridge)',
  });

  const hooks: TarjanHooks = {
    onDiscover: (v, d) => {
      dfn.set(v, d);
      low.set(v, d);
      stack.push(v);
      onStack.add(v);
      cur = v;
      render({
        zh: `访问 ${v}：dfn=low=${d}，入栈`,
        en: `Visit ${v}: dfn=low=${d}, push to stack`,
      });
    },
    onExamine: (u, v, kind) => {
      examEdge = { from: u, to: v };
      cur = u;
      const kindText = { tree: '树边', back: '回溯边', cross: '横叉边', forward: '前向边' }[kind];
      const kindEn = { tree: 'tree', back: 'back', cross: 'cross', forward: 'forward' }[kind];
      render({
        zh: `考察边 ${u}→${v}（${kindText}）`,
        en: `Examine ${u}→${v} (${kindEn} edge)`,
      });
      examEdge = null;
    },
    onUpdateLow: (u, newLow) => {
      const old = low.get(u) ?? Infinity;
      low.set(u, newLow);
      cur = u;
      render({
        zh: `更新 low[${u}] = min(low[${u}], …) = ${newLow}（原 ${old}）`,
        en: `Update low[${u}] = ${newLow} (was ${old})`,
      });
    },
    onComponent: (comp) => {
      sccCount++;
      for (const id of comp) {
        onStack.delete(id);
        done.add(id);
        sccOf.set(id, sccCount);
        // 从栈中移除（与 impl 同步：实际栈已 pop）
        const idx = stack.lastIndexOf(id);
        if (idx >= 0) stack.splice(idx, 1);
      }
      cur = null;
      render({
        zh: `发现 SCC #${sccCount}：{ ${comp.join(', ')} }`,
        en: `SCC #${sccCount} found: { ${comp.join(', ')} }`,
      });
    },
  };

  tarjanScc(input, hooks);

  // 终态：全部 final
  cur = null;
  rec
    .begin({
      zh: `完成：共 ${sccCount} 个强连通分量`,
      en: `Done: ${sccCount} strongly connected components`,
    })
    .setGraph(
      nodeIds.map((id) => ({
        id,
        label: `${id}`,
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

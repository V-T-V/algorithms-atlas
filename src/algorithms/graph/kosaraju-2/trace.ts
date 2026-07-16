// =============================================================================
// Kosaraju 优化 · 录制帧序列
// 可视化：setGraph，role:同一 SCC 同色 'final'，第一遍已访问='frontier'，当前='compare'；
// setAux 展示完成序与当前阶段。
// =============================================================================

import type { BarRole, Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { kosaraju2, type GraphInput, type Kosaraju2Hooks } from './impl.ts';

/** 演示用有向图：环 0→1→2→0；环 3→4→5→3；4→1 桥接。 */
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

  const visited1 = new Set<string>();
  const order: string[] = [];
  const done = new Set<string>();
  const sccOf = new Map<string, number>();
  let cur: string | null = null;
  let phase: 'pass1' | 'pass2' = 'pass1';
  let sccCount = 0;

  const render = (note: { zh: string; en: string }): void => {
    const nodes: GraphNode[] = nodeIds.map((id) => {
      let role: BarRole = 'default';
      if (done.has(id)) role = 'final';
      else if (visited1.has(id)) role = 'frontier';
      if (id === cur) role = 'compare';
      return {
        id,
        label: id,
        x: POS[id]?.x ?? 0.5,
        y: POS[id]?.y ?? 0.5,
        role,
      };
    });
    const edges: GraphEdge[] = input.edges.map((e) => {
      let role: BarRole = 'default';
      if (sccOf.has(e.from) && sccOf.get(e.from) === sccOf.get(e.to)) role = 'final';
      return { from: e.from, to: e.to, directed: true, role };
    });
    rec
      .begin(note)
      .setGraph(nodes, edges)
      .setAux([
        { label: '阶段', value: phase === 'pass1' ? '①原图 DFS' : '②反图 DFS', role: 'frontier' },
        { label: '完成序', value: order.length ? [...order].reverse().join(' → ') : '∅' },
      ])
      .commit();
  };

  render({ zh: '初始有向图，准备第一遍 DFS', en: 'Initial graph; first DFS' });

  const hooks: Kosaraju2Hooks = {
    onVisit1: (v) => {
      phase = 'pass1';
      cur = v;
      visited1.add(v);
      render({ zh: `第一遍访问 ${v}`, en: `Pass 1 visit ${v}` });
    },
    onFinish1: (v) => {
      order.push(v);
      cur = v;
      render({ zh: `${v} 完成，压入完成栈`, en: `${v} finished, pushed to order` });
    },
    onVisit2: (v) => {
      phase = 'pass2';
      cur = v;
      render({ zh: `第二遍（反图）访问 ${v}`, en: `Pass 2 (reverse) visit ${v}` });
    },
    onComponent: (comp) => {
      sccCount++;
      for (const id of comp) {
        done.add(id);
        sccOf.set(id, sccCount);
      }
      cur = null;
      render({
        zh: `发现 SCC #${sccCount}：{ ${comp.join(', ')} }`,
        en: `SCC #${sccCount}: { ${comp.join(', ')} }`,
      });
    },
  };

  kosaraju2(input, hooks);

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

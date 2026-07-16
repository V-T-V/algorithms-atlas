// =============================================================================
// 欧拉回路 · 录制帧序列
import type { BarRole, Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { eulerCircuit, type GraphInput, type EulerHooks } from './impl.ts';

/** 示例：A-B-C-D-A 矩形 + B-D 对角线，所有度数为偶数。 */
export const DEFAULT_INPUT: GraphInput = {
  nodes: ['A', 'B', 'C', 'D'],
  edges: [
    { from: 'A', to: 'B' },
    { from: 'B', to: 'C' },
    { from: 'C', to: 'D' },
    { from: 'D', to: 'A' },
    { from: 'B', to: 'D' },
  ],
};

const POS: Record<string, { x: number; y: number }> = {
  A: { x: 0.2, y: 0.25 },
  B: { x: 0.8, y: 0.25 },
  C: { x: 0.8, y: 0.8 },
  D: { x: 0.2, y: 0.8 },
};

export function buildTrace(input: GraphInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const nodeIds = input.nodes;

  const usedEdge = new Set<number>();
  const onPath = new Set<string>();
  let cur: string | null = null;
  const circuit: string[] = [];

  const mkNodes = (): GraphNode[] =>
    nodeIds.map((id) => {
      let role: BarRole = 'default';
      if (onPath.has(id)) role = 'frontier';
      if (id === cur) role = 'compare';
      if (circuit.includes(id) && circuit.length === input.edges.length + 1) role = 'final';
      return { id, label: id, x: POS[id]?.x ?? 0.5, y: POS[id]?.y ?? 0.5, role };
    });
  const mkEdges = (): GraphEdge[] =>
    input.edges.map((e, i) => ({
      from: e.from,
      to: e.to,
      role: (usedEdge.has(i) ? 'final' : 'default') as BarRole,
    }));

  const snap = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setGraph(mkNodes(), mkEdges())
      .setAux([
        { label: '游走栈', value: onPath.size ? [...onPath].join('→') : '∅', role: 'frontier' },
        { label: '已用边', value: `${usedEdge.size}/${input.edges.length}` },
        { label: '回路', value: circuit.length ? circuit.join('→') : '（构建中）', role: 'final' },
      ])
      .commit();
  };

  snap({ zh: '初始图（所有度数为偶数）', en: 'Initial graph (all even degree)' });

  const hooks: EulerHooks = {
    onAdvance: (u, v, idx) => {
      usedEdge.add(idx);
      cur = v;
      snap({
        zh: `沿边 ${u}→${v} 前进（已用 ${usedEdge.size}/${input.edges.length}）`,
        en: `Advance ${u}→${v} (used ${usedEdge.size}/${input.edges.length})`,
      });
    },
    onBacktrack: (v) => {
      circuit.push(v);
      cur = v;
      onPath.delete(v);
      snap({ zh: `死胡同回退 ${v}，并入回路`, en: `Backtrack ${v} into circuit` });
    },
    onResult: (c) => {
      cur = null;
      onPath.clear();
      if (c) {
        circuit.length = 0;
        circuit.push(...c);
        snap({ zh: `欧拉回路：${c.join('→')}`, en: `Euler circuit: ${c.join('→')}` });
      } else {
        snap({ zh: '不存在欧拉回路', en: 'No Eulerian circuit' });
      }
    },
  };

  // 同步游走栈可视化：在 advance 时维护 onPath
  const wrappedHooks: EulerHooks = {
    onAdvance: (u, v, idx) => {
      onPath.add(v);
      hooks.onAdvance!(u, v, idx);
    },
    onBacktrack: hooks.onBacktrack,
    onResult: hooks.onResult,
  };

  eulerCircuit(input, wrappedHooks);

  rec
    .begin({ zh: `完成：回路 ${circuit.join('→')}`, en: `Done: ${circuit.join('→')}` })
    .setGraph(mkNodes(), mkEdges())
    .setAux([{ label: '回路', value: circuit.join('→'), role: 'final' }])
    .commit();

  return rec.build();
}

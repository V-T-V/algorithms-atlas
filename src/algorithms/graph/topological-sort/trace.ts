// 拓扑排序 · 录制帧序列

import type { BarRole, Frame, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { topologicalSort, type GraphInput } from './impl.ts';

export const DEFAULT_INPUT: GraphInput = {
  nodes: ['cook', 'eat', 'shop', 'wash'],
  edges: [
    { from: 'shop', to: 'cook' },
    { from: 'cook', to: 'eat' },
    { from: 'wash', to: 'cook' },
  ],
};

/** 录制演示帧序列。 */
export function buildTrace(input: GraphInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();

  const nodeFrame = (active?: string, done: string[] = []): GraphNode[] =>
    input.nodes.map((id, index) => ({
      id,
      label: id,
      x: 0.18 + (index % 2) * 0.55,
      y: 0.18 + Math.floor(index / 2) * 0.45,
      role: (id === active ? 'compare' : done.includes(id) ? 'final' : 'default') as BarRole,
    }));

  rec
    .begin({ zh: '建立有向无环图与入度表', en: 'Build DAG and in-degree table' })
    .setGraph(
      nodeFrame(),
      input.edges.map((edge) => ({ ...edge, directed: true })),
    )
    .commit();

  const output: string[] = [];
  const out = topologicalSort(input, {
    onEnqueue: (node) => {
      rec
        .begin({ zh: `${node} 入度为 0，进入队列`, en: `${node} has in-degree 0; enqueue it` })
        .setGraph(
          nodeFrame(node, output),
          input.edges.map((edge) => ({ ...edge, directed: true })),
        )
        .setAux([{ label: 'queue', value: node, role: 'frontier' }])
        .commit();
    },
    onOutput: (node) => {
      output.push(node);
      rec
        .begin({ zh: `输出 ${node}`, en: `Output ${node}` })
        .setGraph(
          nodeFrame(node, output),
          input.edges.map((edge) => ({ ...edge, directed: true })),
        )
        .setAux([{ label: 'order', value: output.join(' → '), role: 'final' }])
        .commit();
    },
  });

  rec
    .begin({ zh: `完成：${out.order.join(' → ')}`, en: `Done: ${out.order.join(' → ')}` })
    .setGraph(
      nodeFrame(undefined, out.order),
      input.edges.map((edge) => ({ ...edge, directed: true })),
    )
    .setAux([{ label: 'is DAG', value: String(out.isDag), role: out.isDag ? 'final' : 'warn' }])
    .commit();

  return rec.build();
}

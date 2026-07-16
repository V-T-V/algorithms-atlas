// =============================================================================
// Prim·Fibonacci 堆 · 录制帧序列
import type { BarRole, Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { primFibonacci, type GraphInput, type PrimHooks } from './impl.ts';

export const DEFAULT_INPUT: GraphInput = {
  nodes: ['0', '1', '2', '3', '4'],
  edges: [
    { from: '0', to: '1', weight: 4 },
    { from: '0', to: '2', weight: 1 },
    { from: '1', to: '2', weight: 3 },
    { from: '1', to: '3', weight: 2 },
    { from: '2', to: '3', weight: 5 },
    { from: '3', to: '4', weight: 6 },
    { from: '2', to: '4', weight: 7 },
  ],
  source: '0',
};

const POS: Record<string, { x: number; y: number }> = {
  '0': { x: 0.15, y: 0.2 },
  '1': { x: 0.15, y: 0.8 },
  '2': { x: 0.5, y: 0.5 },
  '3': { x: 0.85, y: 0.8 },
  '4': { x: 0.85, y: 0.2 },
};

export function buildTrace(input: GraphInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const nodeIds = input.nodes;

  const key = new Map<string, number>();
  for (const n of nodeIds) key.set(n, Infinity);
  const inTree = new Set<string>();
  const mstEdges = new Set<string>();
  let total = 0;
  let cur: string | null = null;

  const edgeKey = (a: string, b: string): string => [a, b].sort().join('-');

  const render = (note: { zh: string; en: string }): void => {
    const nodes: GraphNode[] = nodeIds.map((id) => {
      let role: BarRole = 'default';
      if (inTree.has(id)) role = 'final';
      else if (key.get(id) !== Infinity) role = 'frontier';
      if (id === cur) role = 'compare';
      const k = key.get(id);
      return {
        id,
        label: `${id}\nkey=${k === Infinity ? '∞' : k}`,
        x: POS[id]?.x ?? 0.5,
        y: POS[id]?.y ?? 0.5,
        role,
      };
    });
    const edges: GraphEdge[] = input.edges.map((e) => {
      let role: BarRole = 'default';
      if (mstEdges.has(edgeKey(e.from, e.to))) role = 'final';
      return { from: e.from, to: e.to, weight: e.weight, role };
    });
    rec
      .begin(note)
      .setGraph(nodes, edges)
      .setAux([
        {
          label: 'key',
          value: nodeIds
            .map((n) => `${n}:${key.get(n) === Infinity ? '∞' : key.get(n)}`)
            .join('  '),
        },
        { label: 'MST 权重', value: String(total), role: 'final' },
      ])
      .commit();
  };

  render({
    zh: `源点 ${input.source ?? ''}，key 初始化`,
    en: `Source ${input.source ?? ''}, init key`,
  });

  const hooks: PrimHooks = {
    onExtract: (v, k) => {
      inTree.add(v);
      cur = v;
      const prevNode = nodeIds.find((n) => mstEdges.has(edgeKey(n, v)) && inTree.has(n));
      if (prevNode) {
        mstEdges.add(edgeKey(prevNode, v));
        total += k;
      }
      render({ zh: `extract-min ${v}（key=${k}）`, en: `extract-min ${v} (key=${k})` });
    },
    onDecrease: (u, v, nk) => {
      key.set(v, nk);
      cur = u;
      render({
        zh: `decrease-key ${v} = ${nk}（经 ${u}）`,
        en: `decrease-key ${v} = ${nk} (via ${u})`,
      });
    },
    onResult: (t) => {
      total = t;
    },
  };

  primFibonacci(input, hooks);

  cur = null;
  rec
    .begin({ zh: `完成：MST 权重 ${total}`, en: `Done: MST weight ${total}` })
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
        weight: e.weight,
        role: (mstEdges.has(edgeKey(e.from, e.to)) ? 'final' : 'default') as BarRole,
      })),
    )
    .setAux([{ label: 'MST 权重', value: String(total), role: 'final' }])
    .commit();

  return rec.build();
}

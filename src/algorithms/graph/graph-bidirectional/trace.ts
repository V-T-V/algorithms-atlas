// =============================================================================
// 双向 BFS · 录制帧序列
import type { BarRole, Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { bidirectionalBfs, type BiBfsHooks, type GraphInput } from './impl.ts';

export const DEFAULT_INPUT: GraphInput = {
  nodes: ['S', 'A', 'B', 'C', 'D', 'T'],
  edges: [
    { from: 'S', to: 'A' },
    { from: 'S', to: 'B' },
    { from: 'A', to: 'C' },
    { from: 'B', to: 'C' },
    { from: 'C', to: 'D' },
    { from: 'D', to: 'T' },
  ],
};
const POS: Record<string, { x: number; y: number }> = {
  S: { x: 0.1, y: 0.5 },
  A: { x: 0.3, y: 0.25 },
  B: { x: 0.3, y: 0.75 },
  C: { x: 0.55, y: 0.5 },
  D: { x: 0.75, y: 0.5 },
  T: { x: 0.9, y: 0.5 },
};
export const DEFAULT_SOURCE = 'S';
export const DEFAULT_TARGET = 'T';

export function buildTrace(
  input: GraphInput = DEFAULT_INPUT,
  source = DEFAULT_SOURCE,
  target = DEFAULT_TARGET,
): Frame[] {
  const rec = new TraceRecorder();
  const visitedS = new Set<string>([source]);
  const visitedT = new Set<string>([target]);
  let meet: string | null = null;
  let ans = Infinity;

  const render = (note: { zh: string; en: string }): void => {
    const nodes: GraphNode[] = input.nodes.map((id) => {
      let role: BarRole = 'default';
      if (visitedS.has(id) && visitedT.has(id)) role = 'final';
      else if (id === meet) role = 'swap';
      else if (visitedS.has(id)) role = 'frontier';
      else if (visitedT.has(id)) role = 'pivot';
      if (id === source) role = 'compare';
      if (id === target) role = 'compare';
      return { id, label: id, x: POS[id]?.x ?? 0.5, y: POS[id]?.y ?? 0.5, role };
    });
    const edges: GraphEdge[] = input.edges.map((e) => ({ from: e.from, to: e.to }));
    rec.begin(note).setGraph(nodes, edges).commit();
  };

  render({ zh: `双向 BFS: ${source} ↔ ${target}`, en: `Bi-BFS: ${source} <-> ${target}` });

  const hooks: BiBfsHooks = {
    onExpand: (side, node) => {
      if (side === 'src') visitedS.add(node);
      else visitedT.add(node);
      render({
        zh: `${side === 'src' ? '源侧' : '目标侧'}展开 ${node}`,
        en: `${side} expand ${node}`,
      });
    },
    onMeet: (mu, dist) => {
      meet = mu;
      render({ zh: `相遇于 ${mu}，距离=${dist}`, en: `Meet at ${mu}, dist=${dist}` });
    },
    onDone: (found, dist) => {
      if (found) ans = dist;
      render({
        zh: found ? `最短=${dist}` : '不连通',
        en: found ? `shortest=${dist}` : 'disconnected',
      });
    },
  };

  bidirectionalBfs(input, source, target, hooks);

  rec
    .begin({
      zh: Number.isFinite(ans) ? `完成：${ans}` : '无路径',
      en: Number.isFinite(ans) ? `Done: ${ans}` : 'No path',
    })
    .setAux([{ label: '最短距离', value: Number.isFinite(ans) ? String(ans) : '∞', role: 'final' }])
    .commit();

  return rec.build();
}

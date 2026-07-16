// =============================================================================
// 分层 BFS · 录制
import type { BarRole, Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { layeredBfs, type GraphInput3, type LayeredBfsHooks } from './impl.ts';

export const DEFAULT_INPUT: GraphInput3 = {
  nodes: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
  edges: [
    { from: 'A', to: 'B' },
    { from: 'A', to: 'C' },
    { from: 'B', to: 'D' },
    { from: 'C', to: 'D' },
    { from: 'D', to: 'E' },
    { from: 'D', to: 'F' },
    { from: 'F', to: 'G' },
  ],
};

export const DEFAULT_START = 'A';

const POS: Record<string, { x: number; y: number }> = {
  A: { x: 0.5, y: 0.1 },
  B: { x: 0.25, y: 0.4 },
  C: { x: 0.75, y: 0.4 },
  D: { x: 0.5, y: 0.55 },
  E: { x: 0.25, y: 0.85 },
  F: { x: 0.5, y: 0.85 },
  G: { x: 0.85, y: 0.85 },
};

export function buildTrace(input: GraphInput3 = DEFAULT_INPUT, start = DEFAULT_START): Frame[] {
  const rec = new TraceRecorder();
  const dist = new Map<string, number>();
  const visited = new Set<string>();
  const queue: string[] = [];
  let exam: { from: string; to: string } | null = null;

  const render = (note: { zh: string; en: string }): void => {
    const nodes: GraphNode[] = input.nodes.map((id) => {
      let role: BarRole = 'default';
      if (visited.has(id)) role = 'frontier';
      return {
        id,
        label: dist.has(id) ? `${id}(${dist.get(id)})` : id,
        x: POS[id]?.x ?? 0.5,
        y: POS[id]?.y ?? 0.5,
        role,
      };
    });
    const edges: GraphEdge[] = input.edges.map((e) => {
      let role: BarRole = 'default';
      if (exam && exam.from === e.from && exam.to === e.to) role = 'compare';
      return { from: e.from, to: e.to, role };
    });
    rec
      .begin(note)
      .setGraph(nodes, edges)
      .setAux([{ label: 'Queue', value: queue.length ? queue.join(' → ') : '∅', role: 'frontier' }])
      .commit();
  };

  render({ zh: `从 ${start} 开始分层 BFS`, en: `Layered BFS from ${start}` });

  const hooks: LayeredBfsHooks = {
    onDiscover: (node, parent, d) => {
      visited.add(node);
      dist.set(node, d);
      queue.push(node);
      render({
        zh: `发现 ${node}（dist=${d}${parent ? ` ← ${parent}` : ''}）`,
        en: `Discover ${node} (d=${d})`,
      });
    },
    onVisit: (node) => {
      const idx = queue.indexOf(node);
      if (idx >= 0) queue.splice(idx, 1);
      render({ zh: `访问 ${node}`, en: `Visit ${node}` });
    },
    onExamine: (from, to) => {
      exam = { from, to };
      render({ zh: `检查 ${from}→${to}`, en: `Examine ${from}->${to}` });
      exam = null;
    },
  };

  layeredBfs(input, start, hooks);

  rec
    .begin({ zh: 'BFS 完成', en: 'BFS done' })
    .setGraph(
      input.nodes.map((id) => ({
        id,
        label: `${id}(${dist.get(id) ?? '∞'})`,
        x: POS[id]?.x ?? 0.5,
        y: POS[id]?.y ?? 0.5,
        role: 'final' as BarRole,
      })),
      input.edges.map((e) => ({ from: e.from, to: e.to, role: 'final' as BarRole })),
    )
    .commit();

  return rec.build();
}

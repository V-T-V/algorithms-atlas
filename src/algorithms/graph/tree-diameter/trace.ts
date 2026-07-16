// =============================================================================
// 树的直径 · 录制帧序列
// 可视化：setGraph（树），role:已访问='frontier'，当前 BFS 起点='pivot'，
// 直径路径='final'。setAux 展示阶段与直径长度。
// =============================================================================

import type { BarRole, Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { treeDiameter, type GraphInput, type TreeDiameterHooks } from './impl.ts';

/** 演示树：
 *   1 - 2 - 3 - 4 - 5  （一条长链，直径 = 4）
 *       |
 *       6
 *   节点 6 挂在 2 上，直径端点为 1 与 5。 */
export const DEFAULT_INPUT: GraphInput = {
  nodes: ['1', '2', '3', '4', '5', '6'],
  edges: [
    { from: '1', to: '2' },
    { from: '2', to: '3' },
    { from: '3', to: '4' },
    { from: '4', to: '5' },
    { from: '2', to: '6' },
  ],
};

const POS: Record<string, { x: number; y: number }> = {
  '1': { x: 0.08, y: 0.55 },
  '2': { x: 0.26, y: 0.55 },
  '3': { x: 0.46, y: 0.55 },
  '4': { x: 0.66, y: 0.55 },
  '5': { x: 0.88, y: 0.55 },
  '6': { x: 0.26, y: 0.85 },
};

/** 录制演示帧序列。 */
export function buildTrace(input: GraphInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const nodeIds = input.nodes;

  const visited = new Set<string>();
  let pivot: string | null = null;
  const diamPath = new Set<string>();
  let phase = 'init';

  const render = (note: { zh: string; en: string }): void => {
    const nodes: GraphNode[] = nodeIds.map((id) => {
      let role: BarRole = 'default';
      if (diamPath.has(id)) role = 'final';
      else if (visited.has(id)) role = 'frontier';
      if (id === pivot) role = 'pivot';
      return { id, label: id, x: POS[id]?.x ?? 0.5, y: POS[id]?.y ?? 0.5, role };
    });
    const edges: GraphEdge[] = input.edges.map((e) => ({
      from: e.from,
      to: e.to,
      role: diamPath.has(e.from) && diamPath.has(e.to) ? 'final' : 'default',
    }));
    rec
      .begin(note)
      .setGraph(nodes, edges)
      .setAux([{ label: '阶段', value: phase, role: 'frontier' }])
      .commit();
  };

  render({ zh: '初始树', en: 'Initial tree' });

  const hooks: TreeDiameterHooks = {
    onBfsStart: (s) => {
      pivot = s;
      render({ zh: `第一次 BFS 从 ${s} 出发`, en: `1st BFS from ${s}` });
      pivot = null;
    },
    onVisit: (u, d) => {
      visited.add(u);
      phase = `BFS 距离 ${d}`;
      render({ zh: `访问 ${u}，距离 ${d}`, en: `Visit ${u}, dist ${d}` });
    },
    onFarthest: (f, d) => {
      pivot = f;
      phase = '最远点';
      render({ zh: `最远点 ${f}，距离 ${d}`, en: `Farthest ${f}, dist ${d}` });
      pivot = null;
    },
    onDiameter: (path, len) => {
      path.forEach((p) => diamPath.add(p));
      phase = `直径 = ${len}`;
      render({
        zh: `直径长度 ${len}，路径 ${path.join('→')}`,
        en: `Diameter ${len}: ${path.join('->')}`,
      });
    },
  };

  visited.clear();
  phase = 'pass1';
  treeDiameter(input, hooks);

  rec
    .begin({ zh: '完成', en: 'Done' })
    .setGraph(
      nodeIds.map((id) => ({
        id,
        label: id,
        x: POS[id]?.x ?? 0.5,
        y: POS[id]?.y ?? 0.5,
        role: (diamPath.has(id) ? 'final' : 'default') as BarRole,
      })),
      input.edges.map((e) => ({
        from: e.from,
        to: e.to,
        role: (diamPath.has(e.from) && diamPath.has(e.to) ? 'final' : 'default') as BarRole,
      })),
    )
    .setAux([{ label: '直径', value: String([...diamPath].length - 1), role: 'final' }])
    .commit();

  return rec.build();
}

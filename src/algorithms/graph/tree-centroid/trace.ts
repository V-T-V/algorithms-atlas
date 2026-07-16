// =============================================================================
// 树重心 · 录制帧序列
// 可视化：setGraph（树），role:已后序访问='frontier'，候选重心='compare'，
// 确认重心='pivot'。setAux 展示 size / maxPart / n/2 上限。
// =============================================================================

import type { BarRole, Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { treeCentroid, type GraphInput, type TreeCentroidHooks } from './impl.ts';

/** 演示树（7 节点，重心应为 2 与 3）：
 *   1 - 2 - 3 - 4 - 5 - 6 - 7   （一条链）
 *   链长 7，重心为第 4 位（3）和第 3 位（2）？n=7, limit=3。
 *   节点 3：左 3（1,2,3），右 4 → maxPart=4 > 3 ✗
 *   节点 4：左 4，右 3 → maxPart=4 > 3 ✗
 *   实际：节点 3 删除后 {1,2}(2) {4,5,6,7}(4) → 4>3，不合法。
 *   让我们重算链 1-2-3-4-5-6-7：n=7,limit=3。
 *   节点 3 的子树（根为 1 时）= {3,4,5,6,7}=5，maxPart=5。up=2。
 *   以节点 1 为根做一次 DFS 即可，重心判定与根无关。 */
export const DEFAULT_INPUT: GraphInput = {
  nodes: ['1', '2', '3', '4', '5', '6', '7'],
  edges: [
    { from: '1', to: '2' },
    { from: '2', to: '3' },
    { from: '3', to: '4' },
    { from: '4', to: '5' },
    { from: '5', to: '6' },
    { from: '6', to: '7' },
  ],
};

const POS: Record<string, { x: number; y: number }> = {
  '1': { x: 0.07, y: 0.5 },
  '2': { x: 0.22, y: 0.5 },
  '3': { x: 0.37, y: 0.5 },
  '4': { x: 0.52, y: 0.5 },
  '5': { x: 0.67, y: 0.5 },
  '6': { x: 0.82, y: 0.5 },
  '7': { x: 0.95, y: 0.5 },
};

/** 录制演示帧序列。 */
export function buildTrace(input: GraphInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const nodeIds = input.nodes;

  const visited = new Set<string>();
  const candidates = new Set<string>();
  const finalCentroids = new Set<string>();
  let curPivot: string | null = null;
  const sizeMap = new Map<string, number>();
  const maxPartMap = new Map<string, number>();

  const render = (note: { zh: string; en: string }): void => {
    const nodes: GraphNode[] = nodeIds.map((id) => {
      let role: BarRole = 'default';
      if (visited.has(id)) role = 'frontier';
      if (candidates.has(id)) role = 'compare';
      if (finalCentroids.has(id)) role = 'pivot';
      if (id === curPivot) role = 'pivot';
      const lbl = sizeMap.has(id) ? `${id}\ns=${sizeMap.get(id)}` : id;
      return { id, label: lbl, x: POS[id]?.x ?? 0.5, y: POS[id]?.y ?? 0.5, role };
    });
    const edges: GraphEdge[] = input.edges.map((e) => ({
      from: e.from,
      to: e.to,
      role: 'default',
    }));
    rec
      .begin(note)
      .setGraph(nodes, edges)
      .setAux([
        { label: 'n/2 上限', value: String(Math.floor(nodeIds.length / 2)), role: 'frontier' },
        {
          label: '候选',
          value: candidates.size ? [...candidates].join(',') : '∅',
          role: 'compare',
        },
      ])
      .commit();
  };

  render({ zh: '初始树（链）', en: 'Initial tree (chain)' });

  const hooks: TreeCentroidHooks = {
    onVisit: (u, sz, mp) => {
      visited.add(u);
      sizeMap.set(u, sz);
      maxPartMap.set(u, mp);
      curPivot = u;
      render({
        zh: `后序 ${u}：size=${sz}，maxPart=${mp}`,
        en: `Post-order ${u}: size=${sz}, maxPart=${mp}`,
      });
      curPivot = null;
    },
    onCandidate: (u, mp) => {
      candidates.add(u);
      render({
        zh: `${u} 是候选（maxPart=${mp} ≤ ⌊n/2⌋）`,
        en: `${u} candidate (maxPart=${mp} <= n/2)`,
      });
    },
    onCentroids: (cs) => {
      cs.forEach((c) => {
        candidates.delete(c);
        finalCentroids.add(c);
      });
      render({ zh: `重心 = ${cs.join(', ')}`, en: `Centroids = ${cs.join(', ')}` });
    },
  };

  const result = treeCentroid(input, hooks);

  void result;
  rec
    .begin({ zh: '完成', en: 'Done' })
    .setGraph(
      nodeIds.map((id) => ({
        id,
        label: `${id}\ns=${sizeMap.get(id) ?? '?'}`,
        x: POS[id]?.x ?? 0.5,
        y: POS[id]?.y ?? 0.5,
        role: (finalCentroids.has(id) ? 'final' : 'default') as BarRole,
      })),
      input.edges.map((e) => ({ from: e.from, to: e.to, role: 'default' as BarRole })),
    )
    .setAux([{ label: '重心', value: [...finalCentroids].join(', ') || '∅', role: 'final' }])
    .commit();

  return rec.build();
}

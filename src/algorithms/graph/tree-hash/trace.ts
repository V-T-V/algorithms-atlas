// =============================================================================
// 树哈希 · 录制帧序列
// 可视化：setGraph（有根树），role:已后序访问='frontier'，当前节点='pivot'，
// 根='final'。setAux 展示每节点哈希（截断显示）。
// =============================================================================

import type { BarRole, Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { treeHash, type GraphInput, type TreeHashHooks } from './impl.ts';

/** 演示树（根 1）：
 *     1
 *    / \
 *   2   3
 *  / \
 * 4   5
 * 两个叶子 4、5 子树同构 → 哈希相等；节点 2 合并两相等子哈希。 */
export const DEFAULT_INPUT: GraphInput = {
  nodes: ['1', '2', '3', '4', '5'],
  edges: [
    { from: '1', to: '2' },
    { from: '1', to: '3' },
    { from: '2', to: '4' },
    { from: '2', to: '5' },
  ],
  root: '1',
};

const POS: Record<string, { x: number; y: number }> = {
  '1': { x: 0.5, y: 0.18 },
  '2': { x: 0.28, y: 0.5 },
  '3': { x: 0.72, y: 0.5 },
  '4': { x: 0.14, y: 0.85 },
  '5': { x: 0.42, y: 0.85 },
};

const fmt = (h: bigint): string => {
  const s = h.toString(16);
  return s.length > 6 ? `${s.slice(0, 6)}…` : s;
};

/** 录制演示帧序列。 */
export function buildTrace(input: GraphInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const nodeIds = input.nodes;

  const visited = new Set<string>();
  let curPivot: string | null = null;
  const hashStr = new Map<string, string>();

  const render = (note: { zh: string; en: string }): void => {
    const nodes: GraphNode[] = nodeIds.map((id) => {
      let role: BarRole = 'default';
      if (visited.has(id)) role = 'frontier';
      if (id === input.root) role = 'final';
      if (id === curPivot) role = 'pivot';
      return {
        id,
        label: hashStr.has(id) ? `${id}\n#${hashStr.get(id)}` : id,
        x: POS[id]?.x ?? 0.5,
        y: POS[id]?.y ?? 0.5,
        role,
      };
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
        {
          label: '当前节点',
          value: curPivot ?? input.root,
          role: 'pivot',
        },
      ])
      .commit();
  };

  render({ zh: '初始有根树（根 1）', en: 'Initial rooted tree (root 1)' });

  const hooks: TreeHashHooks = {
    onCombine: (u, childHashes) => {
      curPivot = u;
      render({
        zh: `合并 ${u}：子哈希 [${childHashes.map((c) => fmt(c)).join(', ')}]`,
        en: `Combine ${u}: child hashes [${childHashes.map((c) => fmt(c)).join(', ')}]`,
      });
      curPivot = null;
    },
    onVisit: (u, h) => {
      visited.add(u);
      hashStr.set(u, fmt(h));
      curPivot = u;
      render({ zh: `${u} 哈希 = #${fmt(h)}`, en: `${u} hash = #${fmt(h)}` });
      curPivot = null;
    },
    onRoot: (r, h) => {
      render({ zh: `根 ${r} 哈希 = #${fmt(h)}`, en: `Root ${r} hash = #${fmt(h)}` });
    },
  };

  treeHash(input, hooks);

  rec
    .begin({ zh: '完成', en: 'Done' })
    .setGraph(
      nodeIds.map((id) => ({
        id,
        label: `${id}\n#${hashStr.get(id) ?? '?'}`,
        x: POS[id]?.x ?? 0.5,
        y: POS[id]?.y ?? 0.5,
        role: (id === input.root ? 'final' : 'default') as BarRole,
      })),
      input.edges.map((e) => ({ from: e.from, to: e.to, role: 'default' as BarRole })),
    )
    .setAux([{ label: '根哈希', value: hashStr.get(input.root) ?? '?', role: 'final' }])
    .commit();

  return rec.build();
}

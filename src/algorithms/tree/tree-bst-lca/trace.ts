// BST LCA · 录制帧序列

import type { Frame, TreeNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildBST, lowestCommonAncestor, BstNode } from './impl.ts';

export const DEFAULT_INPUT = { keys: [50, 30, 70, 20, 40, 60, 80], p: 20, q: 40 };

function toViz(node: BstNode | null, path: number[] = [], lca?: number): TreeNode | undefined {
  if (node === null) return undefined;
  const onPath = path.includes(node.value);
  return {
    id: String(node.value),
    value: node.value,
    role: lca === node.value ? 'final' : onPath ? 'pivot' : 'default',
    children: [node.left, node.right]
      .filter((c): c is BstNode => c !== null)
      .map((c) => toViz(c, path, lca)!),
  };
}

export function buildTrace(
  input: { keys: number[]; p: number; q: number } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const { keys, p, q } = input;
  const root = buildBST(keys);
  const path: number[] = [];

  rec
    .begin({ zh: `LCA(${p}, ${q})`, en: `LCA(${p}, ${q})` })
    .setTree(toViz(root) ?? { id: 'empty', value: '', children: [] })
    .setAux([
      { label: 'p', value: String(p), role: 'frontier' },
      { label: 'q', value: String(q), role: 'frontier' },
    ])
    .commit();

  const lca = lowestCommonAncestor(root, p, q, {
    onVisit: (current, _p, _q, action) => {
      path.push(current);
      rec
        .begin({ zh: `访问 ${current} → ${action}`, en: `Visit ${current} → ${action}` })
        .setTree(toViz(root, path) ?? { id: 'empty', value: '', children: [] })
        .setAux([
          { label: '当前', value: String(current), role: 'pivot' },
          { label: '动作', value: action, role: 'compare' },
        ])
        .commit();
    },
  });

  rec
    .begin({
      zh: lca ? `LCA = ${lca.value}` : `无 LCA`,
      en: lca ? `LCA = ${lca.value}` : `no LCA`,
    })
    .setTree(toViz(root, path, lca?.value) ?? { id: 'empty', value: '', children: [] })
    .setAux([{ label: 'LCA', value: lca ? String(lca.value) : '无', role: 'final' }])
    .commit();

  return rec.build();
}

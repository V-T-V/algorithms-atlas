// 递归求树高 · 录制帧序列

import type { BarRole, Frame, TreeNode as VizTreeNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildTree, treeHeight, type TreeHeightHooks, type TreeNode } from './impl.ts';

export const DEFAULT_INPUT: Array<number | null> = [3, 9, 20, null, null, 15, 7];

/** 把树转成 viz TreeNode。 */
function toViz(node: TreeNode | null, prefix: string, highlight: Set<number>): VizTreeNode | null {
  if (!node) return null;
  const id = `${prefix}-${node.value}`;
  return {
    id,
    value: node.value,
    role: highlight.has(node.value) ? 'pivot' : 'default',
    children: [node.left, node.right]
      .map((c, i) => toViz(c, `${id}-${i}`, highlight) ?? undefined)
      .filter((x): x is VizTreeNode => x !== undefined),
  };
}

export function buildTrace(input: Array<number | null> = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const root = buildTree(input);
  const highlight = new Set<number>();
  const returns: Array<{ value: number; height: number }> = [];
  let maxDepth = 0;

  const snapshot = (note: { zh: string; en: string }): void => {
    const aux: Array<{ label: string; value: string; role?: BarRole }> = [
      { label: '最大深度', value: String(maxDepth), role: 'frontier' as BarRole },
    ];
    const top = returns[returns.length - 1];
    if (top)
      aux.push({
        label: '最新子树高',
        value: `${top.value}→${top.height}`,
        role: 'final' as BarRole,
      });
    rec
      .begin(note)
      .setTree(toViz(root, 'n', highlight) ?? { id: 'empty', value: '∅' })
      .setAux(aux)
      .commit();
  };

  snapshot({ zh: `计算树高`, en: `Compute tree height` });

  const hooks: TreeHeightHooks = {
    onVisit: (value, depth) => {
      highlight.clear();
      highlight.add(value);
      maxDepth = Math.max(maxDepth, depth + 1);
      snapshot({
        zh: `访问 ${value}（深度 ${depth + 1}）`,
        en: `Visit ${value} (depth ${depth + 1})`,
      });
    },
    onBase: (_d) => {
      // 空子树，不单独成帧（避免过多帧）
    },
    onReturn: (value, h, _d) => {
      highlight.clear();
      highlight.add(value);
      returns.push({ value, height: h });
      snapshot({ zh: `${value} 子树高 = ${h}`, en: `${value} subtree height = ${h}` });
    },
  };

  const result = treeHeight(root, hooks);

  // 终态：整棵树 final
  rec
    .begin({ zh: `树高 = ${result}`, en: `Height = ${result}` })
    .setTree(toViz(root, 'f', new Set()) ?? { id: 'empty', value: '∅' })
    .setAux([
      { label: '结果', value: String(result), role: 'final' as BarRole },
      { label: '复杂度', value: 'O(n)', role: 'compare' as BarRole },
    ])
    .commit();

  return rec.build();
}

// 二叉树前序遍历 · 录制帧序列
// 用 setTree 展示当前访问节点高亮（compare），已访问标 final，未访问 default。

import type { BarRole, Frame, TreeNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { binaryTreePreorder, buildTree, type BTNode, type PreorderHooks } from './impl.ts';

export const DEFAULT_INPUT = [1, 2, 3, 4, 5, null, 7];

/** 把 BTNode 转 viz TreeNode，访问路径上的节点按角色着色。 */
function toViz(
  node: BTNode | null,
  visited: Set<number>,
  current: number | null,
  prefix = 'n',
): TreeNode | null {
  if (!node) return null;
  const id = `${prefix}-${node.value}`;
  const role: BarRole =
    node.value === current ? 'compare' : visited.has(node.value) ? 'final' : 'default';
  return {
    id,
    value: node.value,
    role,
    children: [node.left, node.right]
      .map((c, i) => toViz(c, visited, current, `${id}-${i}`) ?? undefined)
      .filter((x): x is TreeNode => x !== undefined),
  };
}

export function buildTrace(input: Array<number | null> = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const root = buildTree(input);
  const visited = new Set<number>();
  let current: number | null = null;

  rec
    .begin({
      zh: '初始二叉树，准备前序遍历（根→左→右）',
      en: 'Initial tree, begin preorder (root→left→right)',
    })
    .setTree(toViz(root, visited, current) ?? { id: 'empty', value: '∅' })
    .commit();

  const order: number[] = [];
  const hooks: PreorderHooks = {
    onVisit: (v) => {
      current = v;
      order.push(v);
      rec
        .begin({
          zh: `访问 ${v}（已序：${order.join('→')}）`,
          en: `Visit ${v} (order: ${order.join('→')})`,
        })
        .setTree(toViz(root, visited, current) ?? { id: 'empty', value: '∅' })
        .commit();
      visited.add(v);
    },
  };

  binaryTreePreorder(root, hooks);

  rec
    .begin({ zh: `前序遍历完成：${order.join('→')}`, en: `Preorder done: ${order.join('→')}` })
    .setTree(toViz(root, visited, null) ?? { id: 'empty', value: '∅' })
    .commit();

  return rec.build();
}

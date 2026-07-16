// =============================================================================
// 后序遍历迭代版 · 录制帧序列
// =============================================================================

import type { BarRole, Frame, TreeNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { postorderIter, buildTree, type BTNode, type PostorderIterHooks } from './impl.ts';

export const DEFAULT_INPUT = [4, 2, 6, 1, 3, 5, 7];

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

/** 录制演示帧序列。 */
export function buildTrace(input: Array<number | null> = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const root = buildTree(input);
  const visited = new Set<number>();
  let current: number | null = null;
  const order: number[] = [];

  rec
    .begin({
      zh: '初始二叉树，后序遍历（左→右→根）',
      en: 'Initial tree; postorder (left→right→root)',
    })
    .setTree(toViz(root, visited, current) ?? { id: 'empty', value: '∅' })
    .commit();

  const hooks: PostorderIterHooks = {
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

  postorderIter(root, hooks);

  rec
    .begin({ zh: `完成：${order.join('→')}`, en: `Done: ${order.join('→')}` })
    .setTree(toViz(root, visited, null) ?? { id: 'empty', value: '∅' })
    .commit();

  return rec.build();
}

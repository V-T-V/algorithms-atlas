// 二叉树层序遍历 · 录制帧序列
// 用 setTree 展示当前访问节点高亮（compare），已访问标 final。

import type { BarRole, Frame, TreeNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { binaryTreeLevel, buildTree, type BTNode, type LevelHooks } from './impl.ts';

export const DEFAULT_INPUT = [1, 2, 3, 4, 5, null, 7];

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
      zh: '初始二叉树，准备层序遍历（自顶向下，逐层从左到右）',
      en: 'Initial tree, begin level order (top-down, left-to-right per level)',
    })
    .setTree(toViz(root, visited, current) ?? { id: 'empty', value: '∅' })
    .commit();

  const order: number[] = [];
  const hooks: LevelHooks = {
    onVisit: (v, level) => {
      current = v;
      order.push(v);
      rec
        .begin({
          zh: `访问 ${v}（第 ${level} 层，已序：${order.join('→')}）`,
          en: `Visit ${v} (level ${level}, order: ${order.join('→')})`,
        })
        .setTree(toViz(root, visited, current) ?? { id: 'empty', value: '∅' })
        .commit();
      visited.add(v);
    },
  };

  binaryTreeLevel(root, hooks);

  rec
    .begin({ zh: `层序遍历完成：${order.join('→')}`, en: `Level order done: ${order.join('→')}` })
    .setTree(toViz(root, visited, null) ?? { id: 'empty', value: '∅' })
    .commit();

  return rec.build();
}

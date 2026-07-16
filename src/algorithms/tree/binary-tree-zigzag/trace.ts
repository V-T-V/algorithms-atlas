// 二叉树锯齿形遍历 · 录制帧序列
// 用 setTree 展示当前访问节点高亮（compare），已访问标 final。

import type { BarRole, Frame, TreeNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { binaryTreeZigzag, buildTree, type BTNode, type ZigzagHooks } from './impl.ts';

export const DEFAULT_INPUT = [1, 2, 3, 4, 5, 6, 7];

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
      zh: '初始二叉树，准备锯齿遍历（奇偶层交替方向）',
      en: 'Initial tree, begin zigzag (alternating direction per level)',
    })
    .setTree(toViz(root, visited, current) ?? { id: 'empty', value: '∅' })
    .commit();

  const order: number[] = [];
  const hooks: ZigzagHooks = {
    onVisit: (v, level) => {
      current = v;
      order.push(v);
      const _dir = level % 2 === 0 ? '→' : '←';
      void _dir;
      rec
        .begin({
          zh: `访问 ${v}（第 ${level} 层${level % 2 === 0 ? '从左到右' : '从右到左'}）`,
          en: `Visit ${v} (level ${level}, ${level % 2 === 0 ? 'L→R' : 'R→L'})`,
        })
        .setTree(toViz(root, visited, current) ?? { id: 'empty', value: '∅' })
        .commit();
      visited.add(v);
    },
  };

  binaryTreeZigzag(root, hooks);

  rec
    .begin({ zh: `锯齿遍历完成：${order.join('→')}`, en: `Zigzag done: ${order.join('→')}` })
    .setTree(toViz(root, visited, null) ?? { id: 'empty', value: '∅' })
    .commit();

  return rec.build();
}

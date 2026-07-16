// =============================================================================
// 锯齿层序遍历（双栈）· 录制帧序列
// =============================================================================

import type { BarRole, Frame, TreeNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { zigzagLevelOrder, buildTree, type BTNode, type ZigzagStackHooks } from './impl.ts';

export const DEFAULT_INPUT = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

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
    .begin({ zh: '初始二叉树，锯齿层序遍历', en: 'Initial tree; zigzag level order' })
    .setTree(toViz(root, visited, current) ?? { id: 'empty', value: '∅' })
    .commit();

  const hooks: ZigzagStackHooks = {
    onLevel: (level, dir) => {
      current = null;
      rec
        .begin({
          zh: `第 ${level} 层：${dir === 'ltr' ? '从左到右' : '从右到左'}`,
          en: `Level ${level}: ${dir === 'ltr' ? 'left to right' : 'right to left'}`,
        })
        .setTree(toViz(root, visited, current) ?? { id: 'empty', value: '∅' })
        .commit();
    },
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

  zigzagLevelOrder(root, hooks);

  rec
    .begin({ zh: `完成：${order.join('→')}`, en: `Done: ${order.join('→')}` })
    .setTree(toViz(root, visited, null) ?? { id: 'empty', value: '∅' })
    .commit();

  return rec.build();
}

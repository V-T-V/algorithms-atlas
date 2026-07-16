// BST 迭代器 · 录制帧序列
// 用 setTree 展示：当前 next() 返回的节点高亮（compare），已产出标 final。

import type { BarRole, Frame, TreeNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { BSTIterator, bstInsert, type BSTNode, type IteratorHooks } from './impl.ts';

export const DEFAULT_INPUT = [50, 30, 70, 20, 40, 60, 80];

function toViz(
  node: BSTNode | null,
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

export function buildTrace(input: readonly number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const root = bstInsert(input);
  const visited = new Set<number>();
  let current: number | null = null;

  rec
    .begin({
      zh: '初始 BST，创建中序迭代器（栈中压入最左链）',
      en: 'Initial BST, create inorder iterator (left spine pushed)',
    })
    .setTree(toViz(root, visited, current) ?? { id: 'empty', value: '∅' })
    .commit();

  const order: number[] = [];
  const hooks: IteratorHooks = {
    onNext: (v) => {
      current = v;
      order.push(v);
      rec
        .begin({
          zh: `next() → ${v}（已产出：${order.join('→')}）`,
          en: `next() → ${v} (produced: ${order.join('→')})`,
        })
        .setTree(toViz(root, visited, current) ?? { id: 'empty', value: '∅' })
        .commit();
      visited.add(v);
    },
  };

  // 跑完迭代器
  const it = new BSTIterator(root);
  while (it.hasNext()) {
    const v = it.next();
    hooks.onNext?.(v);
  }

  rec
    .begin({ zh: `迭代完成：${order.join('→')}`, en: `Iteration done: ${order.join('→')}` })
    .setTree(toViz(root, visited, null) ?? { id: 'empty', value: '∅' })
    .commit();

  return rec.build();
}

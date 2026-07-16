// BST 恢复 · 录制帧序列

import type { Frame, TreeNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { recoverTree, inorder, BstNode } from './impl.ts';

export const DEFAULT_INPUT = {
  // 构造一棵两个节点被换的 BST：3 和 1 互换
  // 正确应为 1,2,3；构造为 3,2,1 形态（根 2，左 3，右 1）
  buildBad: (): BstNode => new BstNode(2, new BstNode(3), new BstNode(1)),
};

function toViz(node: BstNode | null, highlight?: Set<number>): TreeNode | undefined {
  if (node === null) return undefined;
  return {
    id: String(node.value),
    value: node.value,
    role: highlight?.has(node.value) ? 'final' : 'default',
    children: [node.left, node.right]
      .filter((c): c is BstNode => c !== null)
      .map((c) => toViz(c, highlight)!),
  };
}

export function buildTrace(input: { root?: BstNode } = {}): Frame[] {
  const rec = new TraceRecorder();
  const root = input.root ?? DEFAULT_INPUT.buildBad();

  rec
    .begin({
      zh: `中序：[${inorder(root).join(', ')}]（应严格递增）`,
      en: `Inorder: [${inorder(root).join(', ')}] (should be strictly increasing)`,
    })
    .setTree(toViz(root) ?? { id: 'empty', value: '', children: [] })
    .commit();

  const swapped = new Set<number>();
  const result = recoverTree(root, {
    onInversion: (prev, current, firstSet) => {
      swapped.add(prev);
      swapped.add(current);
      rec
        .begin({
          zh: `逆序：${prev} > ${current}${firstSet ? '（首个逆序）' : ''}`,
          en: `Inversion: ${prev} > ${current}${firstSet ? ' (first)' : ''}`,
        })
        .setTree(toViz(root, swapped) ?? { id: 'empty', value: '', children: [] })
        .setAux([
          { label: 'prev', value: String(prev), role: 'compare' },
          { label: 'current', value: String(current), role: 'compare' },
        ])
        .commit();
    },
    onSwap: (a, b) => {
      rec
        .begin({ zh: `交换 ${a} 与 ${b}`, en: `Swap ${a} and ${b}` })
        .setAux([
          { label: 'A', value: String(a), role: 'compare' },
          { label: 'B', value: String(b), role: 'compare' },
        ])
        .commit();
    },
  });

  rec
    .begin({
      zh: `恢复后中序：[${inorder(root).join(', ')}]`,
      en: `Recovered inorder: [${inorder(root).join(', ')}]`,
    })
    .setTree(toViz(root) ?? { id: 'empty', value: '', children: [] })
    .setAux([
      {
        label: '结果',
        value: result ? `交换 ${result[0]} ↔ ${result[1]}` : '无需恢复',
        role: 'final',
      },
    ])
    .commit();

  return rec.build();
}

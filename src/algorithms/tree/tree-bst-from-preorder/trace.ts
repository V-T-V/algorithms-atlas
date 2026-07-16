// BST 从前序构造 · 录制帧序列

import type { Frame, TreeNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { bstFromPreorder, preorder, BstNode } from './impl.ts';

export const DEFAULT_INPUT = { preorder: [50, 30, 20, 40, 70, 60, 80] };

function toViz(node: BstNode | null, created: Set<number>): TreeNode | undefined {
  if (node === null) return undefined;
  return {
    id: String(node.value),
    value: node.value,
    role: created.has(node.value) ? 'compare' : 'default',
    children: [node.left, node.right]
      .filter((c): c is BstNode => c !== null)
      .map((c) => toViz(c, created)!),
  };
}

export function buildTrace(input: { preorder: number[] } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { preorder: pre } = input;

  rec
    .begin({ zh: `前序：[${pre.join(', ')}]`, en: `Preorder: [${pre.join(', ')}]` })
    .setAux([{ label: '长度', value: String(pre.length), role: 'frontier' }])
    .commit();

  const created = new Set<number>();
  const root = bstFromPreorder(pre, {
    onCreate: (value, bound) => {
      created.add(value);
      rec
        .begin({
          zh: `创建节点 ${value}，约束 ${bound}`,
          en: `Create node ${value}, bound ${bound}`,
        })
        .setTree(toViz(root, created) ?? { id: 'empty', value: '', children: [] })
        .setAux([{ label: '新节点', value: String(value), role: 'pivot' }])
        .commit();
    },
  });

  rec
    .begin({
      zh: `完成。重建后前序：[${preorder(root).join(', ')}]`,
      en: `Done. Reconstructed preorder: [${preorder(root).join(', ')}]`,
    })
    .setTree(toViz(root, created) ?? { id: 'empty', value: '', children: [] })
    .setAux([{ label: '结果', value: preorder(root).join(', '), role: 'final' }])
    .commit();

  return rec.build();
}

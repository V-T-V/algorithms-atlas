// AVL 旋转 · 录制帧序列

import type { Frame, TreeNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildAVL, height, balanceFactor, inorder, AvlNode } from './impl.ts';

export const DEFAULT_INPUT = { keys: [10, 20, 30, 40, 50, 25] };

function toViz(node: AvlNode | null, rotatedAt?: number): TreeNode | undefined {
  if (node === null) return undefined;
  return {
    id: String(node.value),
    value: `${node.value}(${balanceFactor(node)})`,
    role: rotatedAt === node.value ? 'final' : 'default',
    children: [node.left, node.right]
      .filter((c): c is AvlNode => c !== null)
      .map((c) => toViz(c, rotatedAt)!),
  };
}

export function buildTrace(input: { keys: number[] } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { keys } = input;

  rec
    .begin({ zh: `AVL 插入 ${keys.length} 个键`, en: `AVL insert ${keys.length} keys` })
    .setAux([{ label: '键数', value: String(keys.length), role: 'frontier' }])
    .commit();

  let lastRotated = -1;
  let root = buildAVL(keys, {
    onRotate: (kind, at) => {
      lastRotated = at;
      rec
        .begin({
          zh: `${kind} 旋转（在 ${at}）`,
          en: `${kind} rotation (at ${at})`,
        })
        .setAux([
          { label: '类型', value: kind, role: 'compare' },
          { label: '位置', value: String(at), role: 'pivot' },
        ])
        .commit();
    },
  });

  // 重建完整树以显示最终结构
  root = buildAVL(keys);
  rec
    .begin({ zh: `最终高度 = ${height(root)}`, en: `Final height = ${height(root)}` })
    .setTree(toViz(root, lastRotated) ?? { id: 'empty', value: '', children: [] })
    .setAux([
      { label: '高度', value: String(height(root)), role: 'final' },
      { label: '中序', value: inorder(root).join(', '), role: 'final' },
    ])
    .commit();

  return rec.build();
}

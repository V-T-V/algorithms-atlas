// BST 插入 · 录制帧序列

import type { Frame, TreeNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildBST, BstNode } from './impl.ts';

export const DEFAULT_INPUT = { keys: [50, 30, 70, 20, 40, 60, 80] };

/** 把算法 BstNode 转为可视化 TreeNode，高亮 last。 */
function toViz(node: BstNode | null, highlight?: number): TreeNode | undefined {
  if (node === null) return undefined;
  return {
    id: String(node.value),
    value: node.value,
    role: highlight === node.value ? 'final' : 'default',
    children: [
      node.left ? toViz(node.left, highlight)! : undefined,
      node.right ? toViz(node.right, highlight)! : undefined,
    ].filter((c): c is TreeNode => c !== undefined),
  };
}

export function buildTrace(input: { keys: number[] } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { keys } = input;

  rec
    .begin({ zh: `BST 插入 ${keys.length} 个键`, en: `BST insert ${keys.length} keys` })
    .setAux([{ label: '键数', value: String(keys.length), role: 'frontier' }])
    .commit();

  let current: BstNode | null = null;
  for (let i = 0; i < keys.length; i++) {
    const k = keys[i]!;
    // 重建累积树（保证渲染完整结构）
    current = buildBST(keys.slice(0, i + 1));
    rec
      .begin({ zh: `插入 ${k}`, en: `Insert ${k}` })
      .setTree(toViz(current, k) ?? { id: 'empty', value: '', children: [] })
      .setAux([{ label: '插入键', value: String(k), role: 'pivot' }])
      .commit();
  }

  rec
    .begin({ zh: '完成', en: 'Done' })
    .setTree(toViz(current) ?? { id: 'empty', value: '', children: [] })
    .setAux([{ label: '状态', value: '完成', role: 'final' }])
    .commit();

  return rec.build();
}

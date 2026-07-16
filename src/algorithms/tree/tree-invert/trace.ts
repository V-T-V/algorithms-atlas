// =============================================================================
// 翻转二叉树 · 录制帧序列
// =============================================================================

import type { BarRole, Frame, TreeNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { invertTree, buildTree, type BTNode, type InvertHooks } from './impl.ts';

export const DEFAULT_INPUT = [4, 2, 7, 1, 3, 6, 9];

function toViz(node: BTNode | null, swapping: number | null, prefix = 'n'): TreeNode | null {
  if (!node) return null;
  const id = `${prefix}-${node.value}`;
  const role: BarRole = node.value === swapping ? 'swap' : 'default';
  return {
    id,
    value: node.value,
    role,
    children: [node.left, node.right]
      .map((c, i) => toViz(c, swapping, `${id}-${i}`) ?? undefined)
      .filter((x): x is TreeNode => x !== undefined),
  };
}

/** 录制演示帧序列。 */
export function buildTrace(input: Array<number | null> = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const root = buildTree(input);
  let swapping: number | null = null;

  rec
    .begin({ zh: '初始二叉树', en: 'Initial tree' })
    .setTree(toViz(root, swapping) ?? { id: 'empty', value: '∅' })
    .commit();

  const hooks: InvertHooks = {
    onSwap: (v) => {
      swapping = v;
      rec
        .begin({ zh: `交换节点 ${v} 的左右子树`, en: `Swap children of node ${v}` })
        // 注意：invertTree 操作的是克隆树，本帧展示原树仅作位置参考
        .setTree(toViz(root, swapping) ?? { id: 'empty', value: '∅' })
        .commit();
    },
  };

  const inverted = invertTree(root, hooks);

  rec
    .begin({ zh: '翻转完成（镜像）', en: 'Inverted (mirror)' })
    .setTree(toViz(inverted, null) ?? { id: 'empty', value: '∅' })
    .commit();

  return rec.build();
}

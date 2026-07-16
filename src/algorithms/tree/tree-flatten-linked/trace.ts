// =============================================================================
// 展开为链表 · 录制帧序列
// =============================================================================

import type { BarRole, Frame, TreeNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { flattenToLinked, buildTree, type BTNode, type FlattenHooks } from './impl.ts';

export const DEFAULT_INPUT = [1, 2, 5, 3, 4, null, 6];

function toViz(node: BTNode | null, splicing: number | null, prefix = 'n'): TreeNode | null {
  if (!node) return null;
  const id = `${prefix}-${node.value}`;
  const role: BarRole = node.value === splicing ? 'swap' : 'default';
  return {
    id,
    value: node.value,
    role,
    children: [node.left, node.right]
      .map((c, i) => toViz(c, splicing, `${id}-${i}`) ?? undefined)
      .filter((x): x is TreeNode => x !== undefined),
  };
}

/** 录制演示帧序列。 */
export function buildTrace(input: Array<number | null> = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const root = buildTree(input);
  let splicing: number | null = null;

  rec
    .begin({ zh: '初始二叉树', en: 'Initial tree' })
    .setTree(toViz(root, splicing) ?? { id: 'empty', value: '∅' })
    .commit();

  const hooks: FlattenHooks = {
    onSplice: (v) => {
      splicing = v;
      rec
        .begin({ zh: `把节点 ${v} 的左链插入右侧`, en: `Splice left chain under node ${v}` })
        .setTree(toViz(root, splicing) ?? { id: 'empty', value: '∅' })
        .commit();
    },
  };

  const flat = flattenToLinked(root, hooks);

  rec
    .begin({ zh: '展开完成（前序单链表）', en: 'Flattened (preorder right list)' })
    .setTree(toViz(flat, null) ?? { id: 'empty', value: '∅' })
    .commit();

  return rec.build();
}

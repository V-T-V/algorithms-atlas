// =============================================================================
// AVL 平衡二叉树 · 录制帧序列
// 用 setTree 展示树的当前形态；每次插入（及随之的旋转）后重建快照。
// 录制策略：对输入前缀 [0..k] 逐次整体插入，借 hooks 捕获旋转事件。
// =============================================================================

import type { Frame, TreeNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { avlInsert, type AVLHooks, type AVLNode } from './impl.ts';

export const DEFAULT_INPUT = [10, 20, 30, 40, 50, 25];

/** 把 AVLNode 转成 viz 用的 TreeNode（带唯一 id）。 */
function toViz(node: AVLNode | null, prefix = 'n'): TreeNode | null {
  if (!node) return null;
  const id = `${prefix}-${node.value}`;
  return {
    id,
    value: node.value,
    role: 'default',
    children: [node.left, node.right]
      .map((c, i) => toViz(c, `${id}-${i}`) ?? undefined)
      .filter((x): x is TreeNode => x !== undefined),
  };
}

/** 录制演示帧序列。 */
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  let root: AVLNode | null = null;

  rec
    .begin({ zh: '空树，开始插入', en: 'Empty tree, start inserting' })
    .setTree({ id: 'empty', value: '∅' })
    .commit();

  for (let k = 1; k <= input.length; k++) {
    const prefix = input.slice(0, k);
    const v = input[k - 1]!;
    let rotateNote: { zh: string; en: string } | null = null;
    const hooks: AVLHooks = {
      onRotate: (type, pivot) => {
        rotateNote = {
          zh: `插入 ${v} 导致失衡 → ${type} 旋转（围绕 ${pivot}）`,
          en: `Insert ${v} caused imbalance → ${type} rotation (around ${pivot})`,
        };
      },
    };
    root = avlInsert(prefix, hooks);
    rec
      .begin(
        rotateNote ?? {
          zh: `插入 ${v}，树仍平衡`,
          en: `Insert ${v}, tree remains balanced`,
        },
      )
      .setTree(toViz(root) ?? { id: 'empty', value: '∅' })
      .commit();
  }

  // 终态：标记所有节点为 final
  const markFinal = (n: AVLNode | null): TreeNode | null => {
    if (!n) return null;
    return {
      id: `f-${n.value}`,
      value: n.value,
      role: 'final',
      children: [n.left, n.right]
        .map((c) => markFinal(c) ?? undefined)
        .filter((x): x is TreeNode => x !== undefined),
    };
  };
  rec
    .begin({ zh: 'AVL 树构建完成（高度平衡）', en: 'AVL tree built (height-balanced)' })
    .setTree(markFinal(root) ?? { id: 'empty', value: '∅' })
    .commit();

  return rec.build();
}

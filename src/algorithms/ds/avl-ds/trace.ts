// =============================================================================
// AVL 数据结构 · 录制帧序列
// 用 setTree 展示当前树形态；每次插入（及随之的旋转）后重建快照。
// 旋转点标记 role:'pivot'，完成后根标 'final'。
// =============================================================================

import type { BarRole, Frame, TreeNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { AVLTree, type AVLDSHooks, type AVLDSNode } from './impl.ts';

export const DEFAULT_INPUT = [10, 20, 30, 40, 50, 25, 5];

/** 把 AVLDSNode 转成 viz TreeNode（带唯一 id）。pivotNodes 标记旋转涉及节点。 */
function toViz(node: AVLDSNode | null, prefix: string, pivot: number | null): TreeNode | null {
  if (!node) return null;
  const id = `${prefix}-${node.value}`;
  const role: BarRole | undefined = node.value === pivot ? 'pivot' : undefined;
  const children: TreeNode[] = [];
  const l = toViz(node.left, `${id}-L`, pivot);
  const r = toViz(node.right, `${id}-R`, pivot);
  if (l) children.push(l);
  if (r) children.push(r);
  return {
    id,
    value: node.value,
    role,
    children: children.length ? children : undefined,
  };
}

/** 录制演示帧序列。 */
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const tree = new AVLTree();

  rec
    .begin({ zh: '空树，开始插入', en: 'Empty tree, start inserting' })
    .setTree({ id: 'empty', value: '∅' })
    .commit();

  for (const v of input) {
    let pivot: number | null = null;
    let rotType: string | null = null;
    const hooks: AVLDSHooks = {
      onRotate: (type, p) => {
        rotType = type;
        pivot = p;
      },
    };
    const inserted = tree.insert(v, hooks);
    void inserted;
    rec
      .begin(
        rotType
          ? {
              zh: `插入 ${v} → ${rotType} 旋转（围绕 ${pivot}）`,
              en: `Insert ${v} → ${rotType} rotation (around ${pivot})`,
            }
          : {
              zh: `插入 ${v}，树仍平衡`,
              en: `Insert ${v}, tree balanced`,
            },
      )
      .setTree(toViz(tree.root, 'n', pivot) ?? { id: 'empty', value: '∅' })
      .commit();
  }

  // 终态：所有节点标 final
  const markFinal = (n: AVLDSNode | null): TreeNode | null => {
    if (!n) return null;
    const children: TreeNode[] = [];
    const l = markFinal(n.left);
    const r = markFinal(n.right);
    if (l) children.push(l);
    if (r) children.push(r);
    return {
      id: `f-${n.value}`,
      value: n.value,
      role: 'final',
      children: children.length ? children : undefined,
    };
  };
  rec
    .begin({
      zh: `AVL 构建完成（高 ${tree.height()}，共 ${tree.size} 个节点，平衡=${tree.isValid()})`,
      en: `AVL built (height ${tree.height()}, ${tree.size} nodes, balanced=${tree.isValid()})`,
    })
    .setTree(markFinal(tree.root) ?? { id: 'empty', value: '∅' })
    .commit();

  return rec.build();
}

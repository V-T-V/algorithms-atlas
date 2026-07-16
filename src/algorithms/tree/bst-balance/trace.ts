// 平衡 BST · 录制帧序列
// 用 setTree 展示：原始（退化为链）→ 中序数组 → 重建平衡。

import type { BarRole, Frame, TreeNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { bstBalance, isBalanced, height, type BSTNode, type BalanceHooks } from './impl.ts';

export const DEFAULT_INPUT = [1, 2, 3, 4, 5, 6, 7]; // 顺序插入 → 退化为右斜链

/** 把 BSTNode 转 viz TreeNode，全部标 default（或给定角色）。 */
function toViz(node: BSTNode | null, role: BarRole = 'default', prefix = 'n'): TreeNode | null {
  if (!node) return null;
  const id = `${prefix}-${node.value}`;
  return {
    id,
    value: node.value,
    role,
    children: [node.left, node.right]
      .map((c, i) => toViz(c, role, `${id}-${i}`) ?? undefined)
      .filter((x): x is TreeNode => x !== undefined),
  };
}

/** 顺序插入构建退化 BST（右斜链）。 */
function buildDegenerate(values: readonly number[]): BSTNode | null {
  if (values.length === 0) return null;
  const root: BSTNode = { value: values[0]!, left: null, right: null };
  let cur = root;
  for (let i = 1; i < values.length; i++) {
    cur.right = { value: values[i]!, left: null, right: null };
    cur = cur.right;
  }
  return root;
}

export function buildTrace(input: readonly number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const root = buildDegenerate(input);

  rec
    .begin({
      zh: `顺序插入 ${input.join(', ')}，BST 退化为右斜链（高 ${height(root)}）`,
      en: `Sequential insert ${input.join(', ')} degrades BST to a right chain (height ${height(root)})`,
    })
    .setTree(toViz(root, 'warn') ?? { id: 'empty', value: '∅' })
    .commit();

  const collected: number[] = [];
  const hooks: BalanceHooks = {
    onCollect: (v) => {
      collected.push(v);
    },
  };

  const balanced = bstBalance(root, hooks);

  // 中序数组帧
  rec
    .begin({
      zh: `中序遍历得升序数组：[${collected.join(', ')}]`,
      en: `Inorder yields sorted array: [${collected.join(', ')}]`,
    })
    .setAux(
      collected.map((v, i) => ({
        label: `[${i}]`,
        value: String(v),
        role: 'compare' as BarRole,
      })),
    )
    .commit();

  // 重建后的平衡树
  rec
    .begin({
      zh: `二分取中点重建：高度 ${height(balanced)}，平衡 ${isBalanced(balanced) ? '✓' : '✗'}`,
      en: `Rebuild by midpoint bisection: height ${height(balanced)}, balanced ${isBalanced(balanced) ? '✓' : '✗'}`,
    })
    .setTree(toViz(balanced, 'final') ?? { id: 'empty', value: '∅' })
    .commit();

  return rec.build();
}

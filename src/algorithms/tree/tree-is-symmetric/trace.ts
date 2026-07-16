// =============================================================================
// 对称二叉树 · 录制帧序列
// =============================================================================

import type { BarRole, Frame, TreeNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { isSymmetric, buildTree, type BTNode, type SymmetricHooks } from './impl.ts';

export const DEFAULT_INPUT = [1, 2, 2, 3, 4, 4, 3];

function toViz(node: BTNode | null, comparing: Set<number>, prefix = 'n'): TreeNode | null {
  if (!node) return null;
  const id = `${prefix}-${node.value}`;
  const role: BarRole = comparing.has(node.value) ? 'compare' : 'default';
  return {
    id,
    value: node.value,
    role,
    children: [node.left, node.right]
      .map((c, i) => toViz(c, comparing, `${id}-${i}`) ?? undefined)
      .filter((x): x is TreeNode => x !== undefined),
  };
}

/** 录制演示帧序列。 */
export function buildTrace(input: Array<number | null> = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const root = buildTree(input);
  const comparing = new Set<number>();

  rec
    .begin({ zh: '判定二叉树是否对称', en: 'Check tree symmetry' })
    .setTree(toViz(root, comparing) ?? { id: 'empty', value: '∅' })
    .commit();

  const hooks: SymmetricHooks = {
    onCompare: (a, b) => {
      comparing.clear();
      if (a !== null) comparing.add(a);
      if (b !== null) comparing.add(b);
      rec
        .begin({ zh: `比较镜像对 ${a} ↔ ${b}`, en: `Compare mirror pair ${a} ↔ ${b}` })
        .setTree(toViz(root, comparing) ?? { id: 'empty', value: '∅' })
        .commit();
    },
    onDone: (sym) => {
      comparing.clear();
      rec
        .begin({
          zh: `结果：${sym ? '对称' : '不对称'}`,
          en: `Result: ${sym ? 'symmetric' : 'not symmetric'}`,
        })
        .setTree(toViz(root, comparing) ?? { id: 'empty', value: '∅' })
        .setAux([{ label: '对称', value: sym ? '是' : '否', role: sym ? 'final' : 'warn' }])
        .commit();
    },
  };

  isSymmetric(root, hooks);

  return rec.build();
}

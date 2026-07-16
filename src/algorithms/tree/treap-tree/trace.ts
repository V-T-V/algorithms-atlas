// =============================================================================
// 树堆（树类视角）· 录制帧序列
// 用 setTree 展示分裂/合并式 Treap 形态；value 显示「key·priority」，根标 final。
// =============================================================================

import type { Frame, TreeNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { treapTreeInsert, type TreapTreeHooks, type TreapTreeNode } from './impl.ts';

export const DEFAULT_INPUT = [10, 20, 30, 40, 50, 25, 5, 15];

/** 把节点转成 viz TreeNode，value 显示「key·priority」。 */
function toViz(
  node: TreapTreeNode | null,
  prefix: string,
  highlight: { keys: Set<number>; role: 'compare' | 'pivot' } | null,
): TreeNode | null {
  if (!node) return null;
  const id = `${prefix}-${node.key}`;
  let role: TreeNode['role'] = 'default';
  if (highlight && highlight.keys.has(node.key)) role = highlight.role;
  return {
    id,
    value: `${node.key}·${node.priority}`,
    role,
    children: [node.left, node.right]
      .map((c, i) => toViz(c, `${id}-${i}`, highlight) ?? undefined)
      .filter((x): x is TreeNode => x !== undefined),
  };
}

/** 录制演示帧序列。 */
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  let root: TreapTreeNode | null = null;

  rec
    .begin({ zh: '空树，开始插入（分裂/合并式）', en: 'Empty tree, start inserting (split/merge)' })
    .setTree({ id: 'empty', value: '∅' })
    .commit();

  for (let k = 1; k <= input.length; k++) {
    const prefix = input.slice(0, k);
    const v = input[k - 1]!;
    const activeKeys = new Set<number>();
    let splitCount = 0;
    let mergeCount = 0;
    const hooks: TreapTreeHooks = {
      onInsert: () => {
        activeKeys.add(v);
      },
      onSplit: () => {
        splitCount++;
        activeKeys.add(v);
      },
      onMerge: (_l, _r, newRoot) => {
        mergeCount++;
        activeKeys.add(newRoot);
      },
    };
    root = treapTreeInsert(prefix, hooks, { seed: 20240601 });

    const note =
      splitCount + mergeCount > 0
        ? {
            zh: `插入 ${v}：分裂 ${splitCount} 次 + 合并 ${mergeCount} 次`,
            en: `Insert ${v}: ${splitCount} splits + ${mergeCount} merges`,
          }
        : { zh: `插入 ${v}（优先级见节点）`, en: `Insert ${v} (priority on node)` };
    rec
      .begin(note)
      .setTree(toViz(root, 'n', { keys: activeKeys, role: 'pivot' }) ?? { id: 'empty', value: '∅' })
      .commit();
  }

  // 终态：根标 final
  const markFinal = (n: TreapTreeNode | null, prefix: string): TreeNode | null => {
    if (!n) return null;
    return {
      id: `${prefix}-${n.key}`,
      value: `${n.key}·${n.priority}`,
      role: 'final',
      children: [n.left, n.right]
        .map((c, i) => markFinal(c, `${prefix}-${n.key}-${i}`) ?? undefined)
        .filter((x): x is TreeNode => x !== undefined),
    };
  };
  rec
    .begin({
      zh: 'Treap 构建完成（分裂/合并式，BST 序 + 堆序）',
      en: 'Treap built (split/merge, BST + heap order)',
    })
    .setTree(markFinal(root, 'f') ?? { id: 'empty', value: '∅' })
    .commit();

  return rec.build();
}

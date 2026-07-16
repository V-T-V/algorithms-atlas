// =============================================================================
// 树堆 · 录制帧序列
// 用 setTree 展示树形态；value 显示「key/priority」，旋转点标 pivot，根标 final。
// =============================================================================

import type { Frame, TreeNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { treapInsert, type TreapHooks, type TreapNode } from './impl.ts';

export const DEFAULT_INPUT = [10, 20, 30, 40, 50, 25, 5, 15];

/** 把 TreapNode 转成 viz TreeNode，value 显示「key 优先级」。 */
function toViz(
  node: TreapNode | null,
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
  let root: TreapNode | null = null;

  rec
    .begin({ zh: '空树，开始插入', en: 'Empty tree, start inserting' })
    .setTree({ id: 'empty', value: '∅' })
    .commit();

  for (let k = 1; k <= input.length; k++) {
    const prefix = input.slice(0, k);
    const v = input[k - 1]!;
    let rotateNote: { zh: string; en: string } | null = null;
    const rotatedKeys = new Set<number>();
    const insertedKey = { value: -1 };
    const hooks: TreapHooks = {
      onInsert: (key) => {
        insertedKey.value = key;
      },
      onRotate: (type, pivot) => {
        rotatedKeys.add(pivot);
        rotateNote = {
          zh: `插入 ${v} 破坏堆序 → ${type === 'right' ? '右' : '左'}旋（围绕 ${pivot}）`,
          en: `Insert ${v} broke heap order → ${type} rotation (around ${pivot})`,
        };
      },
    };
    root = treapInsert(prefix, hooks, { seed: 20240601 });

    const highlight = rotateNote
      ? { keys: rotatedKeys, role: 'pivot' as const }
      : { keys: new Set<number>([insertedKey.value]), role: 'compare' as const };
    rec
      .begin(
        rotateNote ?? {
          zh: `插入 ${v}（优先级见节点）`,
          en: `Insert ${v} (priority shown on node)`,
        },
      )
      .setTree(toViz(root, 'n', highlight) ?? { id: 'empty', value: '∅' })
      .commit();
  }

  // 终态：根标 final
  const markFinal = (n: TreapNode | null, prefix: string): TreeNode | null => {
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
    .begin({ zh: 'Treap 构建完成（BST 序 + 堆序）', en: 'Treap built (BST order + heap order)' })
    .setTree(markFinal(root, 'f') ?? { id: 'empty', value: '∅' })
    .commit();

  return rec.build();
}

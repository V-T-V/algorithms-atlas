// =============================================================================
// 替罪羊树 · 录制帧序列
// 用 setTree 展示树形态；新插入标 compare，重构替罪羊标 pivot，根标 final。
// =============================================================================

import type { Frame, TreeNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { scapegoatInsert, type ScapegoatHooks, type SGNode } from './impl.ts';

export const DEFAULT_INPUT = [10, 20, 30, 40, 50, 25, 5, 15];

/** 把 SGNode 转成 viz TreeNode。 */
function toViz(
  node: SGNode | null,
  prefix: string,
  highlight: { keys: Set<number>; role: 'compare' | 'pivot' } | null,
): TreeNode | null {
  if (!node) return null;
  const id = `${prefix}-${node.key}`;
  let role: TreeNode['role'] = 'default';
  if (highlight && highlight.keys.has(node.key)) role = highlight.role;
  return {
    id,
    value: node.key,
    role,
    children: [node.left, node.right]
      .map((c, i) => toViz(c, `${id}-${i}`, highlight) ?? undefined)
      .filter((x): x is TreeNode => x !== undefined),
  };
}

/** 录制演示帧序列。 */
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  let root: SGNode | null = null;

  rec
    .begin({ zh: '空树，开始插入', en: 'Empty tree, start inserting' })
    .setTree({ id: 'empty', value: '∅' })
    .commit();

  for (let k = 1; k <= input.length; k++) {
    const prefix = input.slice(0, k);
    const v = input[k - 1]!;
    let rebuildNote: { zh: string; en: string } | null = null;
    const rebuiltKeys = new Set<number>();
    const insertedKey = { value: -1 };
    const hooks: ScapegoatHooks = {
      onInsert: (key) => {
        insertedKey.value = key;
      },
      onRebuild: (scapegoatKey, sz) => {
        rebuiltKeys.add(scapegoatKey);
        rebuildNote = {
          zh: `插入 ${v} 导致 α 失衡 → 重建以 ${scapegoatKey} 为根的子树（${sz} 个节点）`,
          en: `Insert ${v} broke α-balance → rebuild subtree rooted at ${scapegoatKey} (${sz} nodes)`,
        };
      },
    };
    root = scapegoatInsert(prefix, hooks);

    const highlight = rebuildNote
      ? { keys: rebuiltKeys, role: 'pivot' as const }
      : { keys: new Set<number>([insertedKey.value]), role: 'compare' as const };
    rec
      .begin(
        rebuildNote ?? {
          zh: `插入 ${v}，树仍 α 平衡`,
          en: `Insert ${v}, tree still α-balanced`,
        },
      )
      .setTree(toViz(root, 'n', highlight) ?? { id: 'empty', value: '∅' })
      .commit();
  }

  // 终态：根标 final
  const markFinal = (n: SGNode | null, prefix: string): TreeNode | null => {
    if (!n) return null;
    return {
      id: `${prefix}-${n.key}`,
      value: n.key,
      role: 'final',
      children: [n.left, n.right]
        .map((c, i) => markFinal(c, `${prefix}-${n.key}-${i}`) ?? undefined)
        .filter((x): x is TreeNode => x !== undefined),
    };
  };
  rec
    .begin({ zh: '替罪羊树构建完成（α 平衡）', en: 'Scapegoat tree built (α-balanced)' })
    .setTree(markFinal(root, 'f') ?? { id: 'empty', value: '∅' })
    .commit();

  return rec.build();
}

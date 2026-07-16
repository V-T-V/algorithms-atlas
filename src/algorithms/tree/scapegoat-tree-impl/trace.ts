// =============================================================================
// 替罪羊树 · 录制帧序列
// 用 setTree 展示：逐个插入 → 失衡 → 找替罪羊 → 重建。
// =============================================================================

import type { BarRole, Frame, TreeNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { scapegoatInsert, height, type SGNode, type ScapegoatTreeHooks } from './impl.ts';

export const DEFAULT_INPUT = [1, 2, 3, 4, 5, 6, 7];

/** SGNode → viz TreeNode。 */
function toViz(node: SGNode | null, role: BarRole = 'default', prefix = 'n'): TreeNode | null {
  if (!node) return null;
  const id = `${prefix}-${node.key}`;
  return {
    id,
    value: node.key,
    role,
    children: [node.left, node.right]
      .map((c, i) => toViz(c, role, `${id}-${i}`) ?? undefined)
      .filter((x): x is TreeNode => x !== undefined),
  };
}

export function buildTrace(input: readonly number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const insertedKeys: number[] = [];
  let root: SGNode | null = null;

  const snap = (
    note: { zh: string; en: string },
    r: SGNode | null,
    role: BarRole = 'default',
  ): void => {
    rec
      .begin(note)
      .setTree(toViz(r, role) ?? { id: 'empty', value: '∅' })
      .setAux([
        { label: '已插入', value: `[${insertedKeys.join(', ')}]`, role: 'compare' as BarRole },
        { label: '高度', value: String(height(r)) },
      ])
      .commit();
  };

  snap({ zh: '空替罪羊树', en: 'Empty scapegoat tree' }, null);

  for (const k of input) {
    const hooks: ScapegoatTreeHooks = {
      onScapegoat: (nodeKey) => {
        snap(
          {
            zh: `插入 ${k} 触发失衡：替罪羊 = ${nodeKey}`,
            en: `Insert ${k} causes imbalance: scapegoat = ${nodeKey}`,
          },
          root,
          'warn',
        );
      },
      onRebuild: (rootKey) => {
        snap(
          {
            zh: `重建以 ${rootKey} 为根的子树`,
            en: `Rebuild subtree rooted at ${rootKey}`,
          },
          root,
          'compare',
        );
      },
    };
    root = scapegoatInsert(root, k, hooks);
    insertedKeys.push(k);
    snap(
      {
        zh: `插入 ${k} 后的树形（高度 ${height(root)}）`,
        en: `Tree after inserting ${k} (height ${height(root)})`,
      },
      root,
      'final',
    );
  }

  snap(
    {
      zh: `全部插入完成：高度 ${height(root)}`,
      en: `All insertions done: height ${height(root)}`,
    },
    root,
    'final',
  );

  return rec.build();
}

// =============================================================================
// 旋转式 Treap · 录制帧序列
// 用 setTree 展示：逐个插入 → 旋转 → 平衡 → 删除。
// =============================================================================

import type { BarRole, Frame, TreeNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import {
  treapInsert,
  treapDelete,
  height,
  isTreap,
  resetSeed,
  type TreapNode,
  type TreapDSHooks,
} from './impl.ts';

export const DEFAULT_INPUT = {
  insert: [5, 3, 8, 1, 4, 7, 9, 2, 6],
  delete: [3, 5],
};

/** TreapNode → viz TreeNode。 */
function toViz(node: TreapNode | null, role: BarRole = 'default', prefix = 'n'): TreeNode | null {
  if (!node) return null;
  const id = `${prefix}-${node.key}`;
  return {
    id,
    value: `${node.key}`,
    role,
    children: [node.left, node.right]
      .map((c, i) => toViz(c, role, `${id}-${i}`) ?? undefined)
      .filter((x): x is TreeNode => x !== undefined),
  };
}

export function buildTrace(input: { insert: number[]; delete: number[] } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  resetSeed(20240601);
  const inserted: number[] = [];
  let root: TreapNode | null = null;

  const snap = (
    note: { zh: string; en: string },
    r: TreapNode | null,
    role: BarRole = 'default',
  ): void => {
    rec
      .begin(note)
      .setTree(toViz(r, role) ?? { id: 'empty', value: '∅' })
      .setAux([
        { label: '已插入', value: `[${inserted.join(', ')}]`, role: 'compare' as BarRole },
        { label: '高度', value: String(height(r)) },
        { label: '合法 Treap', value: isTreap(r) ? '✓' : '✗', role: 'final' as BarRole },
      ])
      .commit();
  };

  snap({ zh: '空 Treap', en: 'Empty treap' }, null);

  // 插入阶段
  for (const k of input.insert) {
    const hooks: TreapDSHooks = {
      onRotate: (dir, atKey) => {
        snap(
          {
            zh: `插入 ${k} 后${dir === 'left' ? '左' : '右'}旋 @ ${atKey}`,
            en: `After inserting ${k}: ${dir} rotate @ ${atKey}`,
          },
          root,
          'warn',
        );
      },
    };
    root = treapInsert(root, k, hooks);
    inserted.push(k);
    snap(
      {
        zh: `插入 ${k} 后（高度 ${height(root)}）`,
        en: `After inserting ${k} (height ${height(root)})`,
      },
      root,
      'final',
    );
  }

  // 删除阶段
  for (const k of input.delete) {
    const hooks: TreapDSHooks = {
      onRotate: (dir, atKey) => {
        snap(
          {
            zh: `删除 ${k} 时${dir === 'left' ? '左' : '右'}旋 @ ${atKey}`,
            en: `Deleting ${k}: ${dir} rotate @ ${atKey}`,
          },
          root,
          'swap',
        );
      },
    };
    root = treapDelete(root, k, hooks);
    snap(
      {
        zh: `删除 ${k} 后（高度 ${height(root)}）`,
        en: `After deleting ${k} (height ${height(root)})`,
      },
      root,
      'final',
    );
  }

  snap(
    {
      zh: `完成：高度 ${height(root)}，剩余 ${inserted.length - input.delete.length} 节点`,
      en: `Done: height ${height(root)}, ${inserted.length - input.delete.length} nodes left`,
    },
    root,
    'final',
  );

  return rec.build();
}

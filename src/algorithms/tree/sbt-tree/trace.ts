// =============================================================================
// 尺寸平衡树 · 录制帧序列
// 用 setTree 展示：逐个插入 → 旋转 → 平衡。
// =============================================================================

import type { BarRole, Frame, TreeNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { sbtInsert, height, type SBTNode, type SBTHooks } from './impl.ts';

export const DEFAULT_INPUT = [1, 2, 3, 4, 5, 6, 7];

/** SBTNode → viz TreeNode。 */
function toViz(node: SBTNode | null, role: BarRole = 'default', prefix = 'n'): TreeNode | null {
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
  let root: SBTNode | null = null;

  const snap = (
    note: { zh: string; en: string },
    r: SBTNode | null,
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

  snap({ zh: '空 SBT', en: 'Empty SBT' }, null);

  for (const k of input) {
    const hooks: SBTHooks = {
      onRotate: (dir, newRootKey) => {
        snap(
          {
            zh: `插入 ${k} 后${dir === 'left' ? '左' : '右'}旋，新子根 = ${newRootKey}`,
            en: `After inserting ${k}: ${dir} rotate, new sub-root = ${newRootKey}`,
          },
          root,
          'warn',
        );
      },
    };
    root = sbtInsert(root, k, hooks);
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

// =============================================================================
// AA 树 · 录制帧序列
// 用 setTree 展示：逐个插入 → skew/split → 平衡。
// =============================================================================

import type { BarRole, Frame, TreeNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { aaInsert, height, type AANode, type AATreeHooks } from './impl.ts';

export const DEFAULT_INPUT = [10, 4, 20, 2, 6, 15, 30, 1, 3, 5, 8];

/** AANode → viz TreeNode。 */
function toViz(node: AANode | null, role: BarRole = 'default', prefix = 'n'): TreeNode | null {
  if (!node) return null;
  const id = `${prefix}-${node.key}`;
  return {
    id,
    value: `${node.key}(L${node.level})`,
    role,
    children: [node.left, node.right]
      .map((c, i) => toViz(c, role, `${id}-${i}`) ?? undefined)
      .filter((x): x is TreeNode => x !== undefined),
  };
}

export function buildTrace(input: readonly number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const inserted: number[] = [];
  let root: AANode | null = null;

  const snap = (
    note: { zh: string; en: string },
    r: AANode | null,
    role: BarRole = 'default',
  ): void => {
    rec
      .begin(note)
      .setTree(toViz(r, role) ?? { id: 'empty', value: '∅' })
      .setAux([
        { label: '已插入', value: `[${inserted.join(', ')}]`, role: 'compare' as BarRole },
        { label: '高度', value: String(height(r)) },
      ])
      .commit();
  };

  snap({ zh: '空 AA 树', en: 'Empty AA tree' }, null);

  for (const k of input) {
    const hooks: AATreeHooks = {
      onSkew: (atKey) => {
        snap(
          {
            zh: `插入 ${k} 后 skew（右旋修复左倾）@ ${atKey}`,
            en: `After inserting ${k}: skew (fix left link) @ ${atKey}`,
          },
          root,
          'warn',
        );
      },
      onSplit: (atKey) => {
        snap(
          {
            zh: `插入 ${k} 后 split（左旋 + 提 level）@ ${atKey}`,
            en: `After inserting ${k}: split (left rot + raise level) @ ${atKey}`,
          },
          root,
          'swap',
        );
      },
    };
    root = aaInsert(root, k, hooks);
    inserted.push(k);
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

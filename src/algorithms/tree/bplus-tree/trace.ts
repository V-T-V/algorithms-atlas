// =============================================================================
// B+ 树 · 录制帧序列
// 用 setTree 展示多路树形（内部节点 children = BPlusNode[]）。
// =============================================================================

import type { BarRole, Frame, TreeNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { bplusInsert, bplusHeight, leafKeys, type BPlusNode, type BPlusHooks } from './impl.ts';

export const DEFAULT_INPUT = [10, 20, 5, 6, 12, 30, 7, 17, 3, 25, 1, 8, 15, 22, 35];

/** BPlusNode → viz TreeNode（多路 children）。 */
function toViz(node: BPlusNode | null, role: BarRole = 'default', prefix = 'n'): TreeNode | null {
  if (!node) return null;
  const id = `${prefix}`;
  const value = `[${node.keys.join(',')}]`;
  const children: TreeNode[] = [];
  if (!node.isLeaf) {
    node.children.forEach((c, i) => {
      const v = toViz(c, role, `${id}-${i}`);
      if (v) children.push(v);
    });
  }
  return { id, value, role, children };
}

export function buildTrace(input: readonly number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const inserted: number[] = [];
  let root: BPlusNode = { isLeaf: true, keys: [], next: null };

  const snap = (
    note: { zh: string; en: string },
    r: BPlusNode,
    role: BarRole = 'default',
  ): void => {
    rec
      .begin(note)
      .setTree(toViz(r, role) ?? { id: 'empty', value: '∅' })
      .setAux([
        { label: '已插入', value: `[${inserted.join(', ')}]`, role: 'compare' as BarRole },
        { label: '树高', value: String(bplusHeight(r)) },
        { label: '叶子链', value: `[${leafKeys(r).join(', ')}]`, role: 'final' as BarRole },
      ])
      .commit();
  };

  snap({ zh: '空 B+ 树（单个空叶子）', en: 'Empty B+ tree (single empty leaf)' }, root);

  for (const k of input) {
    const hooks: BPlusHooks = {
      onSplitLeaf: (left, right) => {
        snap(
          {
            zh: `插入 ${k} 触发叶子分裂：[${left.join(',')}] | [${right.join(',')}]`,
            en: `Insert ${k} splits leaf: [${left.join(',')}] | [${right.join(',')}]`,
          },
          root,
          'warn',
        );
      },
      onSplitInternal: (upKey) => {
        snap(
          {
            zh: `内部节点分裂：键 ${upKey} 上提`,
            en: `Internal split: key ${upKey} promoted`,
          },
          root,
          'swap',
        );
      },
    };
    root = bplusInsert(root, k, hooks);
    inserted.push(k);
    snap(
      {
        zh: `插入 ${k} 后（树高 ${bplusHeight(root)}）`,
        en: `After inserting ${k} (height ${bplusHeight(root)})`,
      },
      root,
      'final',
    );
  }

  snap(
    {
      zh: `全部插入完成：树高 ${bplusHeight(root)}，叶子 ${leafKeys(root).length} 键`,
      en: `Done: height ${bplusHeight(root)}, ${leafKeys(root).length} keys in leaves`,
    },
    root,
    'final',
  );

  return rec.build();
}

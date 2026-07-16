// =============================================================================
// 二叉搜索树 · 录制帧序列
// 通过 bst 的钩子，把执行过程录成 Frame[]。用 setTree 渲染树结构。
// =============================================================================

import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { BST, toVizTree, type BstInsertHooks, type BstSearchHooks } from './impl.ts';

/** 演示：依次插入一组值，构建 BST，再演示查找。 */
export const DEFAULT_INPUT = {
  insert: [50, 30, 70, 20, 40, 60, 80, 35, 65],
  search: [65, 25], // 一个命中、一个未命中
};

type Viz = NonNullable<ReturnType<typeof toVizTree>>;

/** 录制演示帧序列。 */
export function buildTrace(
  input: { insert: readonly number[]; search?: readonly number[] } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const tree = new BST();
  const highlight = new Set<number>(); // 当前比较路径
  let newlyInserted: number | null = null;
  let searchFound: { value: number; found: boolean } | null = null;

  const render = (note: { zh: string; en: string }): void => {
    const root = toVizTree(tree.root, highlight) as Viz | null;
    // 给新插入/命中节点额外标记
    if (root) markNode(root, newlyInserted, searchFound);
    rec
      .begin(note)
      .setTree(root ?? EMPTY_TREE)
      .commit();
  };

  const markNode = (
    n: Viz,
    inserted: number | null,
    found: { value: number; found: boolean } | null,
  ): void => {
    if (n.value === inserted) n.role = 'final';
    if (found && n.value === found.value && found.found) n.role = 'pivot';
    for (const c of n.children ?? []) markNode(c, inserted, found);
  };

  rec
    .begin({ zh: '空树，开始插入', en: 'Empty tree, start inserting' })
    .setTree(EMPTY_TREE)
    .commit();

  // —— 插入阶段 ——
  const insertHooks: BstInsertHooks = {
    onCompare: (cur, _tgt, dir) => {
      highlight.clear();
      highlight.add(cur);
      render({
        zh: `${dir === 'left' ? '<' : dir === 'right' ? '>' : '='} 比较节点 ${cur}，向${dir === 'left' ? '左' : dir === 'right' ? '右' : '停留'}`,
        en: `${dir === 'left' ? '<' : dir === 'right' ? '>' : '='} compare ${cur}, go ${dir}`,
      });
    },
    onInsert: (value, parent) => {
      highlight.clear();
      newlyInserted = value;
      render({
        zh: `插入 ${value}${parent !== null ? `（作为 ${parent} 的子节点）` : '（根）'}`,
        en: `Insert ${value}${parent !== null ? ` (under ${parent})` : ' (root)'}`,
      });
      newlyInserted = null;
    },
  };

  for (const v of input.insert) tree.insert(v, insertHooks);

  // —— 查找阶段 ——
  const searchHooks: BstSearchHooks = {
    onCompare: (cur, tgt, dir) => {
      highlight.clear();
      highlight.add(cur);
      render({
        zh: `查找 ${tgt}：当前 ${cur}${dir === 'found' ? ' ✅ 命中' : dir === 'left' ? '，向左' : '，向右'}`,
        en: `Search ${tgt}: at ${cur}${dir === 'found' ? ' ✅ found' : dir === 'left' ? ', go left' : ', go right'}`,
      });
    },
    onResult: (value, found) => {
      highlight.clear();
      searchFound = { value, found };
      render({
        zh: found ? `找到 ${value}` : `未找到 ${value}`,
        en: found ? `Found ${value}` : `${value} not found`,
      });
      searchFound = null;
    },
  };

  for (const v of input.search ?? []) tree.search(v, searchHooks);

  // 终态
  rec
    .begin({
      zh: `完成，中序遍历 = ${tree.inorder().join(', ')}`,
      en: `Done, inorder = ${tree.inorder().join(', ')}`,
    })
    .setTree((toVizTree(tree.root, new Set()) as Viz | null) ?? EMPTY_TREE)
    .commit();

  return rec.build();
}

/** 空树占位（setTree 需要非空根）。 */
const EMPTY_TREE = { id: 'empty', value: '∅', role: 'default' as const };

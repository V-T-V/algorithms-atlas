// =============================================================================
// 伸展树 · 录制帧序列
// 用 setTree 展示当前树形态。每次 insert/search 触发的 splay 把目标旋转到根。
// 旋转过程标记 role:'pivot'，完成帧根标 'final'。
// =============================================================================

import type { BarRole, Frame, TreeNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { SplayTree, type SplayHooks, type SplayNode } from './impl.ts';

export const DEFAULT_INPUT = {
  inserts: [10, 5, 20, 15, 25, 12],
  searches: [12, 10], // 把 12、10 splay 到根
};

function toViz(node: SplayNode | null, prefix: string, pivot: number | null): TreeNode | null {
  if (!node) return null;
  const id = `${prefix}-${node.value}`;
  const role: BarRole | undefined = node.value === pivot ? 'pivot' : undefined;
  const children: TreeNode[] = [];
  const l = toViz(node.left, `${id}-L`, pivot);
  const r = toViz(node.right, `${id}-R`, pivot);
  if (l) children.push(l);
  if (r) children.push(r);
  return {
    id,
    value: node.value,
    role,
    children: children.length ? children : undefined,
  };
}

function markFinal(node: SplayNode | null): TreeNode | null {
  if (!node) return null;
  const children: TreeNode[] = [];
  const l = markFinal(node.left);
  const r = markFinal(node.right);
  if (l) children.push(l);
  if (r) children.push(r);
  return {
    id: `f-${node.value}`,
    value: node.value,
    role: 'final',
    children: children.length ? children : undefined,
  };
}

/** 录制演示帧序列。 */
export function buildTrace(
  input: { inserts: readonly number[]; searches: readonly number[] } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const tree = new SplayTree();

  rec
    .begin({ zh: '空树，开始插入', en: 'Empty tree, start inserting' })
    .setTree({ id: 'empty', value: '∅' })
    .commit();

  for (const v of input.inserts) {
    let pivot: number | null = null;
    let lastCase: string | null = null;
    const hooks: SplayHooks = {
      onRotate: (c, p) => {
        lastCase = c;
        pivot = p;
      },
    };
    tree.insert(v, hooks);
    rec
      .begin({
        zh: `插入 ${v} 后 splay 到根${lastCase ? `（${lastCase}）` : ''}`,
        en: `Insert ${v}, splayed to root${lastCase ? ` (${lastCase})` : ''}`,
      })
      .setTree(toViz(tree.root, 'n', pivot) ?? { id: 'empty', value: '∅' })
      .commit();
  }

  for (const v of input.searches) {
    let pivot: number | null = null;
    let lastCase: string | null = null;
    const hooks: SplayHooks = {
      onRotate: (c, p) => {
        lastCase = c;
        pivot = p;
      },
    };
    const found = tree.search(v, hooks);
    rec
      .begin(
        found
          ? {
              zh: `查找 ${v}：命中，splay 到根${lastCase ? `（${lastCase}）` : ''}`,
              en: `Search ${v}: found, splayed to root${lastCase ? ` (${lastCase})` : ''}`,
            }
          : {
              zh: `查找 ${v}：未命中（splay 最后访问节点）`,
              en: `Search ${v}: miss (splayed last accessed)`,
            },
      )
      .setTree(toViz(tree.root, 'n', pivot) ?? { id: 'empty', value: '∅' })
      .commit();
  }

  // 终态
  rec
    .begin({
      zh: `伸展树构建完成（共 ${tree.size} 个节点，根 = ${tree.root?.value}）`,
      en: `Splay tree built (${tree.size} nodes, root = ${tree.root?.value})`,
    })
    .setTree(markFinal(tree.root) ?? { id: 'empty', value: '∅' })
    .commit();

  return rec.build();
}

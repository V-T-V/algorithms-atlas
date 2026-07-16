// BST 删除 · 录制帧序列
// 用 setTree 展示每步删除后的树形态。

import type { BarRole, Frame, TreeNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { bstDelete, bstInsert, inorder, type BSTNode, type DeleteHooks } from './impl.ts';

export const DEFAULT_INPUT = { insert: [50, 30, 70, 20, 40, 60, 80], delete: 30 };

function toViz(node: BSTNode | null, role: BarRole = 'default', prefix = 'n'): TreeNode | null {
  if (!node) return null;
  const id = `${prefix}-${node.value}-${Math.random().toString(36).slice(2, 6)}`;
  return {
    id,
    value: node.value,
    role,
    children: [node.left, node.right]
      .map((c) => toViz(c, role) ?? undefined)
      .filter((x): x is TreeNode => x !== undefined),
  };
}

export function buildTrace(input: { insert?: number[]; delete?: number } = {}): Frame[] {
  const { insert = [50, 30, 70, 20, 40, 60, 80], delete: delVal = 30 } = input;
  const rec = new TraceRecorder();
  let root = bstInsert(insert);

  rec
    .begin({
      zh: `初始 BST，准备删除 ${delVal}`,
      en: `Initial BST, will delete ${delVal}`,
    })
    .setTree(toViz(root) ?? { id: 'empty', value: '∅' })
    .commit();

  let caseNote: { zh: string; en: string } | null = null;
  const hooks: DeleteHooks = {
    onFound: (_v, c) => {
      const map: Record<string, { zh: string; en: string }> = {
        leaf: { zh: '叶子节点：直接摘除', en: 'Leaf: just remove' },
        'single-child': {
          zh: '单子节点：用子节点顶替',
          en: 'Single child: replace with the child',
        },
        'two-children': {
          zh: '双子节点：用中序后继替换',
          en: 'Two children: replace with inorder successor',
        },
        'not-found': { zh: '未找到', en: 'Not found' },
      };
      caseNote = map[c] ?? null;
    },
    onSuccessor: (sv) => {
      caseNote = {
        zh: `中序后继 = ${sv}，将其值复制到被删位置，再删除后继本身`,
        en: `Inorder successor = ${sv}; copy its value, then delete the successor`,
      };
    },
  };

  const result = bstDelete(root, delVal, hooks);
  root = result.root;

  rec
    .begin(
      caseNote ?? {
        zh: `删除 ${delVal} 完成`,
        en: `Delete ${delVal} done`,
      },
    )
    .setTree(toViz(root, 'final') ?? { id: 'empty', value: '∅' })
    .commit();

  rec
    .begin({
      zh: `删除后中序：[${inorder(root).join(', ')}]`,
      en: `Inorder after delete: [${inorder(root).join(', ')}]`,
    })
    .setAux(
      inorder(root).map((v) => ({
        label: String(v),
        value: String(v),
        role: 'final' as BarRole,
      })),
    )
    .commit();

  return rec.build();
}

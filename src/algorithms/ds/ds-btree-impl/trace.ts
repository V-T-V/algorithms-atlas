import type { BarRole, Frame, TreeNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { BTree, type BTreeHooks, type BTreeNode } from './impl.ts';

export const DEFAULT_INPUT = [10, 20, 5, 6, 12, 30, 7, 17, 8, 22, 31, 1];
export const DEFAULT_T = 2;

function toViz(node: BTreeNode, prefix: string): TreeNode {
  const id = `${prefix}-${node.keys.join('_')}`;
  const children: TreeNode[] = node.children.map((c, idx) => toViz(c, `${id}-c${idx}`));
  return {
    id,
    value: `[${node.keys.join(',')}]`,
    children: children.length ? children : undefined,
  };
}

export function buildTrace(input: number[] = DEFAULT_INPUT, t: number = DEFAULT_T): Frame[] {
  const rec = new TraceRecorder();
  const tree = new BTree(t);

  rec
    .begin({ zh: `空 B 树 (t=${t})`, en: `Empty B-Tree (t=${t})` })
    .setTree({ id: 'empty', value: '∅' })
    .commit();

  for (const v of input) {
    let lastSplit = -1;
    const hooks: BTreeHooks = {
      onSplit: (_p, ci, upKey) => {
        lastSplit = upKey;
      },
    };
    tree.insert(v, hooks);
    rec
      .begin(
        lastSplit >= 0
          ? { zh: `插入 ${v}，分裂出 ${lastSplit}`, en: `Insert ${v}, split up-key ${lastSplit}` }
          : { zh: `插入 ${v}`, en: `Insert ${v}` },
      )
      .setTree(toViz(tree.root, 'r'))
      .setAux([{ label: '规模', value: String(tree.size), role: 'final' }])
      .commit();
  }

  rec
    .begin({ zh: `最终：${tree.size} 键`, en: `Final: ${tree.size} keys` })
    .setTree(toViz(tree.root, 'r'))
    .setAux([
      { label: '规模', value: String(tree.size), role: 'final' },
      { label: '中序', value: `[${tree.inorder().join(',')}]`, role: 'sorted' },
    ])
    .commit();

  return rec.build();
}

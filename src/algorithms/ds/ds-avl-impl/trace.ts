import type { BarRole, Frame, TreeNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { AVLTree, type AVLImplHooks, type AVLNode } from './impl.ts';

export const DEFAULT_INPUT = [10, 20, 30, 40, 50, 25, 5];

function toViz(node: AVLNode | null, prefix: string, pivot: number | null): TreeNode | null {
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

export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const tree = new AVLTree();

  rec.begin({ zh: '空 AVL', en: 'Empty AVL' }).setTree({ id: 'empty', value: '∅' }).commit();

  for (const v of input) {
    let pivot: number | null = null;
    let rotType: string | null = null;
    const hooks: AVLImplHooks = {
      onRotate: (type, p) => {
        rotType = type;
        pivot = p;
      },
    };
    tree.insert(v, hooks);
    const rootViz = toViz(tree.root, 'r', pivot);
    rec
      .begin(
        rotType
          ? {
              zh: `插入 ${v} → ${rotType} (pivot=${pivot})`,
              en: `Insert ${v} -> ${rotType} (pivot=${pivot})`,
            }
          : { zh: `插入 ${v}，平衡`, en: `Insert ${v}, balanced` },
      )
      .setTree(rootViz ?? { id: 'empty', value: '∅' })
      .setAux([{ label: '规模', value: String(tree.size), role: 'final' }])
      .commit();
  }

  // 最终
  const rootViz = toViz(tree.root, 'r', null);
  rec
    .begin({ zh: `最终：${tree.size} 节点`, en: `Final: ${tree.size} nodes` })
    .setTree(rootViz ?? { id: 'empty', value: '∅' })
    .setAux([
      { label: '规模', value: String(tree.size), role: 'final' },
      { label: '中序', value: `[${tree.inorder().join(',')}]`, role: 'sorted' },
    ])
    .commit();

  return rec.build();
}

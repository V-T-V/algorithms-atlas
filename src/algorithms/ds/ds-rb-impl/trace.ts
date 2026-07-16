import type { BarRole, Frame, TreeNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { RBTree, type RBImplHooks, type RBNode } from './impl.ts';

export const DEFAULT_INPUT = [10, 20, 30, 40, 50, 25, 5];

function toViz(node: RBNode | null, prefix: string, highlight: number | null): TreeNode | null {
  if (!node) return null;
  const id = `${prefix}-${node.value}`;
  const role: BarRole | undefined = node.value === highlight ? 'pivot' : undefined;
  const children: TreeNode[] = [];
  const l = toViz(node.left, `${id}-L`, highlight);
  const r = toViz(node.right, `${id}-R`, highlight);
  if (l) children.push(l);
  if (r) children.push(r);
  return {
    id,
    value: node.color === 'RED' ? `R:${node.value}` : node.value,
    role,
    children: children.length ? children : undefined,
  };
}

export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const tree = new RBTree();
  let highlight: number | null = null;

  rec.begin({ zh: '空 LLRB', en: 'Empty LLRB' }).setTree({ id: 'empty', value: '∅' }).commit();

  for (const v of input) {
    highlight = null;
    const hooks: RBImplHooks = {
      onRotate: (_type, p) => {
        highlight = p;
      },
      onFlip: (p) => {
        highlight = p;
      },
    };
    tree.insert(v, hooks);
    const rootViz = toViz(tree.root, 'r', highlight);
    rec
      .begin({ zh: `插入 ${v}`, en: `Insert ${v}` })
      .setTree(rootViz ?? { id: 'empty', value: '∅' })
      .setAux([{ label: '规模', value: String(tree.size), role: 'final' }])
      .commit();
  }

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

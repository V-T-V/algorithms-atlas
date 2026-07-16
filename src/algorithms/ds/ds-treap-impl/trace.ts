import type { BarRole, Frame, TreeNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { Treap, type TreapHooks, type TreapNode } from './impl.ts';

export const DEFAULT_INPUT = [10, 20, 30, 40, 50, 25, 5];

function toViz(node: TreapNode | null, prefix: string, highlight: number | null): TreeNode | null {
  if (!node) return null;
  const id = `${prefix}-${node.key}`;
  const role: BarRole | undefined = node.key === highlight ? 'pivot' : undefined;
  const children: TreeNode[] = [];
  const l = toViz(node.left, `${id}-L`, highlight);
  const r = toViz(node.right, `${id}-R`, highlight);
  if (l) children.push(l);
  if (r) children.push(r);
  return {
    id,
    value: `${node.key}(${node.priority.toFixed(2)})`,
    role,
    children: children.length ? children : undefined,
  };
}

// 确定 RNG
function makeRng(): () => number {
  let state = 1;
  return () => {
    state = (state * 1103515245 + 12345) & 0x7fffffff;
    return state / 0x7fffffff;
  };
}

export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const tree = new Treap(makeRng());

  rec.begin({ zh: '空 treap', en: 'Empty treap' }).setTree({ id: 'empty', value: '∅' }).commit();

  for (const v of input) {
    let highlight: number | null = null;
    const hooks: TreapHooks = {
      onRotate: (_t, p) => {
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
    .begin({
      zh: `最终：${tree.size} 节点，堆合法=${tree.checkHeap()}`,
      en: `Final: ${tree.size} nodes, heap ok=${tree.checkHeap()}`,
    })
    .setTree(rootViz ?? { id: 'empty', value: '∅' })
    .setAux([
      { label: '规模', value: String(tree.size), role: 'final' },
      { label: '中序', value: `[${tree.inorder().join(',')}]`, role: 'sorted' },
    ])
    .commit();

  return rec.build();
}

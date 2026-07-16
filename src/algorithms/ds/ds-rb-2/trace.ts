// =============================================================================
// 红黑树 · 录制
import type { BarRole, Frame, TreeNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { RBTree, type RBHooks, type RBNode } from './impl.ts';

export const DEFAULT_INPUT = [10, 20, 30, 40, 50, 25, 5, 15];

function toViz(n: RBNode | null, pivot: number | null): TreeNode | null {
  if (!n) return null;
  const children: TreeNode[] = [];
  const l = toViz(n.left, pivot);
  const r = toViz(n.right, pivot);
  if (l) children.push(l);
  if (r) children.push(r);
  return {
    id: `n-${n.value}-${Math.random().toString(36).slice(2, 6)}`,
    value: n.red ? `${n.value}*` : String(n.value),
    role: (n.value === pivot ? 'swap' : 'default') as BarRole,
    children: children.length ? children : undefined,
  };
}

export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  let pivot: number | null = null;
  const tree = new RBTree({
    onRotate: (_k, p) => {
      pivot = p;
    },
    onFlip: (p) => {
      pivot = p;
    },
  });

  for (const v of input) {
    pivot = null;
    tree.insert(v);
    rec
      .begin({ zh: pivot ? `插入 ${v}（修复点 ${pivot}）` : `插入 ${v}`, en: `Insert ${v}` })
      .setTree(toViz(tree.root, pivot) ?? { id: 'e', value: '∅' })
      .commit();
  }

  rec
    .begin({ zh: '红黑树构建完成', en: 'RBTree done' })
    .setTree(toViz(tree.root, null) ?? { id: 'e', value: '∅' })
    .commit();

  return rec.build();
}

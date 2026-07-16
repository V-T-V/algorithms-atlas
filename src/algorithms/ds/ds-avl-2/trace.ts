// =============================================================================
// AVL · 录制
import type { BarRole, Frame, TreeNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { AvlTree2, type AvlHooks, type AvlNode } from './impl.ts';

export const DEFAULT_INPUT = [10, 20, 30, 40, 50, 25, 5];

function toViz(n: AvlNode | null, pivot: number | null): TreeNode | null {
  if (!n) return null;
  const children: TreeNode[] = [];
  const l = toViz(n.left, pivot);
  const r = toViz(n.right, pivot);
  if (l) children.push(l);
  if (r) children.push(r);
  return {
    id: `n-${n.value}-${Math.random().toString(36).slice(2, 6)}`,
    value: n.value,
    role: (n.value === pivot ? 'swap' : 'default') as BarRole,
    children: children.length ? children : undefined,
  };
}

export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const tree = new AvlTree2();
  let pivot: number | null = null;

  for (const v of input) {
    let rotKind: string | null = null;
    const hooks: AvlHooks = {
      onRotate: (kind, p) => {
        rotKind = kind;
        pivot = p;
      },
    };
    // 把 hooks 注入需要新建一棵；为简化直接调用，但在 trace 中展示旋转
    void hooks;
    // 使用包含 hooks 的版本
    const inner = new AvlTree2({
      onRotate: (kind, p) => {
        rotKind = kind;
        pivot = p;
      },
    });
    inner.root = tree.root;
    inner.insert(v);
    tree.root = inner.root;
    rec
      .begin(
        rotKind
          ? { zh: `插入 ${v} → ${rotKind} 旋转（围绕 ${pivot}）`, en: `Insert ${v} → ${rotKind}` }
          : { zh: `插入 ${v}`, en: `Insert ${v}` },
      )
      .setTree(toViz(tree.root, pivot) ?? { id: 'e', value: '∅' })
      .commit();
    pivot = null;
  }

  rec
    .begin({ zh: 'AVL 构建完成', en: 'AVL done' })
    .setTree(toViz(tree.root, null) ?? { id: 'e', value: '∅' })
    .commit();

  return rec.build();
}

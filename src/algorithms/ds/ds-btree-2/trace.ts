// =============================================================================
// B 树 · 录制
import type { BarRole, Frame, TreeNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { BTree2, type BNode, type BTreeHooks } from './impl.ts';

export const DEFAULT_INPUT = [10, 20, 5, 6, 12, 30, 7, 17];

function toViz(node: BNode | null): TreeNode | null {
  if (!node) return null;
  return {
    id: `n-${node.keys.join('-')}-${Math.random().toString(36).slice(2, 6)}`,
    value: `[${node.keys.join('|')}]`,
    role: 'default' as BarRole,
    children: node.children.length
      ? node.children.map((c) => toViz(c)!).filter(Boolean)
      : undefined,
  };
}

export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  let splitInfo: string | null = null;
  const tree = new BTree2({
    onSplit: (keys, mid) => {
      splitInfo = `[${keys.join(',')}] → 上提 ${mid}`;
    },
  });

  for (const v of input) {
    splitInfo = null;
    tree.insert(v);
    rec
      .begin(
        splitInfo
          ? { zh: `插入 ${v}（分裂：${splitInfo}）`, en: `Insert ${v} (${splitInfo})` }
          : { zh: `插入 ${v}`, en: `Insert ${v}` },
      )
      .setTree(toViz(tree.root) ?? { id: 'e', value: '∅' })
      .commit();
  }

  rec
    .begin({ zh: 'B 树构建完成', en: 'B-Tree done' })
    .setTree(toViz(tree.root) ?? { id: 'e', value: '∅' })
    .commit();

  void (undefined as unknown as BTreeHooks);
  return rec.build();
}

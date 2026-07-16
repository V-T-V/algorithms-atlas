// BST 从有序数组构造 · 录制帧序列

import type { Frame, TreeNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { sortedArrayToBST, height, BstNode } from './impl.ts';

export const DEFAULT_INPUT = { arr: [1, 2, 3, 4, 5, 6, 7] };

function toViz(node: BstNode | null, picked: Set<number>): TreeNode | undefined {
  if (node === null) return undefined;
  return {
    id: String(node.value),
    value: node.value,
    role: picked.has(node.value) ? 'compare' : 'default',
    children: [node.left, node.right]
      .filter((c): c is BstNode => c !== null)
      .map((c) => toViz(c, picked)!),
  };
}

export function buildTrace(input: { arr: number[] } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { arr } = input;

  rec
    .begin({
      zh: `有序数组 [${arr.join(', ')}] 构造平衡 BST`,
      en: `Sorted [${arr.join(', ')}] to balanced BST`,
    })
    .setAux([{ label: '长度', value: String(arr.length), role: 'frontier' }])
    .commit();

  const picked = new Set<number>();
  const root = sortedArrayToBST(arr, {
    onPick: (index, value, lo, hi) => {
      picked.add(value);
      rec
        .begin({
          zh: `区间 [${lo}, ${hi}]，取中点 ${index}（值 ${value}）`,
          en: `Range [${lo}, ${hi}], pick mid ${index} (value ${value})`,
        })
        .setTree(toViz(root, picked) ?? { id: 'empty', value: '', children: [] })
        .setAux([
          { label: '中点', value: String(index), role: 'pivot' },
          { label: '值', value: String(value), role: 'compare' },
        ])
        .commit();
    },
  });

  rec
    .begin({ zh: `完成，高度 = ${height(root)}`, en: `Done, height = ${height(root)}` })
    .setTree(toViz(root, picked) ?? { id: 'empty', value: '', children: [] })
    .setAux([{ label: '高度', value: String(height(root)), role: 'final' }])
    .commit();

  return rec.build();
}

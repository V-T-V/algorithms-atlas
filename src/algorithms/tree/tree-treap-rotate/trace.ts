// 树堆旋转 · 录制帧序列

import type { Frame, TreeNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildTreap, inorder, height, isHeapOrdered, TreapNode } from './impl.ts';

export const DEFAULT_INPUT = {
  entries: [
    { key: 50, priority: 7 },
    { key: 30, priority: 3 },
    { key: 70, priority: 11 },
    { key: 20, priority: 1 },
    { key: 40, priority: 5 },
    { key: 60, priority: 9 },
    { key: 80, priority: 13 },
  ],
};

function toViz(node: TreapNode | null, last?: number): TreeNode | undefined {
  if (node === null) return undefined;
  return {
    id: String(node.key),
    value: `${node.key}:${node.priority}`,
    role: last === node.key ? 'final' : 'default',
    children: [node.left, node.right]
      .filter((c): c is TreapNode => c !== null)
      .map((c) => toViz(c, last)!),
  };
}

export function buildTrace(
  input: { entries: { key: number; priority: number }[] } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const { entries } = input;

  rec
    .begin({ zh: `树堆插入 ${entries.length} 个键`, en: `Treap insert ${entries.length} keys` })
    .setAux([{ label: '键数', value: String(entries.length), role: 'frontier' }])
    .commit();

  let rotateCount = 0;
  let lastAt = -1;
  const root = buildTreap(entries, {
    onRotate: (dir, at) => {
      rotateCount++;
      lastAt = at;
      rec
        .begin({
          zh: `${dir === 'L' ? '左' : '右'}旋 @ ${at}`,
          en: `${dir === 'L' ? 'Left' : 'Right'} rotate @ ${at}`,
        })
        .setAux([
          { label: '方向', value: dir, role: 'compare' },
          { label: '位置', value: String(at), role: 'pivot' },
        ])
        .commit();
    },
  });

  rec
    .begin({ zh: '最终树堆', en: 'Final treap' })
    .setTree(toViz(root, lastAt) ?? { id: 'empty', value: '', children: [] })
    .setAux([
      { label: '旋转次数', value: String(rotateCount), role: 'final' },
      { label: '高度', value: String(height(root)), role: 'final' },
      { label: '中序', value: inorder(root).join(', '), role: 'final' },
      { label: '堆序', value: isHeapOrdered(root) ? '是' : '否', role: 'final' },
    ])
    .commit();

  return rec.build();
}

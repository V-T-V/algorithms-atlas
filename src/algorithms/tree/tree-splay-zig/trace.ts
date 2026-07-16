// 伸展树 Zig · 录制帧序列

import type { Frame, TreeNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildSplay, search, inorder, height, SplayNode } from './impl.ts';

export const DEFAULT_INPUT = { keys: [10, 20, 30, 40, 50], access: 10 };

function toViz(node: SplayNode | null, target?: number): TreeNode | undefined {
  if (node === null) return undefined;
  return {
    id: String(node.value),
    value: node.value,
    role: target !== undefined && node.value === target ? 'final' : 'default',
    children: [node.left, node.right]
      .filter((c): c is SplayNode => c !== null)
      .map((c) => toViz(c, target)!),
  };
}

export function buildTrace(input: { keys: number[]; access: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { keys, access } = input;

  let root = buildSplay(keys);
  rec
    .begin({ zh: `构建伸展树，访问 ${access}`, en: `Build splay tree, access ${access}` })
    .setTree(toViz(root) ?? { id: 'empty', value: '', children: [] })
    .setAux([
      { label: '节点数', value: String(keys.length), role: 'frontier' },
      { label: '访问', value: String(access), role: 'pivot' },
    ])
    .commit();

  let stepCount = 0;
  root = search(root, access, {
    onStep: (kind, at) => {
      stepCount++;
      rec
        .begin({ zh: `${kind} @ ${at}`, en: `${kind} @ ${at}` })
        .setAux([
          { label: '操作', value: kind, role: 'compare' },
          { label: '节点', value: String(at), role: 'pivot' },
        ])
        .commit();
    },
  });

  rec
    .begin({ zh: `${access} 已伸展至根`, en: `${access} splayed to root` })
    .setTree(toViz(root, access) ?? { id: 'empty', value: '', children: [] })
    .setAux([
      { label: '步骤数', value: String(stepCount), role: 'final' },
      { label: '根值', value: root === null ? '空' : String(root.value), role: 'final' },
      { label: '高度', value: String(height(root)), role: 'final' },
      { label: '中序', value: inorder(root).join(', '), role: 'final' },
    ])
    .commit();

  return rec.build();
}

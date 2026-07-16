// 红黑树旋转 · 录制帧序列

import type { Frame, TreeNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildRB, inorder, isValidRB, RBNode } from './impl.ts';

export const DEFAULT_INPUT = { keys: [10, 20, 30, 15, 25, 5, 1] };

function toViz(node: RBNode | null): TreeNode | undefined {
  if (node === null) return undefined;
  return {
    id: String(node.value),
    value: `${node.value}${node.color}`,
    role: node.color === 'R' ? 'pivot' : 'default',
    children: [node.left, node.right].filter((c): c is RBNode => c !== null).map((c) => toViz(c)!),
  };
}

export function buildTrace(input: { keys: number[] } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { keys } = input;

  rec
    .begin({ zh: `红黑树插入 ${keys.length} 个键`, en: `RB insert ${keys.length} keys` })
    .setAux([{ label: '键数', value: String(keys.length), role: 'frontier' }])
    .commit();

  let rotateCount = 0;
  let colorCount = 0;
  let root = buildRB(keys, {
    onRotate: (dir, at) => {
      rotateCount++;
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
    onColor: (at, to) => {
      colorCount++;
      rec
        .begin({ zh: `重着色 ${at} → ${to}`, en: `Recolor ${at} → ${to}` })
        .setAux([
          { label: '节点', value: String(at), role: 'pivot' },
          { label: '颜色', value: to === 'R' ? '红' : '黑', role: 'compare' },
        ])
        .commit();
    },
  });

  root = buildRB(keys);
  rec
    .begin({ zh: '最终红黑树', en: 'Final red-black tree' })
    .setTree(toViz(root) ?? { id: 'empty', value: '', children: [] })
    .setAux([
      { label: '旋转次数', value: String(rotateCount), role: 'final' },
      { label: '重着色次数', value: String(colorCount), role: 'final' },
      { label: '中序', value: inorder(root).join(', '), role: 'final' },
      { label: '合法', value: isValidRB(root) ? '是' : '否', role: 'final' },
    ])
    .commit();

  return rec.build();
}

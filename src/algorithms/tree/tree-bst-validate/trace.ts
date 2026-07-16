// BST 验证 · 录制帧序列

import type { Frame, TreeNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { isValidBST, BstNode } from './impl.ts';

export const DEFAULT_INPUT = {
  // 构造一棵合法 BST
  buildValid: (): BstNode =>
    new BstNode(
      5,
      new BstNode(3, new BstNode(2), new BstNode(4)),
      new BstNode(7, new BstNode(6), new BstNode(8)),
    ),
};

function toViz(node: BstNode | null, visited: Set<number>, bad: Set<number>): TreeNode | undefined {
  if (node === null) return undefined;
  return {
    id: String(node.value),
    value: node.value,
    role: bad.has(node.value) ? 'final' : visited.has(node.value) ? 'compare' : 'default',
    children: [node.left, node.right]
      .filter((c): c is BstNode => c !== null)
      .map((c) => toViz(c, visited, bad)!),
  };
}

export function buildTrace(input: { root?: BstNode } = {}): Frame[] {
  const rec = new TraceRecorder();
  const root = input.root ?? DEFAULT_INPUT.buildValid();

  const visited = new Set<number>();
  const bad = new Set<number>();
  const ok = isValidBST(root, {
    onVisit: (value, min, max, isOk) => {
      visited.add(value);
      if (!isOk) bad.add(value);
      rec
        .begin({
          zh: `访问 ${value}，约束 (${min}, ${max}) → ${isOk ? '通过' : '违反'}`,
          en: `Visit ${value}, bound (${min}, ${max}) → ${isOk ? 'OK' : 'violation'}`,
        })
        .setTree(toViz(root, visited, bad) ?? { id: 'empty', value: '', children: [] })
        .setAux([
          { label: '当前', value: String(value), role: 'pivot' },
          { label: '下界', value: Number.isFinite(min) ? String(min) : '-∞', role: 'compare' },
          { label: '上界', value: Number.isFinite(max) ? String(max) : '+∞', role: 'compare' },
        ])
        .commit();
    },
  });

  rec
    .begin({
      zh: `验证结果：${ok ? '是合法 BST' : '不合法'}`,
      en: `Result: ${ok ? 'valid BST' : 'invalid'}`,
    })
    .setTree(toViz(root, visited, bad) ?? { id: 'empty', value: '', children: [] })
    .setAux([{ label: '结果', value: ok ? '合法' : '不合法', role: 'final' }])
    .commit();

  return rec.build();
}

// BST 范围查询 · 录制帧序列

import type { Frame, TreeNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildBST, rangeQuery, BstNode } from './impl.ts';

export const DEFAULT_INPUT = { keys: [50, 30, 70, 20, 40, 60, 80], lo: 30, hi: 60 };

function toViz(
  node: BstNode | null,
  matches: Set<number>,
  visited: Set<number>,
): TreeNode | undefined {
  if (node === null) return undefined;
  return {
    id: String(node.value),
    value: node.value,
    role: matches.has(node.value) ? 'final' : visited.has(node.value) ? 'compare' : 'default',
    children: [node.left, node.right]
      .filter((c): c is BstNode => c !== null)
      .map((c) => toViz(c, matches, visited)!),
  };
}

export function buildTrace(
  input: { keys: number[]; lo: number; hi: number } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const { keys, lo, hi } = input;
  const root = buildBST(keys);

  rec
    .begin({ zh: `范围查询 [${lo}, ${hi}]`, en: `Range query [${lo}, ${hi}]` })
    .setTree(toViz(root, new Set(), new Set()) ?? { id: 'empty', value: '', children: [] })
    .setAux([
      { label: '下界', value: String(lo), role: 'frontier' },
      { label: '上界', value: String(hi), role: 'frontier' },
    ])
    .commit();

  const visited = new Set<number>();
  const matches = new Set<number>();
  const result = rangeQuery(root, lo, hi, {
    onVisit: (value, action) => {
      visited.add(value);
      if (action === 'match') matches.add(value);
      rec
        .begin({
          zh: `访问 ${value}：${action}`,
          en: `Visit ${value}: ${action}`,
        })
        .setTree(toViz(root, matches, visited) ?? { id: 'empty', value: '', children: [] })
        .setAux([
          { label: '当前', value: String(value), role: 'pivot' },
          { label: '动作', value: action, role: 'compare' },
        ])
        .commit();
    },
  });

  rec
    .begin({ zh: `命中：[${result.join(', ')}]`, en: `Matches: [${result.join(', ')}]` })
    .setTree(toViz(root, matches, visited) ?? { id: 'empty', value: '', children: [] })
    .setAux([{ label: '结果', value: result.join(', '), role: 'final' }])
    .commit();

  return rec.build();
}

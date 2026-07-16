// =============================================================================
// AST 访问者模式 · 录制帧序列
// =============================================================================

import type { BarRole, Frame, TreeNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { dfsVisit, countLeaves, type AstNode, type VisitHooks } from './impl.ts';

export const DEFAULT_INPUT: AstNode = {
  type: 'Program',
  children: [
    {
      type: 'Assign',
      children: [
        { type: 'Ident', value: 'x' },
        {
          type: 'BinOp',
          value: '+',
          children: [
            { type: 'Num', value: 1 },
            { type: 'Num', value: 2 },
          ],
        },
      ],
    },
    {
      type: 'Assign',
      children: [
        { type: 'Ident', value: 'y' },
        { type: 'Num', value: 3 },
      ],
    },
  ],
};

/** 把 AST 转为可视化树（用当前访问路径标记）。 */
function toTreeNode(node: AstNode, visitedSet: Set<string>, idPrefix: string): TreeNode {
  const label = node.value !== undefined ? `${node.type}:${node.value}` : node.type;
  return {
    id: idPrefix,
    value: label,
    role: visitedSet.has(idPrefix) ? ('final' as BarRole) : ('default' as BarRole),
    children: node.children?.map((c, i) => toTreeNode(c, visitedSet, `${idPrefix}.${i}`)),
  };
}

export function buildTrace(input: AstNode = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();

  rec
    .begin({
      zh: `AST 根 ${input.type}（${countLeaves(input)} 叶子）。开始 DFS 访问者遍历。`,
      en: `AST root ${input.type} (${countLeaves(input)} leaves). DFS visitor traversal.`,
    })
    .setTree(toTreeNode(input, new Set(), 'r'))
    .setAux([
      { label: '根类型', value: input.type, role: 'pivot' as BarRole },
      { label: '遍历方式', value: 'DFS 前序+后序', role: 'compare' as BarRole },
    ])
    .commit();

  const visited = new Set<string>();
  const hooks: VisitHooks = {
    onEnter: (node, depth, path) => {
      const id = 'r' + path.map((p) => '.' + p).join('');
      visited.add(id);
      rec
        .begin({
          zh: `进入 ${node.type}（深度 ${depth}，路径 [${path.join(',')}]）`,
          en: `Enter ${node.type} (depth ${depth}, path [${path.join(',')}])`,
        })
        .setTree(toTreeNode(input, new Set(visited), 'r'))
        .setAux([
          { label: '节点', value: node.type, role: 'pivot' as BarRole },
          {
            label: '值',
            value: node.value !== undefined ? String(node.value) : '—',
            role: 'compare' as BarRole,
          },
          { label: '深度', value: String(depth), role: 'frontier' as BarRole },
        ])
        .commit();
    },
  };

  const stats = dfsVisit(input, {}, hooks);

  visited.add('r');
  rec
    .begin({
      zh: `遍历完成：共访问 ${stats.visited} 节点，最大深度 ${stats.maxDepth}。`,
      en: `Done: visited ${stats.visited} nodes, max depth ${stats.maxDepth}.`,
    })
    .setTree(
      toTreeNode(
        input,
        new Set(['r', ...Array.from({ length: stats.visited }, (_, i) => 'r.' + i)]),
        'r',
      ),
    )
    .setAux([
      { label: '总节点数', value: String(stats.visited), role: 'final' as BarRole },
      { label: '最大深度', value: String(stats.maxDepth), role: 'compare' as BarRole },
      {
        label: '按类型计数',
        value: Object.entries(stats.countByType)
          .map(([k, v]) => `${k}:${v}`)
          .join(' '),
        role: 'frontier' as BarRole,
      },
    ])
    .commit();

  return rec.build();
}

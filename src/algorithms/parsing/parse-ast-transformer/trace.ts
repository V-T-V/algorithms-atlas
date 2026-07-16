// =============================================================================
// AST 变换器 · 录制帧序列
// =============================================================================

import type { BarRole, Frame, TreeNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import {
  transform,
  arithmeticRewrite,
  nodeCount,
  type AstNode,
  type RewriteHooks,
} from './impl.ts';

// (1 + 2) * 1 + 0  → 折叠 + 单位元 → 3
export const DEFAULT_INPUT: AstNode = {
  type: 'BinOp',
  value: '+',
  children: [
    {
      type: 'BinOp',
      value: '*',
      children: [
        {
          type: 'BinOp',
          value: '+',
          children: [
            { type: 'Num', value: 1 },
            { type: 'Num', value: 2 },
          ],
        },
        { type: 'Num', value: 1 },
      ],
    },
    { type: 'Num', value: 0 },
  ],
};

function toTreeNode(node: AstNode, idPrefix: string): TreeNode {
  return {
    id: idPrefix,
    value: node.value !== undefined ? `${node.type}:${node.value}` : node.type,
    role: 'default',
    children: node.children?.map((c, i) => toTreeNode(c, `${idPrefix}.${i}`)),
  };
}

export function buildTrace(input: AstNode = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();

  rec
    .begin({
      zh: `原始 AST（${nodeCount(input)} 节点）。自底向上重写：算术折叠 + 单位元消除。`,
      en: `Original AST (${nodeCount(input)} nodes). Bottom-up rewrite: arithmetic folding + identity elimination.`,
    })
    .setTree(toTreeNode(input, 'r'))
    .setAux([
      { label: '阶段', value: '变换前', role: 'pivot' as BarRole },
      { label: '节点数', value: String(nodeCount(input)), role: 'compare' as BarRole },
    ])
    .commit();

  let rewriteCount = 0;
  const hooks: RewriteHooks = {
    onRewrite: (before, after, depth) => {
      rewriteCount++;
      rec
        .begin({
          zh: `深度 ${depth}：${before.type}${before.value !== undefined ? ':' + before.value : ''} → ${after.type}${after.value !== undefined ? ':' + after.value : ''}`,
          en: `Depth ${depth}: ${before.type}${before.value !== undefined ? ':' + before.value : ''} → ${after.type}${after.value !== undefined ? ':' + after.value : ''}`,
        })
        .setAux([
          {
            label: '原',
            value: `${before.type}:${before.value ?? '—'}`,
            role: 'compare' as BarRole,
          },
          { label: '新', value: `${after.type}:${after.value ?? '—'}`, role: 'final' as BarRole },
          { label: '深度', value: String(depth), role: 'frontier' as BarRole },
        ])
        .commit();
    },
  };

  // 用足够多的 pass 让其到不动点
  const result = transform(input, arithmeticRewrite, hooks, 20);

  rec
    .begin({
      zh: `变换完成：${nodeCount(input)} → ${nodeCount(result.root)} 节点，重写 ${rewriteCount} 次。`,
      en: `Done: ${nodeCount(input)} → ${nodeCount(result.root)} nodes, ${rewriteCount} rewrites.`,
    })
    .setTree(toTreeNode(result.root, 'r'))
    .setAux([
      { label: '重写次数', value: String(rewriteCount), role: 'final' as BarRole },
      { label: '原节点数', value: String(nodeCount(input)), role: 'compare' as BarRole },
      { label: '现节点数', value: String(nodeCount(result.root)), role: 'final' as BarRole },
      {
        label: '结果',
        value: result.root.type === 'Num' ? String(result.root.value) : result.root.type,
        role: 'frontier' as BarRole,
      },
    ])
    .commit();

  return rec.build();
}

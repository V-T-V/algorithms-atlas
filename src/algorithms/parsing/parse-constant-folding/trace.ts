// =============================================================================
// 常量折叠 · 录制帧序列
// =============================================================================

import type { BarRole, Frame, TreeNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { constantFold, nodeCount, type AstNode, type FoldHooks } from './impl.ts';

// (1 + 2) * (3 + 4) → 21
export const DEFAULT_INPUT: AstNode = {
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
    {
      type: 'BinOp',
      value: '+',
      children: [
        { type: 'Num', value: 3 },
        { type: 'Num', value: 4 },
      ],
    },
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
      zh: `原始表达式（${nodeCount(input)} 节点）。不动点常量折叠。`,
      en: `Original expression (${nodeCount(input)} nodes). Fixpoint constant folding.`,
    })
    .setTree(toTreeNode(input, 'r'))
    .setAux([
      { label: '阶段', value: '折叠前', role: 'pivot' as BarRole },
      { label: '节点数', value: String(nodeCount(input)), role: 'compare' as BarRole },
    ])
    .commit();

  let folds = 0;
  const hooks: FoldHooks = {
    onFold: (before, after, depth) => {
      folds++;
      rec
        .begin({
          zh: `深度 ${depth}：折叠 ${before.type}${before.value !== undefined ? ':' + before.value : ''} → ${after.type}:${after.value}`,
          en: `Depth ${depth}: fold ${before.type}${before.value !== undefined ? ':' + before.value : ''} → ${after.type}:${after.value}`,
        })
        .setAux([
          {
            label: '原',
            value: `${before.type}:${before.value ?? '—'}`,
            role: 'compare' as BarRole,
          },
          {
            label: '折叠为',
            value: `${after.type}:${String(after.value)}`,
            role: 'final' as BarRole,
          },
          { label: '深度', value: String(depth), role: 'frontier' as BarRole },
        ])
        .commit();
    },
    onPass: (pass, foldCount) => {
      rec
        .begin({
          zh: `第 ${pass} 轮：折叠 ${foldCount} 处。`,
          en: `Pass ${pass}: ${foldCount} folds.`,
        })
        .setAux([
          { label: '轮次', value: String(pass), role: 'pivot' as BarRole },
          { label: '本轮折叠', value: String(foldCount), role: 'compare' as BarRole },
        ])
        .commit();
    },
  };

  const result = constantFold(input, 20, hooks);

  rec
    .begin({
      zh: `完成：${nodeCount(input)} → ${nodeCount(result.root)} 节点，共折叠 ${folds} 次，${result.passes} 轮。`,
      en: `Done: ${nodeCount(input)} → ${nodeCount(result.root)} nodes, ${folds} folds, ${result.passes} passes.`,
    })
    .setTree(toTreeNode(result.root, 'r'))
    .setAux([
      { label: '总折叠', value: String(folds), role: 'final' as BarRole },
      { label: '轮数', value: String(result.passes), role: 'compare' as BarRole },
      {
        label: '结果',
        value: result.root.value !== undefined ? String(result.root.value) : result.root.type,
        role: 'frontier' as BarRole,
      },
    ])
    .commit();

  return rec.build();
}

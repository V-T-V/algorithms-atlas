// =============================================================================
// 迭代加深 Alpha-Beta · 录制帧序列
// 可视化：setTree 渲染博弈树；setAux 展示各层 value/bestMove/prunes。
// =============================================================================

import type { BarRole, Frame, TreeNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import {
  buildDemoTree,
  iterativeDeepeningAlphaBeta,
  type AlphaBetaIterativeHooks,
  type IdabNode,
  type IterationResult,
} from './impl.ts';

export interface IdabInput {
  branching: number;
  maxDepth: number;
}
export const DEFAULT_INPUT: IdabInput = { branching: 3, maxDepth: 3 };

function renderTree(
  node: IdabNode,
  depth: number,
  highlight: Set<string>,
  pruned: Set<string>,
): TreeNode {
  const isMax = depth % 2 === 0;
  const fallback: BarRole = isMax ? 'pivot' : 'frontier';
  const role: BarRole = pruned.has(node.id) ? 'warn' : highlight.has(node.id) ? 'final' : fallback;
  return {
    id: node.id,
    value: node.value !== undefined ? node.value : isMax ? 'MAX' : 'MIN',
    role,
    children: node.children.map((c) => renderTree(c, depth + 1, highlight, pruned)),
  };
}

/** 录制演示帧序列。 */
export function buildTrace(input: IdabInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { branching, maxDepth } = input;
  const tree = buildDemoTree(branching, maxDepth);
  const highlight = new Set<string>();
  const pruned = new Set<string>();
  const rows: IterationResult[] = [];

  rec
    .begin({
      zh: `迭代加深 alpha-beta：分支=${branching}，最大深度=${maxDepth}`,
      en: `ID + alpha-beta: branching=${branching}, maxDepth=${maxDepth}`,
    })
    .setTree(renderTree(tree, 0, highlight, pruned))
    .setAux([{ label: '说明', value: '逐层加深搜索', role: 'default' }])
    .commit();

  const hooks: AlphaBetaIterativeHooks = {
    onIterationStart: (depth) => {
      highlight.clear();
      pruned.clear();
      rec
        .begin({ zh: `开始深度 ${depth} 层搜索`, en: `Start depth-${depth} iteration` })
        .setTree(renderTree(tree, 0, highlight, pruned))
        .commit();
    },
    onPrune: (_parent, childId) => {
      pruned.add(childId);
    },
    onIterationEnd: (depth, result) => {
      rows.push(result);
      if (result.bestChildId) highlight.add(result.bestChildId);
      highlight.add('root');
      rec
        .begin({
          zh: `深度 ${depth} 完成：value=${result.value}，bestMove=${result.bestChildId}，剪枝=${result.prunes}`,
          en: `Depth ${depth}: value=${result.value}, bestMove=${result.bestChildId}, prunes=${result.prunes}`,
        })
        .setTree(renderTree(tree, 0, highlight, pruned))
        .setAux([
          { label: `深度${depth} value`, value: String(result.value), role: 'final' },
          { label: `最优着法`, value: String(result.bestChildId), role: 'final' },
          { label: `剪枝次数`, value: String(result.prunes), role: 'warn' },
          { label: `访问节点`, value: String(result.nodesVisited), role: 'default' },
        ])
        .commit();
    },
    onVisit: () => {
      void 0;
    },
  };

  const results = iterativeDeepeningAlphaBeta(tree, maxDepth, hooks);
  const last = results[results.length - 1]!;

  rec
    .begin({
      zh: `完成：最深层 value=${last.value}，bestMove=${last.bestChildId}`,
      en: `Done: deepest value=${last.value}, bestMove=${last.bestChildId}`,
    })
    .setTree(renderTree(tree, 0, highlight, pruned))
    .setAux(
      results.map((r) => ({
        label: `d=${r.depth}`,
        value: `v=${r.value} mv=${r.bestChildId} prune=${r.prunes}`,
        role: 'final' as BarRole,
      })),
    )
    .commit();

  return rec.build();
}

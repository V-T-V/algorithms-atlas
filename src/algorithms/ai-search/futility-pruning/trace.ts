// =============================================================================
// 无用走子裁枝 · 录制帧序列
// =============================================================================

import type { BarRole, Frame, TreeNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import {
  alphaBetaFutility,
  alphaBetaPlain,
  buildTree,
  DEFAULT_FP_CONFIG,
  type FpHooks,
  type FpNode,
} from './impl.ts';

export const DEFAULT_UTILITIES: number[] = [100, 200, 300, 400, 500, 600, 700, 800];
export const DEFAULT_BRANCHING: number = 2;

let vizCounter = 0;
function vizId(): string {
  vizCounter += 1;
  return `v${vizCounter}`;
}

function toViz(
  node: FpNode,
  highlight: Set<string>,
  futile: Set<string>,
  pruned: Set<string>,
): TreeNode {
  let role: BarRole = 'default';
  if (highlight.has(node.id)) role = 'compare';
  else if (futile.has(node.id)) role = 'final';
  else if (pruned.has(node.id)) role = 'swap';
  else if (node.value !== undefined) role = 'frontier';
  const isLeaf = node.children === undefined || node.children.length === 0;
  const val = node.value !== undefined ? node.value.toFixed(0) : '?';
  const value = isLeaf
    ? `u=${node.utility ?? '?'}\nv=${val}`
    : `se=${node.staticEval ?? '?'}\nv=${val}`;
  return {
    id: vizId(),
    value,
    role,
    children: node.children?.map((c) => toViz(c, highlight, futile, pruned)),
  };
}

export function buildTrace(
  utilities: number[] = DEFAULT_UTILITIES,
  branching: number = DEFAULT_BRANCHING,
): Frame[] {
  const rec = new TraceRecorder();
  vizCounter = 0;

  const root = buildTree({ utilities, branching });
  const refRoot = buildTree({ utilities, branching });
  const highlight = new Set<string>();
  const futileNodes = new Set<string>();
  const prunedNodes = new Set<string>();
  let futileCuts = 0;
  let betaCuts = 0;
  let step = 0;

  const snapshot = (note: { zh: string; en: string }): void => {
    vizCounter = 0;
    rec
      .begin(note)
      .setTree(toViz(root, highlight, futileNodes, prunedNodes))
      .setAux([
        { label: '步数', value: String(step), role: 'pivot' },
        { label: '无用裁枝', value: String(futileCuts), role: 'final' },
        { label: 'β 剪枝', value: String(betaCuts), role: 'swap' },
        {
          label: '根值',
          value: root.value !== undefined ? String(root.value) : '计算中',
          role: 'default',
        },
      ])
      .commit();
    highlight.clear();
  };

  snapshot({
    zh: `构建树，前沿裁枝配置：margin=${DEFAULT_FP_CONFIG.margin}, frontierDepth=${DEFAULT_FP_CONFIG.frontierDepth}`,
    en: `Build tree; futility config margin=${DEFAULT_FP_CONFIG.margin}, frontierDepth=${DEFAULT_FP_CONFIG.frontierDepth}`,
  });

  const hooks: FpHooks = {
    onFutile: (node, depth, se, alpha) => {
      step += 1;
      futileCuts += 1;
      futileNodes.add(node.id);
      highlight.add(node.id);
      snapshot({
        zh: `${node.id} 深度 ${depth}：静态 ${se} + margin(${DEFAULT_FP_CONFIG.margin}) ≤ α(${alpha}) → 前沿裁枝`,
        en: `${node.id} depth ${depth}: static ${se} + margin <= alpha(${alpha}) → futility prune`,
      });
    },
    onPrune: (node, ci) => {
      step += 1;
      betaCuts += 1;
      prunedNodes.add(node.id);
      highlight.add(node.id);
      snapshot({
        zh: `${node.id} 子#${ci}：β 剪枝`,
        en: `${node.id} child#${ci}: beta cutoff`,
      });
    },
  };

  const depth = Math.round(Math.log(utilities.length) / Math.log(branching));
  alphaBetaFutility(root, depth, -Infinity, Infinity, DEFAULT_FP_CONFIG, hooks);
  const refValue = alphaBetaPlain(refRoot, depth, -Infinity, Infinity);

  vizCounter = 0;
  rec
    .begin({
      zh: `完成：根值 = ${root.value}（禁用时 α-β = ${refValue}）`,
      en: `Done: root = ${root.value} (disabled α-β = ${refValue})`,
    })
    .setTree(toViz(root, new Set(), futileNodes, prunedNodes))
    .setAux([
      { label: '根值', value: String(root.value), role: 'final' },
      { label: '无用裁枝', value: String(futileCuts), role: 'final' },
      { label: 'β 剪枝', value: String(betaCuts), role: 'final' },
    ])
    .commit();

  return rec.build();
}

// =============================================================================
// 晚期走子裁剪 LMR · 录制帧序列
// setTree 展示博弈树，setAux 显示搜索统计（缩减次数/重搜次数/剪枝次数）。
// =============================================================================

import type { BarRole, Frame, TreeNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import {
  alphaBetaLMR,
  alphaBetaPlain,
  buildTree,
  DEFAULT_LMR_CONFIG,
  type LmrHooks,
  type LmrNode,
} from './impl.ts';

export const DEFAULT_UTILITIES: number[] = [10, 2, 3, 4, 5, 6, 7, 8, 9, 1, 11, 12, 13, 14, 15, 0];
export const DEFAULT_BRANCHING: number = 4;

let vizCounter = 0;
function vizId(): string {
  vizCounter += 1;
  return `v${vizCounter}`;
}

function toViz(
  node: LmrNode,
  highlight: Set<string>,
  reduced: Set<string>,
  pruned: Set<string>,
): TreeNode {
  let role: BarRole = 'default';
  if (highlight.has(node.id)) role = 'compare';
  else if (reduced.has(node.id)) role = 'warn';
  else if (pruned.has(node.id)) role = 'swap';
  else if (node.value !== undefined) role = 'frontier';
  const isLeaf = node.children === undefined || node.children.length === 0;
  const val = node.value !== undefined ? node.value.toFixed(0) : '?';
  const value = isLeaf ? `u=${node.utility ?? '?'}\nv=${val}` : `v=${val}`;
  return {
    id: vizId(),
    value,
    role,
    children: node.children?.map((c) => toViz(c, highlight, reduced, pruned)),
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
  const reduced = new Set<string>();
  const pruned = new Set<string>();
  let reduceCount = 0;
  let researchCount = 0;
  let pruneCount = 0;
  let step = 0;

  const snapshot = (note: { zh: string; en: string }): void => {
    vizCounter = 0;
    rec
      .begin(note)
      .setTree(toViz(root, highlight, reduced, pruned))
      .setAux([
        { label: '步数', value: String(step), role: 'pivot' },
        { label: '缩减搜索', value: String(reduceCount), role: 'warn' },
        { label: '完整重搜', value: String(researchCount), role: 'compare' },
        { label: '剪枝', value: String(pruneCount), role: 'swap' },
        {
          label: '根值',
          value: root.value !== undefined ? String(root.value) : '计算中',
          role: 'frontier',
        },
      ])
      .commit();
    highlight.clear();
  };

  snapshot({
    zh: `构建 ${utilities.length} 叶 / 分支 ${branching} 树，LMR 配置：minDepth=${DEFAULT_LMR_CONFIG.minDepth}, fullMoves=${DEFAULT_LMR_CONFIG.fullMoves}, R=${DEFAULT_LMR_CONFIG.reduction}`,
    en: `Build tree; LMR config minDepth=${DEFAULT_LMR_CONFIG.minDepth}, fullMoves=${DEFAULT_LMR_CONFIG.fullMoves}, R=${DEFAULT_LMR_CONFIG.reduction}`,
  });

  const hooks: LmrHooks = {
    onReduce: (node, ci, rDepth, fDepth) => {
      step += 1;
      reduceCount += 1;
      reduced.add(node.id);
      highlight.add(node.id);
      snapshot({
        zh: `${node.id} 子#${ci}：缩减搜索深度 ${rDepth}（完整 ${fDepth}）`,
        en: `${node.id} child#${ci}: reduced search depth ${rDepth} (full ${fDepth})`,
      });
    },
    onResearch: (node, ci) => {
      step += 1;
      researchCount += 1;
      highlight.add(node.id);
      snapshot({
        zh: `${node.id} 子#${ci}：缩减值 > α，触发完整重搜`,
        en: `${node.id} child#${ci}: reduced > alpha, re-search full`,
      });
    },
    onPrune: (node, ci) => {
      step += 1;
      pruneCount += 1;
      pruned.add(node.id);
      highlight.add(node.id);
      snapshot({
        zh: `${node.id} 子#${ci}：β 剪枝`,
        en: `${node.id} child#${ci}: beta cutoff`,
      });
    },
  };

  const depth = Math.round(Math.log(utilities.length) / Math.log(branching));
  alphaBetaLMR(root, depth, -Infinity, Infinity, DEFAULT_LMR_CONFIG, hooks);
  const refValue = alphaBetaPlain(refRoot, depth, -Infinity, Infinity);

  vizCounter = 0;
  rec
    .begin({
      zh: `完成：根值 = ${root.value}（与纯 α-β = ${refValue} 一致）`,
      en: `Done: root = ${root.value} (matches plain α-β = ${refValue})`,
    })
    .setTree(toViz(root, new Set(), reduced, pruned))
    .setAux([
      { label: '根值', value: String(root.value), role: 'final' },
      { label: '缩减搜索', value: String(reduceCount), role: 'warn' },
      { label: '完整重搜', value: String(researchCount), role: 'final' },
      { label: '剪枝', value: String(pruneCount), role: 'final' },
    ])
    .commit();

  return rec.build();
}

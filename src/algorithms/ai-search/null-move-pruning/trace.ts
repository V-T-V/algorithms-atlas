// =============================================================================
// 空着裁剪 · 录制帧序列
// setTree 展示博弈树，setAux 显示统计（空着尝试/剪枝次数/β 剪枝次数）。
// =============================================================================

import type { BarRole, Frame, TreeNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import {
  alphaBetaNullMove,
  alphaBetaPlain,
  buildTree,
  DEFAULT_NM_CONFIG,
  type NmHooks,
  type NmNode,
} from './impl.ts';

export const DEFAULT_UTILITIES: number[] = [
  10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25,
];
export const DEFAULT_BRANCHING: number = 4;

let vizCounter = 0;
function vizId(): string {
  vizCounter += 1;
  return `v${vizCounter}`;
}

function toViz(
  node: NmNode,
  highlight: Set<string>,
  nullCut: Set<string>,
  pruned: Set<string>,
): TreeNode {
  let role: BarRole = 'default';
  if (highlight.has(node.id)) role = 'compare';
  else if (nullCut.has(node.id)) role = 'final';
  else if (pruned.has(node.id)) role = 'swap';
  else if (node.value !== undefined) role = 'frontier';
  const isLeaf = node.children === undefined || node.children.length === 0;
  const val = node.value !== undefined ? node.value.toFixed(0) : '?';
  const value = isLeaf ? `u=${node.utility ?? '?'}\nv=${val}` : `v=${val}`;
  return {
    id: vizId(),
    value,
    role,
    children: node.children?.map((c) => toViz(c, highlight, nullCut, pruned)),
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
  const nullCutNodes = new Set<string>();
  const prunedNodes = new Set<string>();
  let nullTry = 0;
  let nullCuts = 0;
  let betaCuts = 0;
  let step = 0;

  const snapshot = (note: { zh: string; en: string }): void => {
    vizCounter = 0;
    rec
      .begin(note)
      .setTree(toViz(root, highlight, nullCutNodes, prunedNodes))
      .setAux([
        { label: '步数', value: String(step), role: 'pivot' },
        { label: '空着尝试', value: String(nullTry), role: 'frontier' },
        { label: '空着剪枝', value: String(nullCuts), role: 'final' },
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
    zh: `构建 ${utilities.length} 叶 / 分支 ${branching} 树，空着裁剪配置 R=${DEFAULT_NM_CONFIG.reduction}`,
    en: `Build tree; null-move config R=${DEFAULT_NM_CONFIG.reduction}`,
  });

  const hooks: NmHooks = {
    onNullTry: (node, depth, rDepth) => {
      step += 1;
      nullTry += 1;
      highlight.add(node.id);
      snapshot({
        zh: `${node.id} 深度 ${depth}：尝试空着（浅搜索深度 ${rDepth}）`,
        en: `${node.id} depth ${depth}: try null move (shallow depth ${rDepth})`,
      });
    },
    onNullCut: (node, depth, score) => {
      step += 1;
      nullCuts += 1;
      nullCutNodes.add(node.id);
      highlight.add(node.id);
      snapshot({
        zh: `${node.id} 空着测试值 ${score} ≥ β → 剪枝返回`,
        en: `${node.id} null-test ${score} >= beta → cutoff`,
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
  alphaBetaNullMove(root, depth, -Infinity, Infinity, DEFAULT_NM_CONFIG, hooks);
  const refValue = alphaBetaPlain(refRoot, depth, -Infinity, Infinity);

  vizCounter = 0;
  rec
    .begin({
      zh: `完成：根值 = ${root.value}（禁用空着时 α-β = ${refValue}）`,
      en: `Done: root = ${root.value} (plain α-β with null disabled = ${refValue})`,
    })
    .setTree(toViz(root, new Set(), nullCutNodes, prunedNodes))
    .setAux([
      { label: '根值', value: String(root.value), role: 'final' },
      { label: '空着尝试', value: String(nullTry), role: 'final' },
      { label: '空着剪枝', value: String(nullCuts), role: 'final' },
      { label: 'β 剪枝', value: String(betaCuts), role: 'final' },
    ])
    .commit();

  return rec.build();
}

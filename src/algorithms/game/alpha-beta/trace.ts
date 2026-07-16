// =============================================================================
// Alpha-Beta 剪枝 · 录制帧序列
// 可视化：setTree 渲染博弈树。roles:
//  - MAX 层（偶数深度）默认 'pivot'
//  - MIN 层（奇数深度）默认 'frontier'
//  - 被剪枝节点 'warn'
//  - 最优路径 'final'
//  - 已求值节点 'compare'
// =============================================================================

import type { BarRole, Frame, TreeNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { alphaBeta, type AlphaBetaHooks, type GameNode } from './impl.ts';

/**
 * 演示用博弈树：根(MAX) → 3 个 MIN → 共 6 个叶子。
 * 存在明显的 alpha-beta 剪枝机会。
 *
 *            root(MAX)
 *        /      |      \
 *     n1(MIN)  n2(MIN) n3(MIN)
 *    /  \      /  \     |  \
 *   3   5    2   9     3   1
 *
 * 推导：
 *  - root 走 n1：n1=MIN(3,5)=3 → α=3
 *  - root 走 n2：先评 l3=2 → n2 的 β=2 ≤ α=3 → 剪掉 l4(9)
 *  - root 走 n3：n3=MIN(3,1)=1 → 比 3 差
 *  - root = max(3, 2, 1) = 3，最优子 = n1
 */
export const DEFAULT_INPUT = 'tree';

function buildDemoTree(): GameNode {
  return {
    id: 'root',
    children: [
      {
        id: 'n1',
        children: [
          { id: 'l1', value: 3, children: [] },
          { id: 'l2', value: 5, children: [] },
        ],
      },
      {
        id: 'n2',
        children: [
          { id: 'l3', value: 2, children: [] },
          { id: 'l4', value: 9, children: [] },
        ],
      },
      {
        id: 'n3',
        children: [
          { id: 'l5', value: 3, children: [] },
          { id: 'l6', value: 1, children: [] },
        ],
      },
    ],
  };
}

/** 把 GameNode 转成可视化的 TreeNode，按规则着色。 */
function renderTree(node: GameNode, depth: number, roles: Map<string, BarRole>): TreeNode {
  const isMax = depth % 2 === 0;
  const fallback: BarRole = isMax ? 'pivot' : 'frontier';
  return {
    id: node.id,
    value: node.value !== undefined ? node.value : isMax ? 'MAX' : 'MIN',
    role: roles.get(node.id) ?? fallback,
    children: node.children.map((c) => renderTree(c, depth + 1, roles)),
  };
}

/** 录制演示帧序列。 */
export function buildTrace(_input: string = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const tree = buildDemoTree();
  const roles = new Map<string, BarRole>();

  rec
    .begin({
      zh: 'Alpha-Beta 剪枝：维护 [α, β] 窗口，剪掉不可能影响结果的子树',
      en: 'Alpha-beta pruning: maintain [α, β] window, prune subtrees that cannot affect the result',
    })
    .setTree(renderTree(tree, 0, roles))
    .commit();

  const hooks: AlphaBetaHooks = {
    onEnter: (nodeId, alpha, beta, isMaxLayer) => {
      roles.set(nodeId, 'compare');
      rec
        .begin({
          zh: `进入 ${isMaxLayer ? 'MAX' : 'MIN'} 节点 ${nodeId}（窗口 α=${fmtB(alpha)}, β=${fmtB(beta)}）`,
          en: `Enter ${isMaxLayer ? 'MAX' : 'MIN'} node ${nodeId} (window α=${fmtB(alpha)}, β=${fmtB(beta)})`,
        })
        .setTree(renderTree(tree, 0, roles))
        .commit();
    },
    onEvaluate: (nodeId, value, isMaxLayer) => {
      roles.set(nodeId, 'compare');
      rec
        .begin({
          zh: `${isMaxLayer ? 'MAX' : 'MIN'} 节点 ${nodeId} 求得效用 = ${value}`,
          en: `${isMaxLayer ? 'MAX' : 'MIN'} node ${nodeId} evaluated: utility = ${value}`,
        })
        .setTree(renderTree(tree, 0, roles))
        .commit();
    },
    onUpdateAlpha: (parentId, childId, alpha) => {
      roles.set(childId, 'pivot');
      rec
        .begin({
          zh: `MAX ${parentId} 考察 ${childId}：更新 α = ${fmtB(alpha)}`,
          en: `MAX ${parentId} inspects ${childId}: α ← ${fmtB(alpha)}`,
        })
        .setTree(renderTree(tree, 0, roles))
        .commit();
    },
    onUpdateBeta: (parentId, childId, beta) => {
      roles.set(childId, 'frontier');
      rec
        .begin({
          zh: `MIN ${parentId} 考察 ${childId}：更新 β = ${fmtB(beta)}`,
          en: `MIN ${parentId} inspects ${childId}: β ← ${fmtB(beta)}`,
        })
        .setTree(renderTree(tree, 0, roles))
        .commit();
    },
    onPrune: (parentId, prunedChildId, reason) => {
      roles.set(prunedChildId, 'warn');
      rec
        .begin({
          zh: `剪枝（${reason}）：${parentId} 的子节点 ${prunedChildId} 不必搜索`,
          en: `Prune (${reason}): child ${prunedChildId} of ${parentId} skipped`,
        })
        .setTree(renderTree(tree, 0, roles))
        .commit();
    },
  };

  const result = alphaBeta(tree, hooks);

  // 终态：标最优路径为 final
  roles.clear();
  roles.set('root', 'final');
  if (result.bestChildId) roles.set(result.bestChildId, 'final');
  rec
    .begin({
      zh: `完成：根效用 = ${result.value}，最优走子 = ${result.bestChildId}，共剪枝 ${result.prunes} 处`,
      en: `Done: root utility = ${result.value}, best move = ${result.bestChildId}, ${result.prunes} prune(s)`,
    })
    .setTree(renderTree(tree, 0, roles))
    .setAux([
      { label: '根效用', value: String(result.value), role: 'final' as BarRole },
      { label: '最优子节点', value: String(result.bestChildId), role: 'final' as BarRole },
      { label: '剪枝次数', value: String(result.prunes), role: 'warn' as BarRole },
    ])
    .commit();

  return rec.build();
}

/** 把 ±Infinity 格式化成可读字符。 */
function fmtB(v: number): string {
  if (v === Infinity) return '∞';
  if (v === -Infinity) return '-∞';
  return String(v);
}

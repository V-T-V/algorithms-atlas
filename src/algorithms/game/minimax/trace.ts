// =============================================================================
// 极小极大 · 录制帧序列
// 通过 minimax 的钩子，把博弈树求值过程录成 Frame[]。
// 可视化：setTree 渲染博弈树，role 标 MAX/MIN 层、最优路径、被剪枝节点。
// =============================================================================

import type { BarRole, Frame, TreeNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { minimax, toTreeNode, type GameNode, type MinimaxHooks } from './impl.ts';

/**
 * 演示用博弈树：根(MAX) → 3 个 MIN → 共 7 个叶子。
 * 叶子效用见 leaves。这棵树存在 alpha-beta 剪枝机会。
 *
 * 结构：
 *            root(MAX)
 *        /      |      \
 *     n1(MIN)  n2(MIN) n3(MIN)
 *    /  \      /  \     |  \
 *   3   5    2   9     3   1   （叶子效用）
 *
 * 理论：root = max(min(3,5), min(2,9), min(3,1)) = max(3,2,1) = 3
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

/** 把 GameNode 转成可视化的 TreeNode，并按规则着色：
 *  - MAX 层（偶数深度，根为 0）：默认 pivot 色
 *  - MIN 层（奇数深度）：默认 frontier 色
 *  - evaluated 节点：用传入的角色覆盖
 *  - pruned 节点：warn 色
 *  - best 路径：final 色
 */
function renderTree(node: GameNode, depth: number, roles: Map<string, BarRole>): TreeNode {
  const isMax = depth % 2 === 0;
  const fallback: BarRole = isMax ? 'pivot' : 'frontier';
  const tn: TreeNode = {
    id: node.id,
    value: node.value !== undefined ? node.value : isMax ? 'MAX' : 'MIN',
    role: roles.get(node.id) ?? fallback,
    children: node.children.map((c) => renderTree(c, depth + 1, roles)),
  };
  return tn;
}

/** 录制演示帧序列。 */
export function buildTrace(_input: string = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const tree = buildDemoTree();
  const roles = new Map<string, BarRole>();

  rec
    .begin({
      zh: '博弈树求值：MAX 层取最大，MIN 层取最小（含 alpha-beta 剪枝）',
      en: 'Game-tree evaluation: MAX maximizes, MIN minimizes (with alpha-beta pruning)',
    })
    .setTree(renderTree(tree, 0, roles))
    .commit();

  const hooks: MinimaxHooks = {
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
    onMax: (parentId, childId, currentMax) => {
      roles.set(childId, 'pivot');
      rec
        .begin({
          zh: `MAX 节点 ${parentId} 考察子 ${childId}：当前 max = ${currentMax}`,
          en: `MAX node ${parentId} inspects child ${childId}: current max = ${currentMax}`,
        })
        .setTree(renderTree(tree, 0, roles))
        .commit();
    },
    onMin: (parentId, childId, currentMin) => {
      roles.set(childId, 'frontier');
      rec
        .begin({
          zh: `MIN 节点 ${parentId} 考察子 ${childId}：当前 min = ${currentMin}`,
          en: `MIN node ${parentId} inspects child ${childId}: current min = ${currentMin}`,
        })
        .setTree(renderTree(tree, 0, roles))
        .commit();
    },
    onPrune: (parentId, prunedChildId) => {
      roles.set(prunedChildId, 'warn');
      rec
        .begin({
          zh: `α-β 剪枝：${parentId} 的子节点 ${prunedChildId} 不必再搜索`,
          en: `α-β prune: child ${prunedChildId} of ${parentId} skipped`,
        })
        .setTree(renderTree(tree, 0, roles))
        .commit();
    },
  };

  const result = minimax(tree, hooks, { alphaBeta: true });

  // 终态：标最优路径为 final
  roles.clear();
  roles.set('root', 'final');
  if (result.bestChildId) roles.set(result.bestChildId, 'final');
  // 把对应 MIN 节点及其决定性叶子也标 final
  rec
    .begin({
      zh: `完成：根效用 = ${result.value}，最优走子为 ${result.bestChildId}，共剪枝 ${result.prunes} 处`,
      en: `Done: root utility = ${result.value}, best move = ${result.bestChildId}, ${result.prunes} prune(s)`,
    })
    .setTree(renderTree(tree, 0, roles))
    .setAux([
      { label: '根效用', value: String(result.value), role: 'final' },
      { label: '最优子节点', value: String(result.bestChildId), role: 'final' },
      { label: '剪枝次数', value: String(result.prunes), role: 'final' },
    ])
    .commit();

  return rec.build();
}

/** 重新导出 toTreeNode 供 index.ts 等外部使用（不破坏现有导出契约）。 */
export { toTreeNode };

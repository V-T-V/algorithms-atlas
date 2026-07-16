// =============================================================================
// 期望极小极大 · 录制帧序列
// 用 setTree 渲染博弈树（含 CHANCE 机会节点），role 着色：
//   MAX='pivot'，MIN='warn'，CHANCE='frontier'，最优路径='final'，正在求值='compare'。
// =============================================================================

import type { BarRole, Frame, TreeNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { expectiminimax, toTreeNode, type ExpectiNode, type ExpectiminimaxHooks } from './impl.ts';

/**
 * 演示树：根 MAX → 一个 MIN 和一个 CHANCE。
 *   root(MAX)
 *   ├── n1(MIN) → 叶 3, 8        → min = 3
 *   └── c1(CHANCE) → 叶 6 (p=0.5), 叶 10 (p=0.5) → 期望 = 8
 * root = max(3, 8) = 8，最优子 = c1
 */
export const DEFAULT_INPUT = 'tree';

function buildDemoTree(): ExpectiNode {
  return {
    id: 'root',
    type: 'MAX',
    children: [
      {
        id: 'n1',
        type: 'MIN',
        children: [
          { id: 'l1', type: 'MAX', value: 3, children: [] },
          { id: 'l2', type: 'MAX', value: 8, children: [] },
        ],
      },
      {
        id: 'c1',
        type: 'CHANCE',
        probabilities: [0.5, 0.5],
        children: [
          { id: 'l3', type: 'MAX', value: 6, children: [] },
          { id: 'l4', type: 'MAX', value: 10, children: [] },
        ],
      },
    ],
  };
}

/** 按类型给默认角色。 */
function fallbackRole(type: ExpectiNode['type']): BarRole {
  if (type === 'MAX') return 'pivot';
  if (type === 'MIN') return 'warn';
  return 'frontier';
}

/** 渲染树，roles 覆盖默认角色。CHANCE 节点把概率标在子节点 edgeLabel。 */
function renderTree(node: ExpectiNode, roles: Map<string, BarRole>): TreeNode {
  const tn: TreeNode = {
    id: node.id,
    value:
      node.value !== undefined
        ? node.type === 'CHANCE'
          ? node.value.toFixed(2)
          : String(node.value)
        : node.type,
    role: roles.get(node.id) ?? fallbackRole(node.type),
    children: node.children.map((c, i) => {
      const child = renderTree(c, roles);
      if (node.type === 'CHANCE' && node.probabilities) {
        child.edgeLabel = `p=${node.probabilities[i]}`;
      }
      return child;
    }),
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
      zh: '期望极小极大：MAX 取最大、MIN 取最小、CHANCE 取概率加权期望',
      en: 'Expectiminimax: MAX maximizes, MIN minimizes, CHANCE takes probability-weighted expectation',
    })
    .setTree(renderTree(tree, roles))
    .commit();

  const hooks: ExpectiminimaxHooks = {
    onEvaluate: (nodeId, type, value) => {
      roles.set(nodeId, 'compare');
      rec
        .begin({
          zh: `${type} 节点 ${nodeId} 求得效用 = ${type === 'CHANCE' ? value.toFixed(2) : value}`,
          en: `${type} node ${nodeId} evaluated: utility = ${type === 'CHANCE' ? value.toFixed(2) : value}`,
        })
        .setTree(renderTree(tree, roles))
        .commit();
    },
    onMax: (parentId, childId, currentMax) => {
      roles.set(childId, 'pivot');
      rec
        .begin({
          zh: `MAX 节点 ${parentId} 考察子 ${childId}：当前 max = ${currentMax}`,
          en: `MAX node ${parentId} inspects child ${childId}: current max = ${currentMax}`,
        })
        .setTree(renderTree(tree, roles))
        .commit();
    },
    onMin: (parentId, childId, currentMin) => {
      roles.set(childId, 'warn');
      rec
        .begin({
          zh: `MIN 节点 ${parentId} 考察子 ${childId}：当前 min = ${currentMin}`,
          en: `MIN node ${parentId} inspects child ${childId}: current min = ${currentMin}`,
        })
        .setTree(renderTree(tree, roles))
        .commit();
    },
    onChance: (parentId, childId, prob, running) => {
      roles.set(childId, 'frontier');
      rec
        .begin({
          zh: `CHANCE 节点 ${parentId} 累加子 ${childId}（p=${prob}）：当前期望 = ${running.toFixed(2)}`,
          en: `CHANCE node ${parentId} accumulates child ${childId} (p=${prob}): expected = ${running.toFixed(2)}`,
        })
        .setTree(renderTree(tree, roles))
        .commit();
    },
  };

  const result = expectiminimax(tree, hooks);

  // 终态：标最优路径为 final
  roles.clear();
  roles.set('root', 'final');
  if (result.bestChildId) roles.set(result.bestChildId, 'final');
  rec
    .begin({
      zh: `完成：根期望效用 = ${result.value.toFixed(2)}，最优子 = ${result.bestChildId}`,
      en: `Done: root expected utility = ${result.value.toFixed(2)}, best child = ${result.bestChildId}`,
    })
    .setTree(renderTree(tree, roles))
    .setAux([
      { label: '根期望效用', value: result.value.toFixed(2), role: 'final' },
      { label: '最优子节点', value: String(result.bestChildId), role: 'final' },
    ])
    .commit();

  return rec.build();
}

/** 重新导出 toTreeNode 供外部使用。 */
export { toTreeNode };

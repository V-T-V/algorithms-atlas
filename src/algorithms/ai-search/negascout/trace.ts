// =============================================================================
// Negascout · 录制帧序列
// 用 setTree 展示博弈树，节点 value 显示效用与搜索值；用 setAux 显示当前窗口。
// =============================================================================

import type { BarRole, Frame, TreeNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildTree, negascout, type NegascoutHooks, type SearchNode } from './impl.ts';

/** 一棵经典的 3×3 数值树（教科书 PVS 例子）：深度 2，分支 3。 */
export const DEFAULT_UTILITIES: number[] = [3, 5, 2, 9, 1, 7, 4, 6, 8];
export const DEFAULT_BRANCHING: number = 3;

let nodeIdCounter = 0;
function nextId(): string {
  nodeIdCounter += 1;
  return `v${nodeIdCounter}`;
}

function toViz(
  node: SearchNode,
  highlight: Set<string>,
  evaluated: Set<string>,
  researched: Set<string>,
): TreeNode {
  let role: BarRole = 'default';
  if (highlight.has(node.id)) role = 'compare';
  else if (evaluated.has(node.id)) role = 'final';
  else if (node.researched) role = 'warn';
  else if (node.value !== undefined) role = 'frontier';
  const isLeaf = node.children === undefined || node.children.length === 0;
  const val = node.value !== undefined ? node.value.toFixed(0) : '?';
  const value = isLeaf ? `u=${node.utility ?? '?'}\nv=${val}` : `v=${val}`;
  return {
    id: nextId(),
    value,
    role,
    children: node.children?.map((c) => toViz(c, highlight, evaluated, researched)),
  };
}

export function buildTrace(
  utilities: number[] = DEFAULT_UTILITIES,
  branching: number = DEFAULT_BRANCHING,
): Frame[] {
  const rec = new TraceRecorder();
  nodeIdCounter = 0;

  const root = buildTree(utilities, branching);
  const highlight = new Set<string>();
  const evaluated = new Set<string>();
  const researched = new Set<string>();
  let stepCounter = 0;
  let curAlpha = -Infinity;
  let curBeta = Infinity;
  let curDepth = 0;

  const snapshot = (note: { zh: string; en: string }): void => {
    nodeIdCounter = 0;
    rec
      .begin(note)
      .setTree(toViz(root, highlight, evaluated, researched))
      .setAux([
        { label: '步数', value: `${stepCounter}`, role: 'pivot' },
        { label: 'α', value: curAlpha === -Infinity ? '−∞' : String(curAlpha), role: 'frontier' },
        { label: 'β', value: curBeta === Infinity ? '+∞' : String(curBeta), role: 'frontier' },
        { label: '深度', value: String(curDepth), role: 'default' },
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
    zh: `构建博弈树（${utilities.length} 叶，分支 ${branching}），开始 negascout，窗口 [−∞, +∞]`,
    en: `Build game tree (${utilities.length} leaves, branching ${branching}), start negascout with window [-inf, +inf]`,
  });

  const hooks: NegascoutHooks = {
    onEnter: (_node, alpha, beta, depth) => {
      curAlpha = alpha;
      curBeta = beta;
      curDepth = depth;
    },
    onEvaluate: (node, score) => {
      stepCounter += 1;
      evaluated.add(node.id);
      highlight.add(node.id);
      snapshot({
        zh: `估值叶子 ${node.id} = ${score}`,
        en: `Evaluate leaf ${node.id} = ${score}`,
      });
    },
    onResearch: (node) => {
      stepCounter += 1;
      researched.add(node.id);
      highlight.add(node.id);
      snapshot({
        zh: `${node.id} 零窗口探测失败 → 重搜完整窗口`,
        en: `${node.id} null-window probe failed → re-search full window`,
      });
    },
    onReturn: (node, value) => {
      stepCounter += 1;
      highlight.add(node.id);
      snapshot({
        zh: `${node.id} 返回 v=${value}`,
        en: `${node.id} returns v=${value}`,
      });
    },
  };

  const depth = Math.round(Math.log(utilities.length) / Math.log(branching));
  negascout(root, depth, -Infinity, Infinity, hooks);

  nodeIdCounter = 0;
  rec
    .begin({
      zh: `完成：根值 = ${root.value}（与 alpha-beta 等价）`,
      en: `Done: root value = ${root.value} (equivalent to alpha-beta)`,
    })
    .setTree(toViz(root, new Set(), evaluated, researched))
    .setAux([
      { label: '根值', value: String(root.value), role: 'final' },
      { label: '重搜次数', value: String(researched.size), role: 'warn' },
    ])
    .commit();

  return rec.build();
}

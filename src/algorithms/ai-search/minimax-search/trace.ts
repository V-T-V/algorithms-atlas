// =============================================================================
// 极小化极大搜索 · 录制帧序列
// 用 setTree 展示博弈树，节点 value 显示局面的 Nim-和与 minimax 值。
// 用 setAux 显示当前正在估值的节点信息。
// =============================================================================

import type { BarRole, Frame, TreeNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { minimax, nimIsTerminal, nimHeuristic, type GameNode, type MinimaxHooks } from './impl.ts';

export const DEFAULT_STATE: number[] = [3, 2];
export const DEFAULT_DEPTH: number = 5;

let nodeIdCounter = 0;
function nextId(): string {
  nodeIdCounter += 1;
  return `n${nodeIdCounter}`;
}

/** 把内部 GameNode 树转成可视化 TreeNode。 */
function toViz(node: GameNode, highlight: Set<GameNode>, evaluated: Set<GameNode>): TreeNode {
  const xor = node.state.reduce((a, b) => a ^ b, 0);
  const val = node.value !== undefined ? node.value.toFixed(0) : '?';
  const term = nimIsTerminal(node.state);
  let role: BarRole = 'default';
  if (highlight.has(node)) role = 'compare';
  else if (evaluated.has(node)) role = 'final';
  else if (term) role = 'sorted';
  else if (node.value !== undefined) role = 'frontier';
  return {
    id: nextId(),
    value: `[${node.state.join(',')}] ${node.player}\nNim∧=${xor} v=${val}`,
    role,
    edgeLabel: undefined,
    children: node.children?.map((c) => toViz(c, highlight, evaluated)),
  };
}

export function buildTrace(
  state: number[] = DEFAULT_STATE,
  maxDepth: number = DEFAULT_DEPTH,
): Frame[] {
  const rec = new TraceRecorder();
  nodeIdCounter = 0;

  const root: GameNode = { state, player: 'max' };
  const highlight = new Set<GameNode>();
  const evaluated = new Set<GameNode>();
  let stepCounter = 0;

  const snapshot = (note: { zh: string; en: string }): void => {
    nodeIdCounter = 0;
    rec
      .begin(note)
      .setTree(toViz(root, highlight, evaluated))
      .setAux([
        { label: '步数', value: `${stepCounter}`, role: 'pivot' },
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
    zh: `初始局面 [${state.join(',')}]，MAX 先手，搜索深度 ${maxDepth}`,
    en: `Initial state [${state.join(',')}], MAX to move, depth ${maxDepth}`,
  });

  const hooks: MinimaxHooks = {
    onEvaluate: (node, score, depth) => {
      stepCounter += 1;
      evaluated.add(node);
      highlight.add(node);
      snapshot({
        zh: `估值叶子 [${node.state.join(',')}]（深度 ${depth}）= ${score}`,
        en: `Evaluate leaf [${node.state.join(',')}] (depth ${depth}) = ${score}`,
      });
    },
    onReturn: (node, value, _depth) => {
      stepCounter += 1;
      highlight.add(node);
      snapshot({
        zh: `内部节点 [${node.state.join(',')}] 完成：${node.player} 选出 v=${value}`,
        en: `Internal node [${node.state.join(',')}] done: ${node.player} picks v=${value}`,
      });
    },
  };

  minimax(root, maxDepth, true, hooks);

  // 终态帧
  nodeIdCounter = 0;
  const winner = (root.value ?? 0) > 0 ? 'MAX 必胜' : 'MIN 必胜/或平';
  rec
    .begin({
      zh: `完成：根值 = ${root.value}（${winner}）。Nim-启发式 = ${nimHeuristic(state)}`,
      en: `Done: root value = ${root.value} (${winner}). Nim heuristic = ${nimHeuristic(state)}`,
    })
    .setTree(toViz(root, new Set(), evaluated))
    .setAux([
      { label: '根值', value: String(root.value), role: 'final' },
      { label: '结论', value: winner, role: 'final' },
    ])
    .commit();

  return rec.build();
}

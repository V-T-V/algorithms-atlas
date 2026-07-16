// =============================================================================
// 期望最大搜索 · 录制帧序列
// 用 setTree 展示博弈树，节点 value 显示 utility/期望值；setAux 显示当前统计。
// =============================================================================

import type { BarRole, Frame, TreeNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildDiceTree, expectimax, type ExpectimaxHooks, type ExpectNode } from './impl.ts';

let nodeIdCounter = 0;
function nextId(): string {
  nodeIdCounter += 1;
  return `v${nodeIdCounter}`;
}

function toViz(node: ExpectNode, highlight: Set<string>, evaluated: Set<string>): TreeNode {
  let role: BarRole = 'default';
  if (highlight.has(node.id)) role = 'compare';
  else if (evaluated.has(node.id)) role = 'final';
  else if (node.value !== undefined) role = 'frontier';
  const kindLabel = node.kind === 'max' ? 'MAX' : node.kind === 'chance' ? 'CHANCE' : 'LEAF';
  const valStr =
    node.kind === 'leaf'
      ? `u=${node.utility}`
      : node.value !== undefined
        ? node.value.toFixed(2)
        : '?';
  const probStr = node.probabilities
    ? ` p=[${node.probabilities.map((p) => p.toFixed(2)).join(',')}]`
    : '';
  return {
    id: nextId(),
    value: `${kindLabel}\n${valStr}${probStr}`,
    role,
    children: node.children?.map((c) => toViz(c, highlight, evaluated)),
  };
}

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  nodeIdCounter = 0;

  const root = buildDiceTree();
  const highlight = new Set<string>();
  const evaluated = new Set<string>();
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
          value: root.value !== undefined ? root.value.toFixed(2) : '计算中',
          role: 'frontier',
        },
      ])
      .commit();
    highlight.clear();
  };

  snapshot({
    zh: `决策点：停（拿 5）或 掷（1/2/3 各 1/3 概率，叶子 3/6/0）`,
    en: `Decision: stop (take 5) or roll (1/2/3 each 1/3 prob, leaves 3/6/0)`,
  });

  const hooks: ExpectimaxHooks = {
    onEvaluate: (node, score) => {
      stepCounter += 1;
      evaluated.add(node.id);
      highlight.add(node.id);
      snapshot({ zh: `估值叶子 ${node.id} = ${score}`, en: `Evaluate leaf ${node.id} = ${score}` });
    },
    onReturn: (node, value) => {
      stepCounter += 1;
      highlight.add(node.id);
      const label = node.kind === 'max' ? 'MAX' : 'CHANCE';
      snapshot({
        zh: `${label} 节点 ${node.id} 返回 ${value.toFixed(2)}`,
        en: `${label} node ${node.id} returns ${value.toFixed(2)}`,
      });
    },
  };

  expectimax(root, 5, hooks);

  nodeIdCounter = 0;
  const decision = (root.value ?? 0) >= 5 ? '应选「停」' : '应选「掷」';
  rec
    .begin({
      zh: `完成：根期望值 = ${(root.value ?? 0).toFixed(2)}（${decision}）`,
      en: `Done: root expected value = ${(root.value ?? 0).toFixed(2)} (${decision})`,
    })
    .setTree(toViz(root, new Set(), evaluated))
    .setAux([
      { label: '根值', value: (root.value ?? 0).toFixed(2), role: 'final' },
      { label: '决策', value: decision, role: 'final' },
    ])
    .commit();

  return rec.build();
}

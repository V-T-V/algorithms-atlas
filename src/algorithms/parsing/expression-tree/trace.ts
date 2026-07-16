// 表达式树（后缀式）· 录制帧序列

import type { Frame, TreeNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import {
  buildExpressionTree,
  evalExprTree,
  exprTreeToInfix,
  infixToPostfix,
  type ExprTreeHooks,
  type ExprTreeNode,
} from './impl.ts';

export const DEFAULT_INPUT = '3 + 4 * 2';

function toViz(node: ExprTreeNode, prefix: string): TreeNode {
  if (node.type === 'leaf') {
    return { id: `${prefix}-${node.value}`, value: node.value };
  }
  return {
    id: `${prefix}-${node.op}`,
    value: node.op,
    role: 'pivot',
    children: [toViz(node.left, `${prefix}L`), toViz(node.right, `${prefix}R`)],
  };
}

export function buildTrace(input: string = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const postfix = infixToPostfix(input);
  const stackSnap: string[] = [];

  const snapshot = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setAux([
        { label: '中缀', value: input, role: 'pivot' as const },
        { label: '后缀', value: postfix.join(' '), role: 'frontier' as const },
        { label: '栈', value: stackSnap.join(',') || '∅', role: 'compare' as const },
      ])
      .commit();
  };

  snapshot({ zh: `中缀转后缀：${postfix.join(' ')}`, en: `Infix→postfix: ${postfix.join(' ')}` });

  const hooks: ExprTreeHooks = {
    onPushLeaf: (v) => {
      stackSnap.push(String(v));
      snapshot({ zh: `压入 ${v}`, en: `Push ${v}` });
    },
    onReduce: (op, _sz) => {
      const r = stackSnap.pop() ?? '?';
      const l = stackSnap.pop() ?? '?';
      stackSnap.push(`[${l}${op}${r}]`);
      snapshot({ zh: `归约 ${l} ${op} ${r}`, en: `Reduce ${l} ${op} ${r}` });
    },
  };

  const root = buildExpressionTree(postfix, hooks);
  const value = evalExprTree(root);
  const infix = exprTreeToInfix(root);

  rec
    .begin({ zh: `求值=${value}`, en: `Eval=${value}` })
    .setTree(toViz(root, 'r'))
    .setAux([
      { label: '中缀(带括号)', value: infix, role: 'final' as const },
      { label: '求值', value: String(value), role: 'final' as const },
    ])
    .commit();

  return rec.build();
}

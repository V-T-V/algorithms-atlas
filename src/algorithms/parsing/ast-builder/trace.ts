// AST 构建 · 录制帧序列
// 用 setTree 展示最终 AST。

import type { Frame, TreeNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildAst, evalAst, astToLisp, type AstHooks, type AstNode } from './impl.ts';

export const DEFAULT_INPUT = '3 + 4 * (2 - 1)';

function toViz(node: AstNode, prefix: string): TreeNode {
  if (node.type === 'num') {
    return { id: `${prefix}-n${node.value}`, value: node.value };
  }
  return {
    id: `${prefix}-op${node.op}`,
    value: node.op,
    role: 'pivot',
    children: [toViz(node.left, `${prefix}-L`), toViz(node.right, `${prefix}-R`)],
  };
}

export function buildTrace(input: string = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const events: string[] = [];

  const snapshot = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setAux([
        { label: '输入', value: input, role: 'pivot' as const },
        { label: '事件流', value: events.join(' | ') || '∅', role: 'frontier' as const },
      ])
      .commit();
  };

  snapshot({ zh: `构建 AST`, en: `Build AST` });

  const hooks: AstHooks = {
    onEnter: (nt) => {
      events.push(`→${nt}`);
      snapshot({ zh: `进入 ${nt}`, en: `Enter ${nt}` });
    },
    onNode: (node) => {
      events.push(node.type === 'num' ? `num(${node.value})` : `[${node.op}]`);
      snapshot({
        zh: `构造节点 ${node.type === 'num' ? node.value : node.op}`,
        en: `Build node ${node.type === 'num' ? node.value : node.op}`,
      });
    },
  };

  const root = buildAst(input, hooks);
  const value = evalAst(root);
  const lisp = astToLisp(root);

  rec
    .begin({ zh: `AST 完成，值=${value}`, en: `AST done, value=${value}` })
    .setTree(toViz(root, 'r'))
    .setAux([
      { label: 'LISP 形式', value: lisp, role: 'final' as const },
      { label: '求值', value: String(value), role: 'final' as const },
    ])
    .commit();

  return rec.build();
}

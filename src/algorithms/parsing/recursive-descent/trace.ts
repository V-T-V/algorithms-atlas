// =============================================================================
// 递归下降解析 · 录制帧序列
// 用 setAux 展示解析位置/当前 token，用 setTree 展示逐步生成的 AST。
// =============================================================================

import type { BarRole, Frame, TreeNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { recursiveDescent, tokenize, type RecursiveDescentHooks } from './impl.ts';

export const DEFAULT_INPUT = '3 + 4 * (2 - 1)';

/** 深拷贝 AST。 */
function cloneTree(n: TreeNode): TreeNode {
  return {
    id: n.id,
    value: n.value,
    role: n.role,
    edgeLabel: n.edgeLabel,
    children: n.children?.map(cloneTree),
  };
}

/** 录制演示帧序列。 */
export function buildTrace(input: string = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const tokens = tokenize(input);
  let pos = 0;
  // 当前已生成的最近顶层 AST 节点
  let root: TreeNode | null = null;
  const ruleStack: string[] = [];

  const snapshot = (note: { zh: string; en: string }): void => {
    const consumed = tokens.slice(0, pos).join(' ');
    const remaining = tokens.slice(pos).join(' ');
    const aux: Array<{ label: string; value: string; role?: BarRole }> = [
      { label: 'input', value: `[${consumed}] ▍ ${remaining}`, role: 'compare' as BarRole },
      { label: 'pos', value: String(pos), role: 'pivot' as BarRole },
      { label: '当前 token', value: tokens[pos] ?? '⟨EOF⟩', role: 'frontier' as BarRole },
      {
        label: '规则栈',
        value: ruleStack.length ? ruleStack.join(' > ') : '∅',
        role: 'default' as BarRole,
      },
    ];

    rec.begin(note);
    if (root) rec.setTree(cloneTree(root));
    rec.setAux(aux).commit();
  };

  snapshot({
    zh: `解析：${input}`,
    en: `Parse: ${input}`,
  });

  const hooks: RecursiveDescentHooks = {
    onEnter: (rule) => {
      ruleStack.push(rule);
      snapshot({
        zh: `进入规则 ${rule}`,
        en: `Enter rule ${rule}`,
      });
    },
    onMatch: (token, p) => {
      pos = p + 1;
      snapshot({
        zh: `匹配并消费 token "${token}"`,
        en: `Match & consume token "${token}"`,
      });
      // 数字节点由 onNode 处理；运算符节点在 term/expr 回溯时由 onNode 处理
    },
    onNode: (_rule, node) => {
      root = node;
      snapshot({
        zh: `生成节点 ${node.value}（id=${node.id}）`,
        en: `Create node ${node.value} (id=${node.id})`,
      });
      // 规则栈弹出当前层（简化：每生成节点表示一层完成）
      if (ruleStack.length > 0) ruleStack.pop();
    },
    onResult: (r) => {
      root = r;
      ruleStack.length = 0;
      snapshot({
        zh: `解析完成，AST 根 = ${r.value}`,
        en: `Parse complete, AST root = ${r.value}`,
      });
    },
  };

  const result = recursiveDescent(tokens, hooks);

  // 终态：数字叶节点标 final，运算符内部节点保持 pivot
  const markFinal = (n: TreeNode): void => {
    if (n.role !== 'pivot') n.role = 'final';
    n.children?.forEach(markFinal);
  };
  markFinal(result);
  rec
    .begin({ zh: '完成', en: 'Done' })
    .setTree(cloneTree(result))
    .setAux([
      { label: '表达式', value: input, role: 'compare' as BarRole },
      { label: 'AST 根', value: String(result.value), role: 'final' as BarRole },
    ])
    .commit();

  return rec.build();
}

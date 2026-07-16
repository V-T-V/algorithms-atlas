// =============================================================================
// 正则表达式 AST 构建 · 录制帧序列
// 展示「正则字符串 → 递归下降 → AST 结构」。
// =============================================================================

import type { BarRole, Frame, TreeNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { parseRegex, serializeRegex, type RegexAst, type RegexHooks } from './impl.ts';

export const DEFAULT_INPUT = '(a|b)*c+';

/** 把正则 AST 转为可视化树。 */
function toTreeNode(node: RegexAst, idPrefix: string): TreeNode {
  const mk = (
    label: string,
    value: string,
    role: import('../../../types.ts').BarRole,
  ): TreeNode => ({
    id: idPrefix,
    value: `${label}`,
    role,
    children: [],
  });
  switch (node.kind) {
    case 'empty':
      return mk('ε', 'ε', 'default');
    case 'char':
      return { id: idPrefix, value: `'${node.ch}'`, role: 'sorted' };
    case 'anychar':
      return { id: idPrefix, value: '.', role: 'sorted' };
    case 'class':
      return {
        id: idPrefix,
        value: `[${node.negate ? '^' : ''}${node.ranges.map((r) => (r.from === r.to ? r.from : `${r.from}-${r.to}`)).join('')}]`,
        role: 'sorted',
      };
    case 'concat':
      return {
        id: idPrefix,
        value: 'concat',
        role: 'pivot',
        children: node.children.map((ch, i) => toTreeNode(ch, `${idPrefix}.${i}`)),
      };
    case 'alt':
      return {
        id: idPrefix,
        value: '|',
        role: 'compare',
        children: node.children.map((ch, i) => toTreeNode(ch, `${idPrefix}.${i}`)),
      };
    case 'star':
      return {
        id: idPrefix,
        value: '* (0+)',
        role: 'frontier',
        children: [toTreeNode(node.child, `${idPrefix}.0`)],
      };
    case 'plus':
      return {
        id: idPrefix,
        value: '+ (1+)',
        role: 'frontier',
        children: [toTreeNode(node.child, `${idPrefix}.0`)],
      };
    case 'opt':
      return {
        id: idPrefix,
        value: '? (0/1)',
        role: 'frontier',
        children: [toTreeNode(node.child, `${idPrefix}.0`)],
      };
  }
}

/** 录制演示帧序列。 */
export function buildTrace(input: string = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();

  rec
    .begin({
      zh: `解析正则 "${input}"。文法：alt | concat | rep | atom。`,
      en: `Parse regex "${input}". Grammar: alt | concat | rep | atom.`,
    })
    .setAux([
      { label: '输入', value: input, role: 'frontier' as BarRole },
      { label: '阶段', value: '递归下降', role: 'pivot' as BarRole },
    ])
    .commit();

  let nodeCount = 0;
  const hooks: RegexHooks = {
    onNode: (node) => {
      nodeCount++;
      rec
        .begin({
          zh: `构造节点：${node.kind}`,
          en: `Build node: ${node.kind}`,
        })
        .setAux([
          { label: '节点类型', value: node.kind, role: 'pivot' as BarRole },
          { label: '当前', value: serializeRegex(node), role: 'compare' as BarRole },
          { label: '已构造', value: String(nodeCount), role: 'frontier' as BarRole },
        ])
        .commit();
    },
  };

  const root = parseRegex(input, hooks);

  rec
    .begin({
      zh: `解析完成：AST 根节点 ${root.kind}，规范化为 "${serializeRegex(root)}"。`,
      en: `Done: AST root ${root.kind}, normalized "${serializeRegex(root)}".`,
    })
    .setTree(toTreeNode(root, 'r'))
    .setAux([
      { label: '根节点', value: root.kind, role: 'final' as BarRole },
      { label: '规范化', value: serializeRegex(root), role: 'compare' as BarRole },
      { label: '节点总数', value: String(nodeCount), role: 'frontier' as BarRole },
    ])
    .commit();

  return rec.build();
}

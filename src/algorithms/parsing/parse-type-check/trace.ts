// =============================================================================
// 类型检查器 · 录制帧序列
// =============================================================================

import type { BarRole, Frame, TreeNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { typeCheck, type AstNode, type CheckHooks, type Type } from './impl.ts';

// (1 + 2) < (3 * 4)  → int < int → bool
export const DEFAULT_INPUT: AstNode = {
  type: 'BinOp',
  value: '<',
  children: [
    {
      type: 'BinOp',
      value: '+',
      children: [
        { type: 'Num', value: 1 },
        { type: 'Num', value: 2 },
      ],
    },
    {
      type: 'BinOp',
      value: '*',
      children: [
        { type: 'Num', value: 3 },
        { type: 'Num', value: 4 },
      ],
    },
  ],
};

const TYPE_ROLE: Record<Type, BarRole> = {
  int: 'compare',
  float: 'compare',
  bool: 'final',
  string: 'frontier',
  error: 'warn',
};

function toTreeNode(
  node: AstNode,
  types: Map<string, Type>,
  idPrefix: string,
  path: number[],
): TreeNode {
  const key = path.join('.');
  const t = types.get(key);
  return {
    id: idPrefix,
    value: t ? `${node.type}:${t}` : node.type,
    role: t ? TYPE_ROLE[t] : 'default',
    children: node.children?.map((c, i) => toTreeNode(c, types, `${idPrefix}.${i}`, [...path, i])),
  };
}

export function buildTrace(input: AstNode = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const types = new Map<string, Type>();

  rec
    .begin({
      zh: `类型检查表达式 AST（根 ${input.type}）。后序推导类型。`,
      en: `Type-checking expression AST (root ${input.type}). Post-order inference.`,
    })
    .setTree(toTreeNode(input, types, 'r', []))
    .setAux([
      { label: '根类型', value: '…', role: 'pivot' as BarRole },
      { label: '阶段', value: '开始', role: 'compare' as BarRole },
    ])
    .commit();

  const hooks: CheckHooks = {
    onInfer: (node, path, t) => {
      types.set(path.join('.'), t);
      rec
        .begin({
          zh: `推导 ${node.type}${node.value !== undefined ? ':' + node.value : ''} 的类型 = ${t}`,
          en: `Infer type of ${node.type}${node.value !== undefined ? ':' + node.value : ''} = ${t}`,
        })
        .setTree(toTreeNode(input, types, 'r', []))
        .setAux([
          { label: '节点', value: node.type, role: 'pivot' as BarRole },
          { label: '类型', value: t, role: TYPE_ROLE[t] },
          { label: '路径', value: path.join('.'), role: 'compare' as BarRole },
        ])
        .commit();
    },
    onError: (node, _path, msg) => {
      rec
        .begin({
          zh: `类型错误：${msg}（节点 ${node.type}）`,
          en: `Type error: ${msg} (node ${node.type})`,
        })
        .setAux([
          { label: '错误', value: msg, role: 'warn' as BarRole },
          { label: '节点', value: node.type, role: 'compare' as BarRole },
        ])
        .commit();
    },
  };

  const result = typeCheck(input, hooks);

  rec
    .begin({
      zh: `完成：根类型 = ${result.rootType}，${result.errors.length} 个类型错误。`,
      en: `Done: root type = ${result.rootType}, ${result.errors.length} errors.`,
    })
    .setTree(toTreeNode(input, result.nodeTypes, 'r', []))
    .setAux([
      { label: '根类型', value: result.rootType, role: TYPE_ROLE[result.rootType] },
      {
        label: '错误数',
        value: String(result.errors.length),
        role: (result.errors.length > 0 ? 'warn' : 'final') as BarRole,
      },
    ])
    .commit();

  return rec.build();
}

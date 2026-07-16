// =============================================================================
// PEG 表达式解析器 · 录制帧序列
// 用 tree 展示编译出的文法 AST（每条规则一棵子树），
// 用 array2d 展示输入字符与匹配进度，用 aux 展示规则调用与结果。
// =============================================================================

import type { BarRole, Frame, TreeNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import {
  compileGrammar,
  pegMatch,
  matchExpr,
  exprToTreeNode,
  DEMO_GRAMMAR_SRC,
  DEMO_INPUT,
  type PegHooks,
} from './impl.ts';

export const DEFAULT_INPUT = DEMO_INPUT;
export const DEFAULT_GRAMMAR = DEMO_GRAMMAR_SRC;

function cloneTree(n: TreeNode): TreeNode {
  return {
    id: n.id,
    value: n.value,
    role: n.role,
    edgeLabel: n.edgeLabel,
    children: n.children?.map(cloneTree),
  };
}

export function buildTrace(
  input: string = DEFAULT_INPUT,
  grammarSrc: string = DEFAULT_GRAMMAR,
): Frame[] {
  const rec = new TraceRecorder();
  const grammar = compileGrammar(grammarSrc);

  // 编译文法 AST 树：根 + 每条规则一个子节点
  const counter = { n: 0 };
  const ruleNodes: TreeNode[] = grammar.rules.map((r) => {
    const child = exprToTreeNode(r.expr, counter);
    return {
      id: `rule-${r.name}`,
      value: r.name,
      role: 'pivot',
      children: [child],
    };
  });
  const grammarRoot: TreeNode = {
    id: 'grammar-root',
    value: 'grammar',
    role: 'pivot',
    children: ruleNodes,
  };

  // 初始帧：展示编译出的文法 AST
  rec
    .begin({
      zh: `编译 PEG 文法（${grammar.rules.length} 条规则）`,
      en: `Compile PEG grammar (${grammar.rules.length} rules)`,
    })
    .setTree(cloneTree(grammarRoot))
    .setAux([
      { label: '文法源码', value: grammarSrc.replace(/\n/g, ' | '), role: 'default' as BarRole },
      { label: '起始规则', value: grammar.start, role: 'frontier' as BarRole },
      { label: '待匹配输入', value: input, role: 'compare' as BarRole },
    ])
    .commit();

  // 匹配并逐规则调用录帧
  const matchLog: Array<{ name: string; pos: number; ok: boolean }> = [];
  const hooks: PegHooks = {
    onMatch: (name, pos, result) => {
      matchLog.push({ name, pos, ok: 'ok' in result ? result.ok : false });
    },
  };
  const accepted = pegMatch(input, grammar, hooks);

  // 按规则调用录若干关键帧
  const sampled =
    matchLog.length > 8
      ? matchLog.filter((_, i) => i % Math.ceil(matchLog.length / 8) === 0)
      : matchLog;
  for (const log of sampled) {
    const chars = input.split('');
    const grid: { v: string; role: BarRole }[][] = [];
    grid.push(
      chars.map((ch, idx) => ({
        v: ch,
        role: (idx < log.pos ? 'sorted' : idx === log.pos ? 'pivot' : 'default') as BarRole,
      })),
    );
    rec
      .begin({
        zh: `规则 ${log.name} @${log.pos} → ${log.ok ? '成功' : '失败'}`,
        en: `Rule ${log.name} @${log.pos} → ${log.ok ? 'ok' : 'fail'}`,
      })
      .setGrid(grid.map((row) => row.map((c) => ({ v: c.v, role: c.role }))))
      .setAux([
        { label: '输入', value: input, role: 'compare' as BarRole },
        { label: '当前规则', value: `${log.name} @${log.pos}`, role: 'frontier' as BarRole },
        {
          label: '结果',
          value: log.ok ? '匹配' : '不匹配',
          role: (log.ok ? 'final' : 'warn') as BarRole,
        },
      ])
      .commit();
  }

  // 最终帧
  rec
    .begin({ zh: '完成', en: 'Done' })
    .setGrid([
      input.split('').map((ch) => ({ v: ch, role: (accepted ? 'final' : 'warn') as BarRole })),
    ])
    .setAux([
      {
        label: '结果',
        value: accepted ? '接受' : '拒绝',
        role: (accepted ? 'final' : 'warn') as BarRole,
      },
      { label: '规则调用数', value: String(matchLog.length), role: 'default' as BarRole },
    ])
    .commit();

  void matchExpr;
  return rec.build();
}

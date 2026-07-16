// =============================================================================
// EBNF 扩展巴科斯 · 录制帧序列
// 展示「EBNF 文本 → 规则 AST → 展开为纯 BNF」的过程。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { parseEBNF, serializeNode, desugar, type EbnfHooks } from './impl.ts';

export const DEFAULT_INPUT = `Expr ::= Term (('+' | '-') Term)*
Term ::= Factor (('*' | '/') Factor)*
Factor ::= num | '(' Expr ')'`;

/** 录制演示帧序列。 */
export function buildTrace(input: string = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();

  rec
    .begin({
      zh: `EBNF 源文本（含 * 重复、() 分组、| 选择）。开始解析。`,
      en: `EBNF source (with * repetition, () grouping, | choice). Parsing.`,
    })
    .setAux([
      { label: '输入', value: input, role: 'frontier' as BarRole },
      { label: '阶段', value: '解析为 AST', role: 'pivot' as BarRole },
    ])
    .commit();

  const hooks: EbnfHooks = {
    onRule: (rule) => {
      rec
        .begin({
          zh: `解析规则 ${rule.lhs} ::= ${serializeNode(rule.expr)}`,
          en: `Parsed rule ${rule.lhs} ::= ${serializeNode(rule.expr)}`,
        })
        .setAux([
          { label: '左部', value: rule.lhs, role: 'pivot' as BarRole },
          { label: 'AST', value: serializeNode(rule.expr), role: 'compare' as BarRole },
        ])
        .commit();
    },
  };

  const g = parseEBNF(input, hooks);
  const prods = desugar(g);

  rec
    .begin({
      zh: `展开为纯 BNF：得到 ${prods.length} 条产生式（含辅助非终结符）。`,
      en: `Desugared to plain BNF: ${prods.length} productions (with helper non-terminals).`,
    })
    .setAux([
      { label: '起始符', value: g.start, role: 'final' as BarRole },
      { label: '规则数', value: String(g.rules.length), role: 'compare' as BarRole },
      {
        label: 'BNF 产生式',
        value: prods
          .map(
            (p) =>
              `${p.lhs} ::= ${p.alternatives
                .map((a) =>
                  a.length === 0
                    ? 'ε'
                    : a.map((s) => (s.nonTerminal ? s.text : `'${s.text}'`)).join(' '),
                )
                .join(' | ')}`,
          )
          .join('\n'),
        role: 'frontier' as BarRole,
      },
    ])
    .commit();

  return rec.build();
}

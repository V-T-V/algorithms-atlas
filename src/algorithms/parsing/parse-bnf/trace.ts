// =============================================================================
// BNF 文法表示 · 录制帧序列
// 展示「源文本 → 逐条规则 → 结构化产生式」的解析过程。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { parseBNF, serializeBNF, type BnfHooks } from './impl.ts';

export const DEFAULT_INPUT = `<stmt> ::= <if_stmt> | <while_stmt> | <assign>
<assign> ::= 'id' '=' <expr>
<expr> ::= <expr> '+' <term> | <term>
<term> ::= 'id' | 'num'`;

/** 录制演示帧序列。 */
export function buildTrace(input: string = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();

  rec
    .begin({
      zh: `BNF 源文本（${input.split('\n').length} 行规则）。开始逐行解析。`,
      en: `BNF source (${input.split('\n').length} rule lines). Parsing line by line.`,
    })
    .setAux([
      { label: '输入', value: input, role: 'frontier' as BarRole },
      { label: '规则数', value: '0', role: 'pivot' as BarRole },
    ])
    .commit();

  const hooks: BnfHooks = {
    onRule: (rule) => {
      const altCount = rule.alternatives.length;
      rec
        .begin({
          zh: `解析规则 <${rule.lhs}>：共 ${altCount} 个候选。`,
          en: `Parsed rule <${rule.lhs}>: ${altCount} alternatives.`,
        })
        .setAux([
          { label: '左部', value: `<${rule.lhs}>`, role: 'pivot' as BarRole },
          { label: '候选数', value: String(altCount), role: 'compare' as BarRole },
          {
            label: '展开',
            value: rule.alternatives
              .map((a) =>
                a.length === 0
                  ? 'ε'
                  : a.map((s) => (s.nonTerminal ? `<${s.text}>` : `'${s.text}'`)).join(' '),
              )
              .join(' | '),
            role: 'frontier' as BarRole,
          },
        ])
        .commit();
    },
  };

  const grammar = parseBNF(input, hooks);

  rec
    .begin({
      zh: `解析完成：${grammar.rules.length} 条规则，起始符 <${grammar.start}>，${grammar.nonTerminals.size} 个非终结符，${grammar.terminals.size} 个终结符。`,
      en: `Done: ${grammar.rules.length} rules, start <${grammar.start}>, ${grammar.nonTerminals.size} non-terminals, ${grammar.terminals.size} terminals.`,
    })
    .setAux([
      { label: '起始符', value: `<${grammar.start}>`, role: 'final' as BarRole },
      {
        label: '非终结符',
        value: [...grammar.nonTerminals].map((n) => `<${n}>`).join(' '),
        role: 'pivot' as BarRole,
      },
      {
        label: '终结符',
        value: [...grammar.terminals].map((t) => `'${t}'`).join(' '),
        role: 'compare' as BarRole,
      },
      { label: '规范化', value: serializeBNF(grammar), role: 'frontier' as BarRole },
    ])
    .commit();

  return rec.build();
}

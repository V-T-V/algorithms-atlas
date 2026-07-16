// =============================================================================
// SLR(1) 冲突检测 · 录制帧序列
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { detectSLRConflicts, prodStr, type CFG, type SLRHooks } from './impl.ts';

// 经典 shift/reduce 冲突文法：悬空 else
// S → i E t S | i E t S e S | a    （对 e 移进还是规约？）
// 简化：S → a | S ; S    （二义递归常带来冲突）
export const DEFAULT_INPUT: CFG = {
  start: 'S',
  nonTerminals: new Set(['S']),
  productions: [
    { lhs: 'S', rhs: ['a'] },
    { lhs: 'S', rhs: ['S', ';', 'S'] },
  ],
};

export function buildTrace(input: CFG = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();

  rec
    .begin({
      zh: `文法 ${input.productions.length} 条产生式。构造 LR(0) 项目集规范族并扫描 SLR 冲突。`,
      en: `Grammar ${input.productions.length} productions. Build LR(0) item family and scan SLR conflicts.`,
    })
    .setAux([
      {
        label: '产生式',
        value: input.productions.map(prodStr).join('\n'),
        role: 'frontier' as BarRole,
      },
      { label: '起始', value: input.start, role: 'pivot' as BarRole },
    ])
    .commit();

  const hooks: SLRHooks = {
    onState: (s) => {
      const itemStrs = s.items.map((it) => {
        const p = input.productions[it.prodIndex]!;
        const before = p.rhs.slice(0, it.dot).join(' ');
        const after = p.rhs.slice(it.dot).join(' ');
        return `${p.lhs} → ${before}${before ? ' ' : ''}· ${after}`;
      });
      rec
        .begin({
          zh: `构造状态 I${s.id}（${s.items.length} 项目）`,
          en: `Build state I${s.id} (${s.items.length} items)`,
        })
        .setAux([
          { label: '状态', value: `I${s.id}`, role: 'pivot' as BarRole },
          { label: '项目', value: itemStrs.join('\n'), role: 'compare' as BarRole },
        ])
        .commit();
    },
    onConflict: (c) => {
      rec
        .begin({
          zh: `${c.kind === 'shift-reduce' ? '移进-规约' : '规约-规约'} 冲突：${c.detail}`,
          en: `${c.kind} conflict: ${c.detail}`,
        })
        .setAux([
          { label: '类型', value: c.kind, role: 'warn' as BarRole },
          { label: '终结符', value: c.terminal, role: 'compare' as BarRole },
          { label: '详情', value: c.detail, role: 'warn' as BarRole },
        ])
        .commit();
    },
  };

  const result = detectSLRConflicts(input, hooks);

  rec
    .begin({
      zh: result.isSLR1
        ? `无冲突：文法是 SLR(1)。`
        : `${result.conflicts.length} 处冲突，文法非 SLR(1)。`,
      en: result.isSLR1
        ? `No conflicts: grammar is SLR(1).`
        : `${result.conflicts.length} conflicts; grammar not SLR(1).`,
    })
    .setAux([
      {
        label: '判定',
        value: result.isSLR1 ? 'SLR(1)' : '非 SLR(1)',
        role: (result.isSLR1 ? 'final' : 'warn') as BarRole,
      },
      { label: '状态数', value: String(result.states.length), role: 'compare' as BarRole },
      { label: '冲突数', value: String(result.conflicts.length), role: 'frontier' as BarRole },
    ])
    .commit();

  return rec.build();
}

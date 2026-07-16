// =============================================================================
// 死代码消除 · 录制帧序列
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { eliminateDeadCode, type DCEHooks, type Stmt } from './impl.ts';

export const DEFAULT_INPUT: Stmt[] = [
  { kind: 'assign', target: 'x', uses: ['a', 'b'] }, // x = a+b；x 被后续使用 → 活
  { kind: 'assign', target: 'y', uses: ['c'] }, // y = c；y 从未使用 → 死
  { kind: 'assign', target: 'z', uses: ['x'] }, // z = x；z 未使用 → 死
  { kind: 'expr', uses: ['x'] }, // 用 x
  { kind: 'return', uses: ['x'] },
  { kind: 'assign', target: 'w', uses: ['a'] }, // 不可达
];

function stmtStr(s: Stmt): string {
  if (s.kind === 'assign') return `${s.target} = f(${s.uses.join(',')})`;
  if (s.kind === 'return') return `return ${s.uses.join(',')}`;
  return `expr(${s.uses.join(',')})`;
}

export function buildTrace(input: Stmt[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();

  rec
    .begin({
      zh: `线性 IR ${input.length} 条语句。开始 DCE：可达性 + 活跃变量。`,
      en: `Linear IR with ${input.length} statements. DCE: reachability + liveness.`,
    })
    .setAux([
      { label: 'IR', value: input.map(stmtStr).join('\n'), role: 'frontier' as BarRole },
      { label: '语句数', value: String(input.length), role: 'pivot' as BarRole },
    ])
    .commit();

  const hooks: DCEHooks = {
    onUnreachable: (s, i) => {
      rec
        .begin({
          zh: `不可达：第 ${i} 条「${stmtStr(s)}」`,
          en: `Unreachable: stmt ${i} "${stmtStr(s)}"`,
        })
        .setAux([
          { label: '类型', value: '不可达', role: 'warn' as BarRole },
          { label: '语句', value: stmtStr(s), role: 'compare' as BarRole },
        ])
        .commit();
    },
    onDeadAssign: (s, i) => {
      rec
        .begin({
          zh: `死赋值：第 ${i} 条「${stmtStr(s)}」（${s.kind === 'assign' ? s.target : ''} 不再活跃）`,
          en: `Dead assign: stmt ${i} "${stmtStr(s)}"`,
        })
        .setAux([
          { label: '类型', value: '死赋值', role: 'warn' as BarRole },
          { label: '语句', value: stmtStr(s), role: 'compare' as BarRole },
        ])
        .commit();
    },
  };

  const result = eliminateDeadCode(input, hooks);

  rec
    .begin({
      zh: `完成：${input.length} → ${result.stmts.length} 语句（删 ${result.removedUnreachable} 不可达 + ${result.removedDeadAssign} 死赋值）。`,
      en: `Done: ${input.length} → ${result.stmts.length} (removed ${result.removedUnreachable} unreachable + ${result.removedDeadAssign} dead).`,
    })
    .setAux([
      { label: '剩余语句', value: String(result.stmts.length), role: 'final' as BarRole },
      { label: '删不可达', value: String(result.removedUnreachable), role: 'compare' as BarRole },
      { label: '删死赋值', value: String(result.removedDeadAssign), role: 'compare' as BarRole },
      {
        label: '精简 IR',
        value: result.stmts.map(stmtStr).join('\n'),
        role: 'frontier' as BarRole,
      },
    ])
    .commit();

  return rec.build();
}

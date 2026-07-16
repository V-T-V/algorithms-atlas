// =============================================================================
// 表达式加运算符 · 录制帧序列
// 可视化：setAux 展示当前表达式串与求值；setBars 展示数段。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { expressionAddOperators, type ExpressionAddOperatorsHooks } from './impl.ts';

export interface EaoInput {
  num: string;
  target: number;
}
export const DEFAULT_INPUT: EaoInput = { num: '123', target: 6 };

/** 录制演示帧序列。 */
export function buildTrace(input: EaoInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { num, target } = input;
  const solutions: string[] = [];

  rec
    .begin({
      zh: `在 "${num}" 中插入 +、-、* 使其等于 ${target}`,
      en: `Insert +,-,* into "${num}" to get ${target}`,
    })
    .setBars([...num].map((d) => ({ value: Number(d), role: 'default' as BarRole })))
    .setAux([
      { label: 'num', value: num, role: 'default' },
      { label: 'target', value: String(target), role: 'pivot' },
    ])
    .commit();

  const hooks: ExpressionAddOperatorsHooks = {
    onSolution: (expr, value) => {
      solutions.push(expr);
      rec
        .begin({ zh: `命中：${expr} = ${value}`, en: `Hit: ${expr} = ${value}` })
        .setBars(
          [...expr].map((d) => ({ value: / d/.test(d) ? Number(d) : 0, role: 'final' as BarRole })),
        )
        .setAux([
          { label: '表达式', value: expr, role: 'final' },
          { label: '求值', value: String(value), role: 'final' },
          { label: 'target', value: String(target), role: 'pivot' },
          { label: '已命中数', value: String(solutions.length), role: 'default' },
        ])
        .commit();
    },
    onPrune: (seg) => {
      rec
        .begin({ zh: `剪枝：前导零 "${seg}" 非法`, en: `Prune: leading zero "${seg}"` })
        .setAux([{ label: '非法段', value: seg, role: 'warn' }])
        .commit();
    },
    onSegment: () => {
      void 0;
    },
    onOperator: () => {
      void 0;
    },
  };

  const result = expressionAddOperators(num, target, hooks);

  rec
    .begin({
      zh: `完成：共 ${result.length} 个表达式`,
      en: `Done: ${result.length} expressions`,
    })
    .setAux([
      { label: '全部解', value: result.join(' | ') || '∅', role: 'final' },
      { label: '个数', value: String(result.length), role: 'final' },
    ])
    .commit();

  return rec.build();
}

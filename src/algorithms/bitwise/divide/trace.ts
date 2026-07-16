// =============================================================================
// 位运算除法 · 录制帧序列
// 演示一对操作数的「移位减法」长除法过程；setAux 展示每位试商。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { divide, type DivideHooks } from './impl.ts';

export const DEFAULT_INPUT = { a: 43, b: 5 };

/** 录制演示帧序列。 */
export function buildTrace(input: { a: number; b: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { a, b } = input;

  rec
    .begin({
      zh: `计算 ${a} ÷ ${b}（移位减法长除法）`,
      en: `Compute ${a} ÷ ${b} (shift-subtract long division)`,
    })
    .setAux([
      { label: '被除数 a', value: String(a), role: 'pivot' },
      { label: '除数 b', value: String(b), role: 'pivot' },
    ])
    .commit();

  const hooks: DivideHooks = {
    onStep: ({ shift, fit, remainder }) => {
      rec
        .begin({
          zh: `试位移 k = ${shift}：b << ${shift} = ${Math.abs(b) << shift}，${fit ? '够减 → 商位 1' : '不够减 → 商位 0'}，余数 = ${remainder}`,
          en: `Shift k = ${shift}: b << ${shift} = ${Math.abs(b) << shift}; ${fit ? 'fits → quotient bit 1' : 'too large → quotient bit 0'}; remainder = ${remainder}`,
        })
        .setAux([
          { label: `b << ${shift}`, value: String(Math.abs(b) << shift), role: 'compare' },
          { label: '是否够减', value: fit ? '是 yes' : '否 no', role: fit ? 'frontier' : 'warn' },
          { label: '当前余数', value: String(remainder), role: 'frontier' },
        ] as Array<{ label: string; value: string; role?: BarRole }>)
        .commit();
    },
  };

  const { quotient, remainder } = divide(a, b, hooks);

  rec
    .begin({
      zh: `完成：${a} = ${quotient} × ${b} + ${remainder}`,
      en: `Done: ${a} = ${quotient} × ${b} + ${remainder}`,
    })
    .setAux([
      { label: '商 quotient', value: String(quotient), role: 'final' },
      { label: '余数 remainder', value: String(remainder), role: 'final' },
    ] as Array<{ label: string; value: string; role?: BarRole }>)
    .commit();

  return rec.build();
}

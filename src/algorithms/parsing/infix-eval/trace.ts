// =============================================================================
// 中缀求值 · 录制帧序列
// 用 setAux 展示「操作数栈」与「运算符栈」的逐步变化 + 已读/待读。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { infixEval, tokenize, type InfixEvalHooks } from './impl.ts';

export const DEFAULT_INPUT = '3 + 4 * 2 - (1 + 5) * 2';

/** 录制演示帧序列。 */
export function buildTrace(input: string = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const tokens = tokenize(input);
  const operands: number[] = [];
  const operators: string[] = [];
  let readIdx = -1;
  let flashToken = '';
  let result = NaN;

  const snapshot = (note: { zh: string; en: string }): void => {
    // 操作数栈（栈底 index 0，栈顶末尾）
    const operandAux = operands.map((v, i) => {
      const isTop = i === operands.length - 1;
      return {
        label: `num[${i}]`,
        value: String(v),
        role: (isTop && flashToken === String(v)
          ? 'swap'
          : isTop
            ? 'frontier'
            : 'default') as BarRole,
      };
    });
    // 运算符栈
    const opAux = operators.map((op, i) => {
      const isTop = i === operators.length - 1;
      return {
        label: `op[${i}]`,
        value: op,
        role: (isTop && op === flashToken ? 'pivot' : isTop ? 'frontier' : 'default') as BarRole,
      };
    });

    const consumed = tokens.slice(0, readIdx + 1).join(' ');
    const remaining = tokens.slice(readIdx + 1).join(' ');

    const aux: Array<{ label: string; value: string; role?: BarRole }> = [
      { label: 'input', value: `[${consumed}] ▍ ${remaining}`, role: 'compare' as BarRole },
      { label: '─── 运算符栈', value: '栈底 ... 栈顶', role: 'default' as BarRole },
      ...opAux,
      { label: '─── 操作数栈', value: '栈底 ... 栈顶', role: 'default' as BarRole },
      ...operandAux,
    ];
    if (!Number.isNaN(result)) {
      aux.push({ label: '结果 / result', value: String(result), role: 'final' as BarRole });
    }

    rec.begin(note).setAux(aux).commit();
    flashToken = '';
  };

  snapshot({
    zh: `中缀表达式：${input}`,
    en: `Infix expression: ${input}`,
  });

  const hooks: InfixEvalHooks = {
    onRead: (token) => {
      readIdx++;
      flashToken = token;
      snapshot({
        zh: `读取 token "${token}"`,
        en: `Read token "${token}"`,
      });
    },
    onPushOperand: (v) => {
      operands.push(v);
      flashToken = String(v);
      snapshot({
        zh: `操作数 ${v} 入栈`,
        en: `Push operand ${v}`,
      });
    },
    onPushOperator: (op) => {
      operators.push(op);
      flashToken = op;
      snapshot({
        zh: `运算符 "${op}" 入栈`,
        en: `Push operator "${op}"`,
      });
    },
    onCompute: (op, a, b, r) => {
      // 弹出 a, b, op
      operators.pop();
      operands.pop();
      operands.pop();
      operands.push(r);
      flashToken = String(r);
      snapshot({
        zh: `计算 ${a} ${op} ${b} = ${r}`,
        en: `Compute ${a} ${op} ${b} = ${r}`,
      });
    },
    onResult: (v) => {
      result = v;
      snapshot({
        zh: `最终结果 = ${v}`,
        en: `Final result = ${v}`,
      });
    },
  };

  infixEval(tokens, hooks);

  // 终态
  rec
    .begin({ zh: '完成', en: 'Done' })
    .setAux([
      { label: '表达式', value: input, role: 'compare' as BarRole },
      { label: '结果 / result', value: String(result), role: 'final' as BarRole },
    ])
    .commit();

  return rec.build();
}

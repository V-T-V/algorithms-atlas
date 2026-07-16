// =============================================================================
// 调度场算法 · 录制帧序列
// 用 setAux 展示「输出队列」与「运算符栈」两区。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { shuntingYard, type ShuntingYardHooks } from './impl.ts';

export const DEFAULT_INPUT = ['3', '+', '4', '*', '2', '/', '(', '1', '-', '5', ')', '^', '2'];

/** 录制演示帧序列。 */
export function buildTrace(input: string[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const output: string[] = [];
  const opStack: string[] = [];
  let readIdx = -1;
  let flashToken = '';

  const snapshot = (note: { zh: string; en: string }): void => {
    // 输出队列
    const outAux = output.map((t, i) => ({
      label: `out[${i}]`,
      value: t,
      role: (t === flashToken ? 'swap' : 'final') as BarRole,
    }));
    // 运算符栈（栈底在 index 0，栈顶在末尾）
    const stackAux = opStack.map((t, i) => {
      const isTop = i === opStack.length - 1;
      return {
        label: `stack[${i}]`,
        value: t,
        role: (isTop && t === flashToken ? 'pivot' : isTop ? 'frontier' : 'default') as BarRole,
      };
    });

    const aux = [
      ...stackAux,
      { label: '───', value: '│ 栈底 ... 栈顶', role: 'default' as BarRole },
      ...outAux,
    ];

    // 已读 / 待读提示
    const consumed = input.slice(0, readIdx + 1).join(' ');
    const remaining = input.slice(readIdx + 1).join(' ');
    aux.unshift({
      label: 'input',
      value: `[${consumed}] ▍ ${remaining}`,
      role: 'compare' as BarRole,
    });

    rec.begin(note).setAux(aux).commit();
    flashToken = '';
  };

  snapshot({
    zh: `中缀：${input.join(' ')}`,
    en: `Infix: ${input.join(' ')}`,
  });

  const hooks: ShuntingYardHooks = {
    onRead: (token) => {
      readIdx++;
      flashToken = token;
      snapshot({
        zh: `读取 token "${token}"`,
        en: `Read token "${token}"`,
      });
    },
    onPushOp: (op) => {
      opStack.push(op);
      flashToken = op;
      snapshot({
        zh: `运算符 "${op}" 入栈`,
        en: `Push operator "${op}" onto stack`,
      });
    },
    onPop: (op) => {
      flashToken = op;
    },
    onEmit: (token) => {
      output.push(token);
      flashToken = token;
      const isOp = token in { '+': 1, '-': 1, '*': 1, '/': 1, '%': 1, '^': 1 };
      snapshot({
        zh: isOp ? `运算符 "${token}" 弹栈 → 输出` : `操作数 "${token}" → 输出`,
        en: isOp ? `Pop operator "${token}" → output` : `Operand "${token}" → output`,
      });
    },
  };

  const result = shuntingYard(input, hooks);

  // 终态
  rec
    .begin({
      zh: `后缀（逆波兰）：${result.join(' ')}`,
      en: `Postfix (RPN): ${result.join(' ')}`,
    })
    .setAux([{ label: 'postfix', value: result.join(' '), role: 'final' as BarRole }])
    .commit();

  return rec.build();
}

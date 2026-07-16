// =============================================================================
// 中缀表达式求值（Infix Eval）· 纯算法实现
// 双栈法：操作数栈 + 运算符栈，支持四则运算 + - * / 与括号，处理优先级。
// 零 DOM 依赖，可独立单测。通过「钩子」暴露 读token / 入栈 / 计算每一步。
// =============================================================================

/** 运算符优先级与结合性表。 */
export const OPERATORS: Record<string, { prec: number; leftAssoc: boolean }> = {
  '+': { prec: 1, leftAssoc: true },
  '-': { prec: 1, leftAssoc: true },
  '*': { prec: 2, leftAssoc: true },
  '/': { prec: 2, leftAssoc: true },
};

/** 算法执行过程中的事件钩子。任一可选。 */
export interface InfixEvalHooks {
  /** 读到一个 token。 */
  onRead?: (token: string) => void;
  /** 操作数压栈。 */
  onPushOperand?: (value: number) => void;
  /** 运算符压栈。 */
  onPushOperator?: (op: string) => void;
  /** 执行一次二元运算 op(a, b)，把结果压回操作数栈。 */
  onCompute?: (op: string, a: number, b: number, result: number) => void;
  /** 得到最终结果。 */
  onResult?: (value: number) => void;
}

/** 简易分词：把中缀字符串切成 token 数组（支持多位数、小数与运算符）。 */
export function tokenize(expr: string): string[] {
  const tokens: string[] = [];
  const re = / s*([()+\-*/]| d+(?:\. d+)?) s*/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(expr)) !== null) {
    tokens.push(m[1]!);
  }
  return tokens;
}

function apply(op: string, a: number, b: number): number {
  switch (op) {
    case '+':
      return a + b;
    case '-':
      return a - b;
    case '*':
      return a * b;
    case '/':
      return a / b;
    default:
      throw new Error(`未知运算符 / unknown operator: ${op}`);
  }
}

/**
 * 双栈法求值中缀表达式（token 数组）。
 * 支持运算符 + - * / 与圆括号 ( )。
 *
 * 规则：
 *  - 操作数 → 压入操作数栈
 *  - ( → 压入运算符栈
 *  - ) → 弹出运算符并计算，直到遇见 (
 *  - 运算符 → 弹出栈顶优先级 ≥ 当前的运算符并计算，再压入当前
 *  - 末尾 → 弹出所有剩余运算符并计算
 *
 * @param tokens 中缀表达式（已分词）
 * @param hooks 可选事件钩子
 * @returns 求值结果
 */
export function infixEval(tokens: readonly string[], hooks: InfixEvalHooks = {}): number {
  const operands: number[] = [];
  const operators: string[] = [];

  const compute = (): void => {
    const op = operators.pop()!;
    const b = operands.pop()!;
    const a = operands.pop()!;
    const r = apply(op, a, b);
    operands.push(r);
    hooks.onCompute?.(op, a, b, r);
  };

  for (const token of tokens) {
    hooks.onRead?.(token);

    if (token === '(') {
      operators.push(token);
      hooks.onPushOperator?.(token);
      continue;
    }
    if (token === ')') {
      while (operators.length > 0 && operators[operators.length - 1] !== '(') {
        compute();
      }
      // 弹出左括号
      if (operators.length > 0 && operators[operators.length - 1] === '(') {
        operators.pop();
      }
      continue;
    }

    const cur = OPERATORS[token];
    if (cur) {
      while (operators.length > 0) {
        const top = operators[operators.length - 1]!;
        if (top === '(') break;
        const topOp = OPERATORS[top];
        if (!topOp) break;
        const shouldCompute = topOp.prec > cur.prec || (topOp.prec === cur.prec && cur.leftAssoc);
        if (!shouldCompute) break;
        compute();
      }
      operators.push(token);
      hooks.onPushOperator?.(token);
    } else {
      // 操作数
      const v = parseFloat(token);
      if (Number.isNaN(v)) {
        throw new Error(`非法 token / invalid token: ${token}`);
      }
      operands.push(v);
      hooks.onPushOperand?.(v);
    }
  }

  // 弹出剩余运算符
  while (operators.length > 0) {
    compute();
  }

  const result = operands[0] ?? 0;
  hooks.onResult?.(result);
  return result;
}

/** 便捷：直接对字符串表达式求值。 */
export function evalExpr(expr: string, hooks: InfixEvalHooks = {}): number {
  return infixEval(tokenize(expr), hooks);
}

// =============================================================================
// 调度场算法（Shunting Yard）· 纯算法实现
// Dijkstra 的中缀转后缀（逆波兰）算法。零 DOM 依赖，可独立单测。
// 通过「钩子」暴露 读token / 入运算符栈 / 弹栈输出。
// =============================================================================

/** 运算符优先级与结合性表（可扩展）。结合性：true=左结合。 */
export const OPERATORS: Record<string, { prec: number; leftAssoc: boolean }> = {
  '+': { prec: 1, leftAssoc: true },
  '-': { prec: 1, leftAssoc: true },
  '*': { prec: 2, leftAssoc: true },
  '/': { prec: 2, leftAssoc: true },
  '%': { prec: 2, leftAssoc: true },
  '^': { prec: 3, leftAssoc: false }, // 右结合（幂）
};

/** 算法执行过程中的事件钩子。任一可选。 */
export interface ShuntingYardHooks {
  /** 读到一个 token。 */
  onRead?: (token: string) => void;
  /** 把运算符压入运算符栈。 */
  onPushOp?: (op: string) => void;
  /** 把运算符从栈中弹出。 */
  onPop?: (op: string) => void;
  /** 把 token 输出到输出队列。 */
  onEmit?: (token: string) => void;
}

/**
 * 把中缀表达式 token 数组转为后缀（逆波兰）token 数组。
 * 支持运算符 + - * / % ^、圆括号 ( )、操作数（数字或标识符）。
 *
 * @param tokens 中缀表达式（已分词）
 * @param hooks 可选事件钩子
 * @returns 后缀表达式 token 数组
 */
export function shuntingYard(tokens: readonly string[], hooks: ShuntingYardHooks = {}): string[] {
  const output: string[] = [];
  const opStack: string[] = [];

  for (const token of tokens) {
    hooks.onRead?.(token);

    if (token === '(') {
      opStack.push(token);
      hooks.onPushOp?.(token);
      continue;
    }
    if (token === ')') {
      // 弹栈直到左括号
      while (opStack.length > 0 && opStack[opStack.length - 1] !== '(') {
        const op = opStack.pop()!;
        output.push(op);
        hooks.onPop?.(op);
        hooks.onEmit?.(op);
      }
      // 弹出左括号（丢弃，不输出）
      if (opStack.length > 0 && opStack[opStack.length - 1] === '(') {
        opStack.pop();
      }
      continue;
    }

    const cur = OPERATORS[token];
    if (cur) {
      // 与栈顶比较：弹出优先级更高或（同级且左结合）的运算符
      while (opStack.length > 0) {
        const top = opStack[opStack.length - 1]!;
        if (top === '(') break;
        const topOp = OPERATORS[top];
        if (!topOp) break;
        const shouldPop = topOp.prec > cur.prec || (topOp.prec === cur.prec && cur.leftAssoc);
        if (!shouldPop) break;
        const popped = opStack.pop()!;
        output.push(popped);
        hooks.onPop?.(popped);
        hooks.onEmit?.(popped);
      }
      opStack.push(token);
      hooks.onPushOp?.(token);
    } else {
      // 操作数：直接输出
      output.push(token);
      hooks.onEmit?.(token);
    }
  }

  // 弹出剩余运算符
  while (opStack.length > 0) {
    const op = opStack.pop()!;
    output.push(op);
    hooks.onPop?.(op);
    hooks.onEmit?.(op);
  }

  return output;
}

/** 简易分词：把中缀字符串切成 token 数组（支持多位数与运算符）。 */
export function tokenize(expr: string): string[] {
  const tokens: string[] = [];
  const re = / s*([()+\-*/%^]| d+(?:\. d+)?|[A-Za-z_]\w*) s*/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(expr)) !== null) {
    tokens.push(m[1]!);
  }
  return tokens;
}

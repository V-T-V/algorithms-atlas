// =============================================================================
// Pratt 解析器（优先级爬升）· 纯算法实现
// 用结合力（binding power）表驱动表达式解析：
//   + - 左结合（左结合力=右结合力，左结合：lbp < rbp 不成立，用 lbp=rbp）
//   * / 左结合
//   ^   右结合（右结合力 > 左结合力）
// 支持括号、数字。返回求值结果。
// 零 DOM 依赖，可独立单测。
// =============================================================================

/** 运算符的结合力（左、右）。左结合：lbp==rbp；右结合：lbp<rbp。 */
const BINDING_POWER: Record<string, { left: number; right: number }> = {
  '+': { left: 10, right: 10 },
  '-': { left: 10, right: 10 },
  '*': { left: 20, right: 20 },
  '/': { left: 20, right: 20 },
  '^': { left: 31, right: 30 }, // 右结合：先吃右边的 ^
};

/** 算法执行过程中的事件钩子。任一可选。 */
export interface PrattHooks {
  /** 进入结合力为 minBp 的子解析。 */
  onEnter?: (minBp: number) => void;
  /** 解析出一个数字字面量。 */
  onNumber?: (value: number) => void;
  /** 生成一个二元运算节点（op + 左右操作数）。 */
  onBinary?: (op: string, left: number, right: number, result: number) => void;
  /** 解析完成。 */
  onResult?: (value: number) => void;
}

/** 简易分词：支持数字（含小数）、运算符、括号。 */
export function tokenize(expr: string): string[] {
  const tokens: string[] = [];
  const re = / s*([()+\-*/^]| d+(?:\. d+)?) s*/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(expr)) !== null) {
    tokens.push(m[1]!);
  }
  return tokens;
}

/**
 * Pratt 解析器：把中缀表达式 token 数组解析并求值。
 * 支持 + - * / ^ 与圆括号。^ 右结合，其余左结合。
 *
 * @param tokens 中缀表达式（已分词），如 ['1','+','2','*','3']
 * @param hooks 可选事件钩子
 * @returns 求值结果
 */
export function prattParse(tokens: readonly string[], hooks: PrattHooks = {}): number {
  let pos = 0;

  const peek = (): string | undefined => tokens[pos];
  const advance = (): string => {
    const t = tokens[pos]!;
    pos++;
    return t;
  };

  /** 解析「主元」（nud）：数字 或 括号子表达式 或 一元负号。 */
  const parsePrimary = (): number => {
    const t = peek();
    if (t === undefined) throw new Error('意外结束 / unexpected end of input');
    if (t === '(') {
      advance(); // (
      const v = parseExpr(0);
      if (peek() === ')') advance(); // )
      return v;
    }
    if (t === '-') {
      // 一元负号
      advance();
      const operand = parsePrimary();
      const result = -operand;
      return result;
    }
    if (t === '+') {
      advance();
      return parsePrimary();
    }
    // 数字
    const num = parseFloat(advance());
    hooks.onNumber?.(num);
    return num;
  };

  /**
   * 解析表达式：先取一个主元，然后只要当前运算符的左结合力 > minBp，
   * 就把它作为二元运算符，递归解析右边（用右结合力作为新的 minBp）。
   */
  const parseExpr = (minBp: number): number => {
    hooks.onEnter?.(minBp);
    let left = parsePrimary();
    for (;;) {
      const op = peek();
      if (op === undefined || op === ')') break;
      const bp = BINDING_POWER[op];
      if (!bp) {
        throw new Error(`未知运算符 / unknown operator: ${op}`);
      }
      if (bp.left <= minBp) break; // 当前运算符结合力不足，交给上层
      advance(); // 消费运算符
      const right = parseExpr(bp.right); // 右递归用右结合力
      const result = apply(op, left, right);
      hooks.onBinary?.(op, left, right, result);
      left = result;
    }
    return left;
  };

  const value = parseExpr(0);
  hooks.onResult?.(value);
  return value;
}

/** 应用二元运算。 */
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
    case '^':
      return Math.pow(a, b);
    default:
      throw new Error(`未知运算符 / unknown operator: ${op}`);
  }
}

/** 便捷：解析字符串表达式并求值。 */
export function evalExpr(expr: string, hooks: PrattHooks = {}): number {
  return prattParse(tokenize(expr), hooks);
}

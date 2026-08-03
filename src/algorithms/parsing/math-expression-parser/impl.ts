// 数学表达式解析（含函数）· 纯算法实现

export type MathFunc = (...args: number[]) => number;

export interface MathEnv {
  functions?: Record<string, MathFunc>;
  constants?: Record<string, number>;
}

/** 默认函数库。 */
export const DEFAULT_FUNCTIONS: Record<string, MathFunc> = {
  sin: (x) => Math.sin(x),
  cos: (x) => Math.cos(x),
  tan: (x) => Math.tan(x),
  sqrt: (x) => Math.sqrt(x),
  abs: (x) => Math.abs(x),
  exp: (x) => Math.exp(x),
  ln: (x) => Math.log(x),
  log: (x, b = 10) => Math.log(x) / Math.log(b),
  max: (...a) => Math.max(...a),
  min: (...a) => Math.min(...a),
  pow: (a, b) => Math.pow(a, b),
};

export const DEFAULT_CONSTANTS: Record<string, number> = {
  pi: Math.PI,
  e: Math.E,
};

/** 事件钩子。 */
export interface MathParserHooks {
  /** 进入某非终结符。 */
  onEnter?: (nt: string) => void;
  /** 调用某函数（给出名称与实参）。 */
  onCall?: (name: string, args: number[], result: number) => void;
  /** 完成（给出结果）。 */
  onResult?: (value: number) => void;
}

interface Cursor {
  s: string;
  pos: number;
}

function skipWs(c: Cursor): void {
  while (c.pos < c.s.length && /\s/.test(c.s[c.pos]!)) c.pos++;
}
function peek(c: Cursor): string {
  return c.pos < c.s.length ? c.s[c.pos]! : '';
}

/**
 * 解析并求值数学表达式。
 *
 * @param expr 表达式
 * @param env 函数与常量环境（默认含三角/对数等）
 * @param hooks 可选事件钩子
 * @returns 数值结果
 */
export function evalMath(expr: string, env: MathEnv = {}, hooks: MathParserHooks = {}): number {
  const fns = { ...DEFAULT_FUNCTIONS, ...env.functions };
  const consts = { ...DEFAULT_CONSTANTS, ...env.constants };
  const c: Cursor = { s: expr, pos: 0 };

  const parseExpr = (): number => {
    hooks.onEnter?.('expr');
    let v = parseTerm();
    skipWs(c);
    while (peek(c) === '+' || peek(c) === '-') {
      const op = c.s[c.pos++]!;
      const r = parseTerm();
      v = op === '+' ? v + r : v - r;
      skipWs(c);
    }
    return v;
  };

  const parseTerm = (): number => {
    hooks.onEnter?.('term');
    let v = parseFactor();
    skipWs(c);
    while (peek(c) === '*' || peek(c) === '/') {
      const op = c.s[c.pos++]!;
      const r = parseFactor();
      v = op === '*' ? v * r : v / r;
      skipWs(c);
    }
    return v;
  };

  const parseFactor = (): number => {
    hooks.onEnter?.('factor');
    const base = parseUnary();
    skipWs(c);
    if (peek(c) === '^') {
      c.pos++;
      const exp = parseFactor(); // 右结合：递归
      return Math.pow(base, exp);
    }
    return base;
  };

  const parseUnary = (): number => {
    hooks.onEnter?.('unary');
    skipWs(c);
    if (peek(c) === '-') {
      c.pos++;
      return -parseUnary();
    }
    if (peek(c) === '+') {
      c.pos++;
      return parseUnary();
    }
    return parseAtom();
  };

  const parseAtom = (): number => {
    hooks.onEnter?.('atom');
    skipWs(c);
    const ch = peek(c);
    if (ch === '(') {
      c.pos++;
      const v = parseExpr();
      skipWs(c);
      if (peek(c) === ')') c.pos++;
      return v;
    }
    // 数字
    if (/[0-9.]/.test(ch)) {
      let num = '';
      while (c.pos < c.s.length && /[0-9.]/.test(c.s[c.pos]!)) num += c.s[c.pos++]!;
      return parseFloat(num);
    }
    // 标识符（函数或常量）
    if (/[A-Za-z_]/.test(ch)) {
      let id = '';
      while (c.pos < c.s.length && /[A-Za-z0-9_]/.test(c.s[c.pos]!)) id += c.s[c.pos++]!;
      skipWs(c);
      if (peek(c) === '(') {
        // 函数调用
        c.pos++;
        const args: number[] = [];
        skipWs(c);
        if (peek(c) !== ')') {
          args.push(parseExpr());
          skipWs(c);
          while (peek(c) === ',') {
            c.pos++;
            args.push(parseExpr());
            skipWs(c);
          }
        }
        if (peek(c) === ')') c.pos++;
        const fn = fns[id];
        if (!fn) throw new Error(`未知函数: ${id}`);
        const result = fn(...args);
        hooks.onCall?.(id, args, result);
        return result;
      }
      // 常量
      if (id in consts) return consts[id]!;
      throw new Error(`未知标识符: ${id}`);
    }
    throw new Error(`无法解析 @${c.pos}: "${peek(c)}"`);
  };

  const result = parseExpr();
  skipWs(c);
  if (c.pos < c.s.length) throw new Error(`未消费字符 @${c.pos}: "${c.s.slice(c.pos)}"`);
  hooks.onResult?.(result);
  return result;
}

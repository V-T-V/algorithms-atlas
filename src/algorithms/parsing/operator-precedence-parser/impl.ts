// 算符优先分析 · 纯算法实现
// 移进-归约：用算符优先关系比较栈顶算符与输入算符。

export interface OppToken {
  kind: 'num' | 'op' | 'lparen' | 'rparen';
  value: string;
}

export interface OppStep {
  stack: string[];
  input: string[];
  action: 'shift' | 'reduce' | 'accept' | 'match';
}

/** 事件钩子。 */
export interface OppHooks {
  /** 每一步（shift/reduce/match/accept）。 */
  onStep?: (step: OppStep) => void;
  /** 一次归约（给出运算符与两操作数，及结果）。 */
  onReduce?: (op: string, left: number, right: number, result: number) => void;
  /** 完成（给出最终值）。 */
  onResult?: (value: number) => void;
}

const PREC: Record<string, number> = { '+': 1, '-': 1, '*': 2, '/': 2, '^': 3 };

function isOp(t: string): boolean {
  return t in PREC;
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
    case '^':
      return Math.pow(a, b);
    default:
      throw new Error(`未知运算符 ${op}`);
  }
}

/** 把表达式字符串切为 token（数字/算符/括号）。 */
function lex(expr: string): OppToken[] {
  const toks: OppToken[] = [];
  let i = 0;
  while (i < expr.length) {
    const c = expr[i]!;
    if (c === ' ') {
      i++;
      continue;
    }
    if (/[0-9]/.test(c)) {
      let j = i;
      while (j < expr.length && /[0-9.]/.test(expr[j]!)) j++;
      toks.push({ kind: 'num', value: expr.slice(i, j) });
      i = j;
    } else if (isOp(c)) {
      toks.push({ kind: 'op', value: c });
      i++;
    } else if (c === '(') {
      toks.push({ kind: 'lparen', value: c });
      i++;
    } else if (c === ')') {
      toks.push({ kind: 'rparen', value: c });
      i++;
    } else {
      throw new Error(`非法字符: ${c}`);
    }
  }
  return toks;
}

/** 栈顶算符 vs 输入算符 的优先关系：< > = '' */
function relation(stackTop: string, inputOp: string): '<' | '>' | '=' | '' {
  if (stackTop === '(' && inputOp === ')') return '=';
  if (stackTop === '(') return '<';
  if (inputOp === '(') return '<';
  if (inputOp === ')') return '>';
  if (!isOp(stackTop) || !isOp(inputOp)) return '';
  const ps = PREC[stackTop]!;
  const pi = PREC[inputOp]!;
  if (ps < pi) return '<';
  if (ps > pi) return '>';
  // 同级：^ 右结合用 <（继续移进），其余左结合用 >（归约）
  if (stackTop === '^' && inputOp === '^') return '<';
  return '>';
}

/**
 * 算符优先分析并求值。
 *
 * @param expr 表达式字符串
 * @param hooks 可选事件钩子
 * @returns 计算结果
 */
export function operatorPrecedenceParse(expr: string, hooks: OppHooks = {}): number {
  const tokens = lex(expr);
  // 加 $ 结尾哨兵
  const input: OppToken[] = [...tokens, { kind: 'op', value: '$' }];
  // 栈：混存数字与算符/括号；用 $ 作栈底
  const stack: string[] = ['$'];
  const valStack: number[] = [];
  let ip = 0;

  const step = (action: OppStep['action']): void => {
    hooks.onStep?.({
      stack: [...stack],
      input: input.slice(ip).map((t) => t.value),
      action,
    });
  };

  while (true) {
    const top = stack[stack.length - 1]!;
    const cur = input[ip]!;
    const curVal = cur.value;
    // 接受：栈为 $ E，输入为 $
    if (top === '$' && curVal === '$') {
      step('accept');
      hooks.onResult?.(valStack[valStack.length - 1] ?? NaN);
      return valStack[valStack.length - 1] ?? NaN;
    }
    // 找栈顶最近的「算符或括号或$」进行比较
    let topOp = top;
    if (!isOp(topOp) && topOp !== '(' && topOp !== ')' && topOp !== '$') {
      // 栈顶是操作数，比较其下的算符
      for (let k = stack.length - 2; k >= 0; k--) {
        const s = stack[k]!;
        if (isOp(s) || s === '(' || s === '$') {
          topOp = s;
          break;
        }
      }
    }
    if (cur.kind === 'num') {
      // 移进数字
      stack.push(curVal);
      valStack.push(parseFloat(curVal));
      ip++;
      step('shift');
      continue;
    }
    if (cur.kind === 'lparen') {
      stack.push('(');
      ip++;
      step('shift');
      continue;
    }
    const rel = relation(topOp, curVal);
    if (rel === '<' || rel === '=') {
      if (curVal === ')' && rel === '=') {
        // 弹出 '(' 配对
        stack.pop(); // 弹 rparen 还没入栈；先弹出栈顶的 '('
        // 实际：栈顶是 '('，弹出它
        const lpIdx = stack.lastIndexOf('(');
        if (lpIdx >= 0) stack.splice(lpIdx, 1);
        ip++;
        step('match');
        continue;
      }
      stack.push(curVal);
      ip++;
      step('shift');
      continue;
    }
    if (rel === '>') {
      // 归约：E op E -> E
      // 弹出一个算符和两个操作数
      // 找栈顶的算符位置
      let opIdx = -1;
      for (let k = stack.length - 1; k >= 0; k--) {
        if (isOp(stack[k]!)) {
          opIdx = k;
          break;
        }
      }
      if (opIdx < 0) throw new Error('归约失败：栈中无算符');
      const op = stack[opIdx]!;
      const right = valStack.pop()!;
      const left = valStack.pop()!;
      const result = apply(op, left, right);
      hooks.onReduce?.(op, left, right, result);
      // 从栈中移除 op 及其两侧操作数，压入一个占位操作数 'E'
      // 栈结构: ... E op E -> ... E
      stack.splice(opIdx - 1, 3, 'E');
      valStack.push(result);
      step('reduce');
      continue;
    }
    throw new Error(`无法判定关系: top=${topOp}, input=${curVal}`);
  }
}

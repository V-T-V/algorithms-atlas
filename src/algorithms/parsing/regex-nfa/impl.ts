// =============================================================================
// 正则 → NFA（Thompson 构造）· 纯算法实现
// 支持：单个字符、拼接、选择 |、Kleene 星号 *、分组括号 ( )
// 流程：正则串 → AST（递归下降）→ ε-NFA（Thompson 模板）
// 提供 ε-闭包模拟，用于匹配验证。
// 零 DOM 依赖，可独立单测。
// =============================================================================

/** ε 转移用 null 标记。 */
export type TransitionSymbol = string | null;

/** 一条转移：from --symbol(ε=null)--> to。 */
export interface Transition {
  from: number;
  to: number;
  /** null = ε 转移。 */
  symbol: TransitionSymbol;
}

/** ε-NFA。 */
export interface Nfa {
  /** 状态数（状态编号 0..states-1）。 */
  states: number;
  /** 起始状态。 */
  start: number;
  /** 接受状态。 */
  accept: number;
  /** 转移表。 */
  transitions: Transition[];
}

/** 算法执行过程中的事件钩子。任一可选。 */
export interface RegexNfaHooks {
  /** 解析出一个子 NFA 片段。 */
  onFragment?: (kind: 'char' | 'concat' | 'alt' | 'star', nfa: Nfa) => void;
  /** 最终 NFA 构造完成。 */
  onResult?: (nfa: Nfa) => void;
}

// ---------------------------------------------------------------------------
// 解析器：正则 → AST（节点用小 Nfa 片段表示，边解析边构造）
// 文法（优先级由低到高）：
//   alt    → concat ('|' concat)*
//   concat → star+
//   star   → atom '*'?
//   atom   → char | '(' alt ')'
// ---------------------------------------------------------------------------

/** Thompson NFA 构造器：维护状态计数器，逐步组装片段。 */
class NfaBuilder {
  states = 0;
  transitions: Transition[] = [];

  newState(): number {
    return this.states++;
  }

  addTransition(from: number, to: number, symbol: TransitionSymbol): void {
    this.transitions.push({ from, to, symbol });
  }

  /** 基本：单个字符 c。 */
  char(c: string): Nfa {
    const s = this.newState();
    const a = this.newState();
    this.addTransition(s, a, c);
    return { states: this.states, start: s, accept: a, transitions: [...this.transitions] };
  }

  /** 拼接 n1 · n2。 */
  concat(n1: Nfa, n2: Nfa): Nfa {
    // n1.accept --ε--> n2.start
    this.addTransition(n1.accept, n2.start, null);
    return {
      states: this.states,
      start: n1.start,
      accept: n2.accept,
      transitions: [...this.transitions],
    };
  }

  /** 选择 n1 | n2：新起、新止。 */
  alt(n1: Nfa, n2: Nfa): Nfa {
    const s = this.newState();
    const a = this.newState();
    this.addTransition(s, n1.start, null);
    this.addTransition(s, n2.start, null);
    this.addTransition(n1.accept, a, null);
    this.addTransition(n2.accept, a, null);
    return {
      states: this.states,
      start: s,
      accept: a,
      transitions: [...this.transitions],
    };
  }

  /** Kleene 星号 n*：新起、新止 + 环回。 */
  star(n: Nfa): Nfa {
    const s = this.newState();
    const a = this.newState();
    this.addTransition(s, n.start, null); // 进入
    this.addTransition(s, a, null); // 跳过（匹配 0 次）
    this.addTransition(n.accept, n.start, null); // 重复
    this.addTransition(n.accept, a, null); // 退出
    return {
      states: this.states,
      start: s,
      accept: a,
      transitions: [...this.transitions],
    };
  }
}

/**
 * 把正则表达式转换为 ε-NFA（Thompson 构造）。
 * 支持：单字符、拼接、|、*、( )。
 *
 * @param pattern 正则串，如 "ab", "a|b", "a*", "(ab)*"
 * @param hooks 可选事件钩子
 * @returns ε-NFA
 */
export function regexToNfa(pattern: string, hooks: RegexNfaHooks = {}): Nfa {
  const builder = new NfaBuilder();
  let pos = 0;

  const peek = (): string | undefined => pattern[pos];
  const eof = (): boolean => pos >= pattern.length;

  // alt → concat ('|' concat)*
  const parseAlt = (): Nfa => {
    let node = parseConcat();
    while (!eof() && peek() === '|') {
      pos++; // 消费 |
      const right = parseConcat();
      node = builder.alt(node, right);
      hooks.onFragment?.('alt', node);
    }
    return node;
  };

  // concat → star+（空正则产生一个 ε-only 片段）
  const parseConcat = (): Nfa => {
    // 用 ε 片段作为单位元（concat 的零元）
    const eps = epsilonFragment(builder);
    let node = eps;
    while (!eof() && peek() !== ')' && peek() !== '|') {
      const right = parseStar();
      node = builder.concat(node, right);
      hooks.onFragment?.('concat', node);
    }
    return node;
  };

  // star → atom '*'?
  const parseStar = (): Nfa => {
    let node = parseAtom();
    while (!eof() && peek() === '*') {
      pos++; // 消费 *
      node = builder.star(node);
      hooks.onFragment?.('star', node);
    }
    return node;
  };

  // atom → char | '(' alt ')'
  const parseAtom = (): Nfa => {
    const t = peek();
    if (t === '(') {
      pos++; // 消费 (
      const node = parseAlt();
      if (peek() === ')') pos++; // 消费 )
      return node;
    }
    if (t === undefined) {
      // 空输入：ε 片段
      return epsilonFragment(builder);
    }
    pos++; // 消费字符
    const node = builder.char(t);
    hooks.onFragment?.('char', node);
    return node;
  };

  const result = parseAlt();
  hooks.onResult?.(result);
  return result;
}

/** 构造一个 ε-only 片段（起 --ε--> 止）。 */
function epsilonFragment(b: NfaBuilder): Nfa {
  const s = b.newState();
  const a = b.newState();
  b.addTransition(s, a, null);
  return { states: b.states, start: s, accept: a, transitions: [...b.transitions] };
}

// ---------------------------------------------------------------------------
// NFA 模拟匹配（ε-闭包）——用于验证构造正确性
// ---------------------------------------------------------------------------

/** 计算 states 集合的 ε-闭包。 */
export function epsilonClosure(nfa: Nfa, states: Set<number>): Set<number> {
  const result = new Set(states);
  const stack = [...states];
  while (stack.length > 0) {
    const s = stack.pop()!;
    for (const t of nfa.transitions) {
      if (t.from === s && t.symbol === null && !result.has(t.to)) {
        result.add(t.to);
        stack.push(t.to);
      }
    }
  }
  return result;
}

/** 从当前状态集消费一个字符后的下一状态集（含 ε-闭包）。 */
function move(nfa: Nfa, states: Set<number>, c: string): Set<number> {
  const next = new Set<number>();
  for (const s of states) {
    for (const t of nfa.transitions) {
      if (t.from === s && t.symbol === c) next.add(t.to);
    }
  }
  return epsilonClosure(nfa, next);
}

/**
 * 用 NFA 模拟匹配字符串。
 * @returns 是否被接受
 */
export function nfaAccepts(nfa: Nfa, input: string): boolean {
  let cur = epsilonClosure(nfa, new Set([nfa.start]));
  for (const ch of input) {
    cur = move(nfa, cur, ch);
    if (cur.size === 0) return false;
  }
  return cur.has(nfa.accept);
}

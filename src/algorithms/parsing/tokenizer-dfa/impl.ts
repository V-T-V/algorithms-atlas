// DFA 词法分析器 · 纯算法实现

export type TokenType = 'identifier' | 'number' | 'operator' | 'punctuation' | 'whitespace';

export interface Token {
  type: TokenType;
  value: string;
  position: number;
}

type DfaState = 'start' | 'ident' | 'num' | 'op' | 'punct' | 'ws';

/** 事件钩子。 */
export interface LexerHooks {
  /** 状态转换。 */
  onTransition?: (from: DfaState, to: DfaState, char: string) => void;
  /** 发射一个 token。 */
  onEmit?: (token: Token) => void;
  /** 完成。 */
  onResult?: (tokens: Token[]) => void;
}

function isIdentStart(c: string): boolean {
  return /[A-Za-z_]/.test(c);
}
function isIdentPart(c: string): boolean {
  return /[A-Za-z0-9_]/.test(c);
}
function isDigit(c: string): boolean {
  return /[0-9]/.test(c);
}
function isOp(c: string): boolean {
  return '+-*/%=<>!&|^'.includes(c);
}
function isPunct(c: string): boolean {
  return '(){}[];,:.'.includes(c);
}
function isWs(c: string): boolean {
  return / s/.test(c);
}

/**
 * DFA 词法分析。
 *
 * @param source 源码字符串
 * @param hooks 可选事件钩子
 * @returns token 列表（含 whitespace，可由调用方过滤）
 */
export function tokenize(source: string, hooks: LexerHooks = {}): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  const n = source.length;
  let state: DfaState = 'start';

  const emit = (type: TokenType, value: string, pos: number): void => {
    const t: Token = { type, value, position: pos };
    tokens.push(t);
    hooks.onEmit?.(t);
  };

  while (i < n) {
    const c = source[i]!;
    const prevState = state as DfaState;
    if (isWs(c)) {
      state = 'ws';
    } else if (isIdentStart(c)) {
      state = 'ident';
    } else if (isDigit(c)) {
      state = 'num';
    } else if (isOp(c)) {
      state = 'op';
    } else if (isPunct(c)) {
      state = 'punct';
    } else {
      state = 'punct'; // 未知字符当标点
    }
    if (state !== prevState) hooks.onTransition?.(prevState, state, c);

    const startPos = i;
    if (state === 'ident') {
      let j = i;
      while (j < n && isIdentPart(source[j]!)) j++;
      emit('identifier', source.slice(i, j), startPos);
      i = j;
    } else if (state === 'num') {
      let j = i;
      while (j < n && isDigit(source[j]!)) j++;
      emit('number', source.slice(i, j), startPos);
      i = j;
    } else if (state === 'op') {
      // 连续运算符合并（如 ==, <=, !=, &&）
      let j = i;
      while (j < n && isOp(source[j]!)) j++;
      emit('operator', source.slice(i, j), startPos);
      i = j;
    } else if (state === 'punct') {
      emit('punctuation', c, startPos);
      i++;
    } else {
      // ws
      let j = i;
      while (j < n && isWs(source[j]!)) j++;
      emit('whitespace', source.slice(i, j), startPos);
      i = j;
    }
    state = 'start';
  }

  hooks.onResult?.(tokens);
  return tokens;
}

/** 过滤掉空白 token。 */
export function withoutWhitespace(tokens: readonly Token[]): Token[] {
  return tokens.filter((t) => t.type !== 'whitespace');
}

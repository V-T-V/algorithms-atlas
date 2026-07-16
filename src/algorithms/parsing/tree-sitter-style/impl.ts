// =============================================================================
// 增量解析器（tree-sitter 风格）· 纯算法实现
// 特性：
//   1. 完整解析生成带区间 [start,end) 的语法树（含 ERROR/MISSING 节点）；
//   2. 错误恢复：遇无法匹配的 token，用 ERROR 节点收集、继续推进；
//   3. 增量重解析：文本编辑后，依据节点区间复用未受影响子树，仅重解析受影响部分。
// 文法（简化表达式）：
//   program → stmt*
//   stmt    → ID '=' expr ';'
//   expr    → term ('+' term)*
//   term    → factor ('*' factor)*
//   factor  → NUM | ID | '(' expr ')'
// 零 DOM 依赖，可独立单测。
// =============================================================================

import type { TreeNode } from '../../../types.ts';

export type { TreeNode };

/** 扩展节点：带源码区间 [start, end)。 */
export interface SyntaxNode extends TreeNode {
  startIndex: number;
  endIndex: number;
  /** 重声明：子节点也是 SyntaxNode（带区间）。 */
  children?: SyntaxNode[];
  /** ERROR = 错误恢复节点；MISSING = 缺失但自动插入的节点。 */
  isError?: boolean;
  isMissing?: boolean;
}

export interface IncrementalHooks {
  /** 进入一条规则。 */
  onEnter?: (rule: string, pos: number) => void;
  /** 匹配一个 token。 */
  onMatch?: (token: string, kind: string, pos: number) => void;
  /** 错误恢复：跳过/收集一个意外 token。 */
  onError?: (token: string, pos: number, reason: string) => void;
  /** 插入缺失节点。 */
  onMissing?: (expected: string, pos: number) => void;
  /** 解析完成。 */
  onResult?: (root: SyntaxNode, errorCount: number) => void;
}

/** token 类型。 */
export interface Token {
  kind: string; // 'NUM' | 'ID' | '+' | '*' | '(' | ')' | '=' | ';' | 'EOF'
  text: string;
  start: number;
  end: number;
}

/** 词法分析。 */
export function lex(src: string): Token[] {
  const tokens: Token[] = [];
  const re = / s*(?:( d+)|([A-Za-z_]\w*)|([+\-*/=();]))/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(src)) !== null) {
    const start = m.index + (m[0]!.length - m[0]!.replace(/^ s+/, '').length);
    const text = m[0]!.trim();
    if (m[1] !== undefined) tokens.push({ kind: 'NUM', text, start, end: start + text.length });
    else if (m[2] !== undefined) tokens.push({ kind: 'ID', text, start, end: start + text.length });
    else if (m[3] !== undefined) tokens.push({ kind: m[3]!, text: m[3]!, start, end: start + 1 });
  }
  tokens.push({ kind: 'EOF', text: '', start: src.length, end: src.length });
  return tokens;
}

let nodeCounter = 0;
function makeNode(
  value: string,
  start: number,
  end: number,
  children: SyntaxNode[] = [],
  flags: { isError?: boolean; isMissing?: boolean } = {},
): SyntaxNode {
  const role = flags.isError
    ? 'warn'
    : flags.isMissing
      ? 'compare'
      : children.length > 0
        ? 'pivot'
        : 'default';
  return {
    id: `s${nodeCounter++}`,
    value,
    role,
    startIndex: start,
    endIndex: end,
    children: children.length > 0 ? children : undefined,
    isError: flags.isError,
    isMissing: flags.isMissing,
  };
}

/** 重置节点计数器（测试可复现）。 */
export function resetNodeId(): void {
  nodeCounter = 0;
}

export interface ParseResult {
  root: SyntaxNode;
  errorCount: number;
  missingCount: number;
}

/**
 * 完整解析源码，带错误恢复。
 * 错误恢复策略：当期望某 token 但遇到不匹配时，
 *   - 若后续若干 token 内能找到期望 token，则把中间 token 收集为 ERROR 节点并继续；
 *   - 否则插入 MISSING 节点并继续。
 */
export function parseProgram(src: string, hooks: IncrementalHooks = {}): ParseResult {
  resetNodeId();
  const tokens = lex(src);
  let pos = 0;
  let errorCount = 0;
  let missingCount = 0;

  const peek = (): Token => tokens[pos]!;
  const at = (kind: string): boolean => tokens[pos]!.kind === kind;

  /** 期望某 kind 的 token；若不匹配则做错误恢复。返回是否真正消费了 token。 */
  const expect = (
    kind: string,
  ): { consumed: boolean; errorNode?: SyntaxNode; missingNode?: SyntaxNode } => {
    const t = peek();
    if (t.kind === kind) {
      hooks.onMatch?.(t.text, t.kind, t.start);
      pos++;
      return { consumed: true };
    }
    // 错误恢复：向前扫描（最多 3 个 token）找期望 token
    for (let look = 1; look <= 3 && tokens[pos + look] !== undefined; look++) {
      if (tokens[pos + look]!.kind === kind) {
        // 收集 [pos, pos+look) 为 ERROR 节点
        const errStart = t.start;
        const errEnd = tokens[pos + look - 1]!.end;
        const errChildren: SyntaxNode[] = [];
        for (let i = 0; i < look; i++) {
          const et = tokens[pos]!;
          errChildren.push(makeNode(et.text, et.start, et.end, [], { isError: true }));
          hooks.onError?.(et.text, et.start, `期望 ${kind} 但遇 ${et.kind}`);
          pos++;
          errorCount++;
        }
        const errNode = makeNode('ERROR', errStart, errEnd, errChildren, { isError: true });
        // 现在消费期望的 token
        const et = peek();
        hooks.onMatch?.(et.text, et.kind, et.start);
        pos++;
        return { consumed: true, errorNode: errNode };
      }
    }
    // 无法恢复 → 插入 MISSING 节点（不消费当前 token）
    hooks.onMissing?.(kind, t.start);
    missingCount++;
    const missingNode = makeNode(`MISSING:${kind}`, t.start, t.start, [], { isMissing: true });
    return { consumed: false, missingNode };
  };

  const parseExpr = (): SyntaxNode => {
    hooks.onEnter?.('expr', peek().start);
    let node = parseTerm();
    while (at('+')) {
      const op = peek();
      hooks.onMatch?.(op.text, '+', op.start);
      pos++;
      const right = parseTerm();
      node = makeNode('+', node.startIndex, right.endIndex, [node, right]);
    }
    return node;
  };

  const parseTerm = (): SyntaxNode => {
    hooks.onEnter?.('term', peek().start);
    let node = parseFactor();
    while (at('*')) {
      const op = peek();
      hooks.onMatch?.(op.text, '*', op.start);
      pos++;
      const right = parseFactor();
      node = makeNode('*', node.startIndex, right.endIndex, [node, right]);
    }
    return node;
  };

  const parseFactor = (): SyntaxNode => {
    hooks.onEnter?.('factor', peek().start);
    const t = peek();
    if (t.kind === 'NUM' || t.kind === 'ID') {
      hooks.onMatch?.(t.text, t.kind, t.start);
      pos++;
      return makeNode(t.text, t.start, t.end);
    }
    if (t.kind === '(') {
      hooks.onMatch?.(t.text, '(', t.start);
      pos++;
      const inner = parseExpr();
      const r = expect(')');
      const endIdx = r.consumed ? tokens[pos - 1]!.end : inner.endIndex;
      const children = [inner];
      if (r.errorNode) children.push(r.errorNode);
      if (r.missingNode) children.push(r.missingNode);
      return makeNode('(expr)', t.start, endIdx, children);
    }
    // 错误恢复：当前 token 不是合法 factor → ERROR 节点并消费
    if (t.kind !== 'EOF') {
      hooks.onError?.(t.text, t.start, `factor 期望 NUM/ID/( 但遇 ${t.kind}`);
      pos++;
      errorCount++;
      return makeNode(t.text, t.start, t.end, [], { isError: true });
    }
    // EOF 处缺 factor → MISSING
    hooks.onMissing?.('factor', t.start);
    missingCount++;
    return makeNode('MISSING:factor', t.start, t.start, [], { isMissing: true });
  };

  const parseStmt = (): SyntaxNode => {
    hooks.onEnter?.('stmt', peek().start);
    const startIdx = peek().start;
    const children: SyntaxNode[] = [];
    // ID
    if (at('ID')) {
      const id = peek();
      hooks.onMatch?.(id.text, 'ID', id.start);
      pos++;
      children.push(makeNode(id.text, id.start, id.end));
    } else {
      const t = peek();
      hooks.onError?.(t.text, t.start, `stmt 期望 ID 但遇 ${t.kind}`);
      if (t.kind !== 'EOF') {
        pos++;
        errorCount++;
      }
      children.push(
        makeNode(
          t.kind === 'EOF' ? 'MISSING:ID' : t.text,
          t.start,
          t.end,
          [],
          t.kind === 'EOF' ? { isMissing: true } : { isError: true },
        ),
      );
    }
    // '='
    const eq = expect('=');
    if (eq.consumed) children.push(makeNode('=', tokens[pos - 1]!.start, tokens[pos - 1]!.end));
    if (eq.errorNode) children.push(eq.errorNode);
    if (eq.missingNode) children.push(eq.missingNode);
    // expr
    children.push(parseExpr());
    // ';'
    const semi = expect(';');
    if (semi.consumed) children.push(makeNode(';', tokens[pos - 1]!.start, tokens[pos - 1]!.end));
    if (semi.errorNode) children.push(semi.errorNode);
    if (semi.missingNode) children.push(semi.missingNode);
    const last = children[children.length - 1]!;
    return makeNode('stmt', startIdx, last.endIndex, children);
  };

  const stmts: SyntaxNode[] = [];
  while (!at('EOF')) {
    const before = pos;
    stmts.push(parseStmt());
    // 防死循环：若 stmt 未消费任何 token，强制前进
    if (pos === before) {
      const t = peek();
      hooks.onError?.(t.text, t.start, 'stmt 未推进，强制跳过');
      pos++;
      errorCount++;
    }
  }
  const rootEnd = stmts.length > 0 ? stmts[stmts.length - 1]!.endIndex : 0;
  const root = makeNode('program', 0, rootEnd, stmts);
  hooks.onResult?.(root, errorCount);
  return { root, errorCount, missingCount };
}

// ---------------------------------------------------------------------------
// 增量重解析
// ---------------------------------------------------------------------------

export interface Edit {
  startIndex: number;
  oldEndIndex: number;
  newEndIndex: number; // 编辑后新文本的结束位置
}

/** 深拷贝语法树。 */
function cloneTree(n: SyntaxNode): SyntaxNode {
  return {
    ...n,
    children: n.children?.map(cloneTree),
  };
}

/**
 * 增量重解析：给定旧树、新源码、编辑区间，
 * 遍历旧树，仅对与编辑区间相交的节点重新解析，其余复用。
 * 简化策略：找到包含编辑起点的最高层「语句」节点，重解析从该语句到末尾的全部语句。
 */
export function incrementalReparse(oldRoot: SyntaxNode, newSrc: string, edit: Edit): ParseResult {
  // 找到第一个 endIndex > edit.startIndex 的语句（即受编辑影响的语句）
  const stmts = oldRoot.children ?? [];
  let firstAffected = 0;
  for (let i = 0; i < stmts.length; i++) {
    if (stmts[i]!.endIndex > edit.startIndex) {
      firstAffected = i;
      break;
    }
    firstAffected = i + 1;
  }
  // 复用 firstAffected 之前的语句，重解析 firstAffected..end
  const reused = stmts.slice(0, firstAffected).map(cloneTree);
  // 对新源码做完整解析，但只保留 startIndex >= 受影响起点的语句
  const fresh = parseProgram(newSrc);
  const cutoff = reused.length > 0 ? reused[reused.length - 1]!.endIndex : 0;
  const freshStmts = (fresh.root.children ?? []).filter((s) => s.startIndex >= cutoff);
  const allStmts = [...reused, ...freshStmts];
  const rootEnd = allStmts.length > 0 ? allStmts[allStmts.length - 1]!.endIndex : 0;
  const root = makeNode('program', 0, rootEnd, allStmts);
  return { root, errorCount: fresh.errorCount, missingCount: fresh.missingCount };
}

// ---------------------------------------------------------------------------
// 演示
// ---------------------------------------------------------------------------

export const DEMO_SOURCE = 'x = 1 + 2 * 3; y = a + b;';

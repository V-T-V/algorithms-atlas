// =============================================================================
// Packrat 解析（PEG + memoization）· 纯算法实现
// 规则用 PEG 表达式：字面量 / 序列 / 有序选择 / 星号重复。
// 每位置对每规则缓存结果（成功+新位置 或 失败），保证 O(n)。
// 零 DOM 依赖，可独立单测。
// =============================================================================

/** PEG 表达式。 */
export type PegExpr =
  | { kind: 'lit'; value: string } // 匹配字面子串
  | { kind: 'ref'; name: string } // 引用规则
  | { kind: 'seq'; parts: PegExpr[] } // 顺序连接
  | { kind: 'choice'; alts: PegExpr[] } // 有序选择
  | { kind: 'star'; expr: PegExpr } // 零或多次重复
  | { kind: 'opt'; expr: PegExpr }; // 可选

/** PEG 规则。 */
export interface PegRule {
  name: string;
  expr: PegExpr;
}

/** PEG 文法。 */
export interface PegGrammar {
  start: string;
  rules: PegRule[];
}

/** 解析结果：成功返回新位置，失败返回 null。 */
export type PegResult = { ok: true; pos: number } | { ok: false };

/** 记忆表：memo[pos][ruleName] = PegResult。 */
export type MemoTable = Map<string, Map<string, PegResult>>;

export interface PackratHooks {
  /** 尝试在位置 pos 应用规则 ruleName（命中缓存或新算）。 */
  onTry?: (pos: number, ruleName: string, cached: boolean) => void;
  /** 规则在位置 pos 的最终结果。 */
  onResult?: (pos: number, ruleName: string, result: PegResult) => void;
}

/** 解析一条表达式（不记忆化，仅规则引用走记忆表）。 */
function matchExpr(
  expr: PegExpr,
  input: string,
  pos: number,
  grammar: PegGrammar,
  memo: MemoTable,
  hooks: PackratHooks,
): PegResult {
  switch (expr.kind) {
    case 'lit': {
      if (input.startsWith(expr.value, pos)) {
        return { ok: true, pos: pos + expr.value.length };
      }
      return { ok: false };
    }
    case 'ref': {
      return matchRule(expr.name, input, pos, grammar, memo, hooks);
    }
    case 'seq': {
      let cur = pos;
      for (const part of expr.parts) {
        const r = matchExpr(part, input, cur, grammar, memo, hooks);
        if (!r.ok) return { ok: false };
        cur = r.pos;
      }
      return { ok: true, pos: cur };
    }
    case 'choice': {
      for (const alt of expr.alts) {
        const r = matchExpr(alt, input, pos, grammar, memo, hooks);
        if (r.ok) return r;
      }
      return { ok: false };
    }
    case 'star': {
      let cur = pos;
      // 防御性循环上限（避免空匹配死循环）
      let guard = 0;
      while (guard < input.length + 1) {
        const r = matchExpr(expr.expr, input, cur, grammar, memo, hooks);
        if (!r.ok || r.pos === cur) break;
        cur = r.pos;
        guard++;
      }
      return { ok: true, pos: cur };
    }
    case 'opt': {
      const r = matchExpr(expr.expr, input, pos, grammar, memo, hooks);
      if (r.ok) return r;
      return { ok: true, pos };
    }
  }
}

/** 应用一条规则（带记忆化）。 */
function matchRule(
  name: string,
  input: string,
  pos: number,
  grammar: PegGrammar,
  memo: MemoTable,
  hooks: PackratHooks,
): PegResult {
  // 查缓存
  let posMemo = memo.get(name);
  if (posMemo === undefined) {
    posMemo = new Map<string, PegResult>();
    memo.set(name, posMemo);
  }
  if (posMemo.has(String(pos))) {
    const cached = posMemo.get(String(pos))!;
    hooks.onTry?.(pos, name, true);
    hooks.onResult?.(pos, name, cached);
    return cached;
  }

  // 找规则
  const rule = grammar.rules.find((r) => r.name === name);
  if (rule === undefined) {
    const fail: PegResult = { ok: false };
    posMemo.set(String(pos), fail);
    hooks.onTry?.(pos, name, false);
    hooks.onResult?.(pos, name, fail);
    return fail;
  }

  hooks.onTry?.(pos, name, false);
  // 注意：PEG 可左递归（本简化实现不支持左递归，会因记忆化未填充而返回失败）
  const result = matchExpr(rule.expr, input, pos, grammar, memo, hooks);
  posMemo.set(String(pos), result);
  hooks.onResult?.(pos, name, result);
  return result;
}

/** Packrat 解析入口。 */
export function packratParse(
  input: string,
  grammar: PegGrammar,
  hooks: PackratHooks = {},
): { accepted: boolean; memo: MemoTable } {
  const memo: MemoTable = new Map();
  const result = matchRule(grammar.start, input, 0, grammar, memo, hooks);
  const accepted = result.ok && result.pos === input.length;
  return { accepted, memo };
}

// ---------------------------------------------------------------------------
// 示例 PEG 文法：识别 "a* b"（任意个 a 后接一个 b）
//   Start ← AB
//   AB    ← A* b
//   A     ← a
// ---------------------------------------------------------------------------
export const SAMPLE_GRAMMAR: PegGrammar = {
  start: 'Start',
  rules: [
    { name: 'Start', expr: { kind: 'ref', name: 'AB' } },
    {
      name: 'AB',
      expr: {
        kind: 'seq',
        parts: [
          { kind: 'star', expr: { kind: 'ref', name: 'A' } },
          { kind: 'lit', value: 'b' },
        ],
      },
    },
    { name: 'A', expr: { kind: 'lit', value: 'a' } },
  ],
};

// ---------------------------------------------------------------------------
// 示例 PEG 文法 2：识别 (a|b)c（有序选择）
//   S ← (A / B) C
//   A ← a
//   B ← b
//   C ← c
// ---------------------------------------------------------------------------
export const CHOICE_GRAMMAR: PegGrammar = {
  start: 'S',
  rules: [
    {
      name: 'S',
      expr: {
        kind: 'seq',
        parts: [
          {
            kind: 'choice',
            alts: [
              { kind: 'ref', name: 'A' },
              { kind: 'ref', name: 'B' },
            ],
          },
          { kind: 'ref', name: 'C' },
        ],
      },
    },
    { name: 'A', expr: { kind: 'lit', value: 'a' } },
    { name: 'B', expr: { kind: 'lit', value: 'b' } },
    { name: 'C', expr: { kind: 'lit', value: 'c' } },
  ],
};

// =============================================================================
// 解析器组合子 · 纯算法实现
// 一个解析器是 (input, pos) → ParseResult<T> 的纯函数。
// 通过 seq / choice / many / map / sepBy 等高阶函数组合。
// 零 DOM 依赖，可独立单测。
// =============================================================================

import type { TreeNode } from '../../../types.ts';

export type { TreeNode };

/** 解析结果。 */
export type ParseResult<T> =
  | { ok: true; value: T; pos: number }
  | { ok: false; error: string; pos: number };

/** 解析器类型。 */
export type Parser<T> = (input: string, pos: number) => ParseResult<T>;

export interface CombinatorHooks {
  /** 尝试在 pos 处运行某个命名解析器。 */
  onTry?: (name: string, pos: number) => void;
  /** 某次尝试成功。 */
  onSuccess?: (name: string, pos: number, newPos: number) => void;
  /** 某次尝试失败。 */
  onFailure?: (name: string, pos: number, error: string) => void;
}

// ---------------------------------------------------------------------------
// 基础解析器
// ---------------------------------------------------------------------------

/** 命名包装：给解析器起名，便于 hook 与错误信息。 */
export function named<T>(name: string, p: Parser<T>, hooks?: CombinatorHooks): Parser<T> {
  return (input, pos) => {
    hooks?.onTry?.(name, pos);
    const r = p(input, pos);
    if (r.ok) {
      hooks?.onSuccess?.(name, pos, r.pos);
      return r;
    }
    hooks?.onFailure?.(name, pos, r.error);
    return r;
  };
}

/** 匹配字面字符串。 */
export function string(s: string): Parser<string> {
  return (input, pos) => {
    if (input.startsWith(s, pos)) return { ok: true, value: s, pos: pos + s.length };
    return { ok: false, error: `期望 "${s}"`, pos };
  };
}

/** 匹配正则（从 pos 起，anchored）。返回匹配文本。 */
export function regex(pattern: string, name?: string): Parser<string> {
  const re = new RegExp(`^(?:${pattern})`);
  return (input, pos) => {
    const sub = input.slice(pos);
    const m = re.exec(sub);
    if (m) return { ok: true, value: m[0], pos: pos + m[0].length };
    return { ok: false, error: `期望 /${pattern}/${name ? ` (${name})` : ''}`, pos };
  };
}

/** 匹配输入末尾。 */
export function eof(): Parser<null> {
  return (input, pos) => {
    if (pos >= input.length) return { ok: true, value: null, pos };
    return { ok: false, error: '期望 EOF', pos };
  };
}

/** 总是成功，不消费输入（返回常量值）。 */
export function succeed<T>(value: T): Parser<T> {
  return () => ({ ok: true, value, pos: 0 });
}

/** 总是失败。 */
export function fail<T>(error: string): Parser<T> {
  return (_input, pos) => ({ ok: false, error, pos });
}

// ---------------------------------------------------------------------------
// 组合子
// ---------------------------------------------------------------------------

/**
 * 顺序组合：依次运行 parsers，全部成功才成功，值为结果数组。
 * 回溯语义：任一失败则整体失败（位置不变）。
 * 注：为支持异构 parser 数组，此处用 unknown[]；调用方可通过泛型断言恢复元组类型。
 */
export function seq(
  parsers: ReadonlyArray<Parser<unknown>>,
  hooks?: CombinatorHooks,
): Parser<unknown[]> {
  return (input, pos) => {
    const results: unknown[] = [];
    let cur = pos;
    for (const p of parsers) {
      const r = p(input, cur);
      if (!r.ok) return { ok: false, error: r.error, pos };
      results.push(r.value);
      cur = r.pos;
    }
    void hooks;
    return { ok: true, value: results, pos: cur };
  };
}

/**
 * 有序选择：依次尝试 alternatives，返回第一个成功的结果。
 * 回溯：失败的尝试不改变位置。
 */
export function choice<T>(alternatives: Parser<T>[], hooks?: CombinatorHooks): Parser<T> {
  return (input, pos) => {
    for (const alt of alternatives) {
      void hooks;
      const r = alt(input, pos);
      if (r.ok) return r;
    }
    return { ok: false, error: '所有分支均失败', pos };
  };
}

/** 可选：zero or one。成功值为 T | null。 */
export function optional<T>(p: Parser<T>): Parser<T | null> {
  return (input, pos) => {
    const r = p(input, pos);
    if (r.ok) return { ok: true, value: r.value, pos: r.pos };
    return { ok: true, value: null, pos };
  };
}

/** 零或多次重复。 */
export function many<T>(p: Parser<T>): Parser<T[]> {
  return (input, pos) => {
    const results: T[] = [];
    let cur = pos;
    // 防御：若某次匹配不消费输入则停止（避免死循环）
    while (true) {
      const r = p(input, cur);
      if (!r.ok) break;
      if (r.pos === cur) break;
      results.push(r.value);
      cur = r.pos;
    }
    return { ok: true, value: results, pos: cur };
  };
}

/** 一或多次重复。 */
export function many1<T>(p: Parser<T>): Parser<T[]> {
  return (input, pos) => {
    const first = p(input, pos);
    if (!first.ok) return { ok: false, error: first.error, pos };
    const rest = many(p)(input, first.pos);
    if (!rest.ok) return { ok: false, error: rest.error, pos };
    return { ok: true, value: [first.value, ...rest.value], pos: rest.pos };
  };
}

/** 分隔列表：item (sep item)*。 */
export function sepBy<T, S>(item: Parser<T>, sep: Parser<S>): Parser<T[]> {
  return (input, pos) => {
    const first = item(input, pos);
    if (!first.ok) return { ok: true, value: [], pos }; // 空列表也成功
    const results: T[] = [first.value];
    let cur = first.pos;
    while (true) {
      const sepR = sep(input, cur);
      if (!sepR.ok) break;
      const itemR = item(input, sepR.pos);
      if (!itemR.ok) break;
      results.push(itemR.value);
      cur = itemR.pos;
    }
    return { ok: true, value: results, pos: cur };
  };
}

/** 至少一个元素的分隔列表。 */
export function sepBy1<T, S>(item: Parser<T>, sep: Parser<S>): Parser<T[]> {
  return (input, pos) => {
    const r = sepBy(item, sep)(input, pos);
    if (r.ok && r.value.length === 0) {
      return { ok: false, error: '至少需要一个元素', pos };
    }
    return r;
  };
}

/** 结果变换。 */
export function map<A, B>(p: Parser<A>, fn: (a: A) => B): Parser<B> {
  return (input, pos) => {
    const r = p(input, pos);
    if (!r.ok) return r;
    return { ok: true, value: fn(r.value), pos: r.pos };
  };
}

/** 跳过空白后运行 p（空白不计入结果）。 */
export function token<T>(p: Parser<T>): Parser<T> {
  return (input, pos) => {
    // 跳过前导空白
    let s = pos;
    while (s < input.length && / s/.test(input[s]!)) s++;
    const r = p(input, s);
    if (!r.ok) return r;
    // 跳过尾随空白
    let e = r.pos;
    while (e < input.length && / s/.test(input[e]!)) e++;
    return { ok: true, value: r.value, pos: e };
  };
}

/** 穿过：匹配 left、middle、right，只保留 middle。 */
export function between<L, M, R>(left: Parser<L>, middle: Parser<M>, right: Parser<R>): Parser<M> {
  const seqParser = seq([left, middle, right]) as Parser<[L, M, R]>;
  return map(seqParser, (parts) => parts[1]!);
}

// ---------------------------------------------------------------------------
// 顶层运行
// ---------------------------------------------------------------------------

export interface RunResult<T> {
  ok: boolean;
  value: T | null;
  pos: number;
  error: string;
}

/** 运行解析器到末尾（要求全部消费）。 */
export function run<T>(p: Parser<T>, input: string, hooks?: CombinatorHooks): RunResult<T> {
  const r = p(input, 0);
  void hooks;
  if (r.ok && r.pos === input.length) {
    return { ok: true, value: r.value, pos: r.pos, error: '' };
  }
  if (r.ok) {
    return { ok: false, value: null, pos: r.pos, error: `未消费全部输入（停在 ${r.pos}）` };
  }
  return { ok: false, value: null, pos: r.pos, error: r.error };
}

// ---------------------------------------------------------------------------
// 演示文法：key = value; 列表
//   pairs → pair (';' pair)*
//   pair  → key '=' value
//   key   → [a-zA-Z_]\w*
//   value → [0-9]+ | [a-zA-Z]+
// ---------------------------------------------------------------------------

export interface Pair {
  key: string;
  value: string;
}

export function buildPairParser(hooks?: CombinatorHooks): Parser<Pair[]> {
  const key = named('key', regex('[a-zA-Z_]\\w*', 'key'), hooks);
  const value = choice<string>([
    named('num', regex('[0-9]+', 'num'), hooks),
    named('word', regex('[a-zA-Z]+', 'word'), hooks),
  ]);
  const seqParser = seq([key, token(string('=')), value]) as Parser<[string, string, string]>;
  const pair = map(seqParser, (parts) => ({
    key: parts[0]!,
    value: parts[2]!,
  }));
  const pairs = sepBy(pair, token(string(';')));
  return pairs;
}

export const DEMO_INPUT = 'x = 1; name = hello; count = 42';

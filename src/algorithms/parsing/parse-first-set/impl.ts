// =============================================================================
// FIRST 集计算 · 纯算法实现
// 自包含；展示不动点迭代过程。
// =============================================================================

export interface Production {
  lhs: string;
  rhs: string[]; // [] = ε
}
export interface CFG {
  start: string;
  productions: Production[];
  nonTerminals: Set<string>;
}

export interface FirstResult {
  first: Record<string, Set<string>>;
  /** 每个非终结符的快照历史（每轮一份），用于可视化。 */
  history: Array<Record<string, string[]>>;
  iterations: number;
}

export interface FirstHooks {
  /** 每轮扫描后调用（轮号、当前 FIRST 快照）。 */
  onPass?: (iter: number, snapshot: Record<string, string[]>) => void;
  /** 单个非终结符的集合变化。 */
  onAdd?: (nt: string, added: string[]) => void;
  onResult?: (r: FirstResult) => void;
}

/** 是否非终结符。 */
function isNT(sym: string, nt: Set<string>): boolean {
  return nt.has(sym);
}

/** 把当前 first 集快照为可序列化形式。 */
function snapshot(first: Record<string, Set<string>>): Record<string, string[]> {
  const out: Record<string, string[]> = {};
  for (const [k, v] of Object.entries(first)) out[k] = [...v].sort();
  return out;
}

/**
 * 计算 FIRST 集（不动点迭代）。
 *
 * @param cfg CFG
 * @param hooks 可选钩子
 */
export function computeFirst(cfg: CFG, hooks: FirstHooks = {}): FirstResult {
  const first: Record<string, Set<string>> = {};
  for (const nt of cfg.nonTerminals) first[nt] = new Set<string>();

  const history: Array<Record<string, string[]>> = [];
  let iter = 0;
  history.push(snapshot(first));
  hooks.onPass?.(iter, snapshot(first));

  let changed = true;
  while (changed) {
    changed = false;
    iter++;
    for (const prod of cfg.productions) {
      const A = prod.lhs;
      if (prod.rhs.length === 0) {
        if (!first[A]!.has('ε')) {
          first[A]!.add('ε');
          hooks.onAdd?.(A, ['ε']);
          changed = true;
        }
        continue;
      }
      let allNullable = true;
      for (const sym of prod.rhs) {
        if (!isNT(sym, cfg.nonTerminals)) {
          if (!first[A]!.has(sym)) {
            first[A]!.add(sym);
            hooks.onAdd?.(A, [sym]);
            changed = true;
          }
          allNullable = false;
          break;
        }
        const before = first[A]!.size;
        for (const t of first[sym] ?? []) {
          if (t !== 'ε') first[A]!.add(t);
        }
        if (first[A]!.size > before) {
          hooks.onAdd?.(
            A,
            [...first[A]!].filter((t) => t !== 'ε'),
          );
          changed = true;
        }
        if (!first[sym]!.has('ε')) {
          allNullable = false;
          break;
        }
      }
      if (allNullable && !first[A]!.has('ε')) {
        first[A]!.add('ε');
        hooks.onAdd?.(A, ['ε']);
        changed = true;
      }
    }
    history.push(snapshot(first));
    hooks.onPass?.(iter, snapshot(first));
  }

  const result: FirstResult = { first, history, iterations: iter };
  hooks.onResult?.(result);
  return result;
}

/** FIRST of a string X1..Xn（基于已算出的 FIRST 集）。 */
export function firstOfString(
  cfg: CFG,
  first: Record<string, Set<string>>,
  rhs: string[],
): Set<string> {
  const result = new Set<string>();
  if (rhs.length === 0) {
    result.add('ε');
    return result;
  }
  let allNullable = true;
  for (const sym of rhs) {
    if (!isNT(sym, cfg.nonTerminals)) {
      result.add(sym);
      allNullable = false;
      break;
    }
    for (const t of first[sym] ?? []) {
      if (t !== 'ε') result.add(t);
    }
    if (!first[sym]!.has('ε')) {
      allNullable = false;
      break;
    }
  }
  if (allNullable) result.add('ε');
  return result;
}

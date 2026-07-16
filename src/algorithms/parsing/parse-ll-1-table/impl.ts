// =============================================================================
// LL(1) 分析表构建 · 纯算法实现
// 自包含的 CFG + FIRST/FOLLOW/分析表 计算。零 DOM 依赖。
// =============================================================================

/** 文法符号；非终结符按约定首字母大写或用 <...>？这里统一用 lhs 名直接判断（isNonTerminal）。 */
export interface Production {
  lhs: string;
  /** 右部符号序列；空数组表示 ε。 */
  rhs: string[];
}

export interface CFG {
  start: string;
  productions: Production[];
  /** 非终结符集合（其余符号为终结符）。 */
  nonTerminals: Set<string>;
}

export interface LL1Table {
  /** M[非终结符][终结符] = 产生式在该格的列表（>1 表示冲突）。 */
  cells: Record<string, Record<string, Production[]>>;
  /** 所有终结符（含 $）。 */
  terminals: string[];
  /** 非终结符列表。 */
  nonTerminals: string[];
  /** 冲突报告。 */
  conflicts: Array<{ nonTerminal: string; terminal: string; productions: Production[] }>;
  /** 是否为 LL(1) 文法（无冲突）。 */
  isLL1: boolean;
  /** 各 FIRST 集（终结符 + 可能的 'ε'）。 */
  first: Record<string, Set<string>>;
  /** 各 FOLLOW 集（终结符 + '$'）。 */
  follow: Record<string, Set<string>>;
}

export interface TableHooks {
  onFirst?: (nt: string, set: Set<string>) => void;
  onFollow?: (nt: string, set: Set<string>) => void;
  onCell?: (nt: string, terminal: string, prod: Production) => void;
  onConflict?: (nt: string, terminal: string, prods: Production[]) => void;
  onResult?: (t: LL1Table) => void;
}

/** 是否非终结符。 */
function isNT(sym: string, nonTerminals: Set<string>): boolean {
  return nonTerminals.has(sym);
}

/**
 * 计算 FIRST 集。
 * FIRST(A) = { a | A ⇒* a... }，若 A ⇒* ε 则含 'ε'。
 * FIRST(符号串 X1..Xn) = (FIRST(X1)\{ε}) ∪ (若 ε∈FIRST(X1) 则 FIRST(X2)\{ε}) ∪ ... ；末位含 ε 当全部可空。
 */
export function computeFirst(cfg: CFG): {
  first: Record<string, Set<string>>;
  firstOfString: (rhs: string[]) => Set<string>;
} {
  const first: Record<string, Set<string>> = {};
  for (const nt of cfg.nonTerminals) first[nt] = new Set<string>();
  const nullable = new Set<string>(); // 可空的非终结符

  let changed = true;
  while (changed) {
    changed = false;
    for (const prod of cfg.productions) {
      const A = prod.lhs;
      if (prod.rhs.length === 0) {
        // A → ε
        if (!first[A]!.has('ε')) {
          first[A]!.add('ε');
          nullable.add(A);
          changed = true;
        }
        continue;
      }
      let allNullable = true;
      for (const sym of prod.rhs) {
        if (!isNT(sym, cfg.nonTerminals)) {
          // 终结符
          if (!first[A]!.has(sym)) {
            first[A]!.add(sym);
            changed = true;
          }
          allNullable = false;
          break;
        }
        // 非终结符：合并 FIRST(sym) \ {ε}
        for (const t of first[sym] ?? []) {
          if (t !== 'ε' && !first[A]!.has(t)) {
            first[A]!.add(t);
            changed = true;
          }
        }
        if (!first[sym]!.has('ε')) {
          allNullable = false;
          break;
        }
      }
      if (allNullable && !first[A]!.has('ε')) {
        first[A]!.add('ε');
        nullable.add(A);
        changed = true;
      }
    }
  }

  const firstOfString = (rhs: string[]): Set<string> => {
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
  };

  return { first, firstOfString };
}

/**
 * 计算 FOLLOW 集。
 * FOLLOW(start) 含 '$'；
 * 对 A → α B β：FOLLOW(B) ⊇ FIRST(β)\{ε}；若 β ⇒* ε（含 β 为空）则 FOLLOW(B) ⊇ FOLLOW(A)。
 */
export function computeFollow(
  cfg: CFG,
  first: Record<string, Set<string>>,
): Record<string, Set<string>> {
  const follow: Record<string, Set<string>> = {};
  for (const nt of cfg.nonTerminals) follow[nt] = new Set<string>();
  follow[cfg.start]!.add('$');

  const firstOfString = (rhs: string[]): { set: Set<string>; nullable: boolean } => {
    const set = new Set<string>();
    if (rhs.length === 0) return { set, nullable: true };
    let nullable = true;
    for (const sym of rhs) {
      if (!isNT(sym, cfg.nonTerminals)) {
        set.add(sym);
        nullable = false;
        break;
      }
      for (const t of first[sym] ?? []) {
        if (t !== 'ε') set.add(t);
      }
      if (!first[sym]!.has('ε')) {
        nullable = false;
        break;
      }
    }
    return { set, nullable };
  };

  let changed = true;
  while (changed) {
    changed = false;
    for (const prod of cfg.productions) {
      const A = prod.lhs;
      for (let i = 0; i < prod.rhs.length; i++) {
        const B = prod.rhs[i]!;
        if (!isNT(B, cfg.nonTerminals)) continue;
        const beta = prod.rhs.slice(i + 1);
        const { set, nullable } = firstOfString(beta);
        for (const t of set) {
          if (!follow[B]!.has(t)) {
            follow[B]!.add(t);
            changed = true;
          }
        }
        if (nullable || beta.length === 0) {
          for (const t of follow[A]!) {
            if (!follow[B]!.has(t)) {
              follow[B]!.add(t);
              changed = true;
            }
          }
        }
      }
    }
  }
  return follow;
}

/**
 * 构建 LL(1) 分析表。
 *
 * @param cfg CFG
 * @param hooks 可选钩子
 */
export function buildLL1Table(cfg: CFG, hooks: TableHooks = {}): LL1Table {
  const { first, firstOfString } = computeFirst(cfg);
  for (const nt of cfg.nonTerminals) hooks.onFirst?.(nt, first[nt]!);
  const follow = computeFollow(cfg, first);
  for (const nt of cfg.nonTerminals) hooks.onFollow?.(nt, follow[nt]!);

  // 收集所有终结符（出现在 rhs 中且不是非终结符的符号）+ '$'
  const terminals = new Set<string>(['$']);
  for (const prod of cfg.productions) {
    for (const sym of prod.rhs) {
      if (!isNT(sym, cfg.nonTerminals)) terminals.add(sym);
    }
  }

  const cells: Record<string, Record<string, Production[]>> = {};
  const nonTerminalsList = [...cfg.nonTerminals];
  for (const nt of nonTerminalsList) {
    cells[nt] = {};
    for (const t of terminals) cells[nt]![t] = [];
  }

  const conflicts: Array<{ nonTerminal: string; terminal: string; productions: Production[] }> = [];

  for (const prod of cfg.productions) {
    const A = prod.lhs;
    const firstAlpha = firstOfString(prod.rhs);
    // (1) FIRST(α) 中的终结符
    for (const a of firstAlpha) {
      if (a === 'ε') continue;
      const cell = cells[A]![a];
      if (!cell) continue;
      if (
        !cell.some(
          (p) => p.rhs.length === prod.rhs.length && p.rhs.every((s, i) => s === prod.rhs[i]),
        )
      ) {
        cell.push(prod);
        hooks.onCell?.(A, a, prod);
      }
    }
    // (2) 若 ε ∈ FIRST(α)，对 FOLLOW(A) 中每个终结符
    if (firstAlpha.has('ε')) {
      for (const b of follow[A]!) {
        const cell = cells[A]![b];
        if (!cell) continue;
        if (
          !cell.some(
            (p) => p.rhs.length === prod.rhs.length && p.rhs.every((s, i) => s === prod.rhs[i]),
          )
        ) {
          cell.push(prod);
          hooks.onCell?.(A, b, prod);
        }
      }
    }
  }

  // 收集冲突
  for (const nt of nonTerminalsList) {
    for (const t of terminals) {
      const cell = cells[nt]![t]!;
      if (cell.length > 1) {
        conflicts.push({ nonTerminal: nt, terminal: t, productions: cell });
        hooks.onConflict?.(nt, t, cell);
      }
    }
  }

  const result: LL1Table = {
    cells,
    terminals: [...terminals],
    nonTerminals: nonTerminalsList,
    conflicts,
    isLL1: conflicts.length === 0,
    first,
    follow,
  };
  hooks.onResult?.(result);
  return result;
}

/** 格式化产生式为字符串（如 "E → T E'"）。 */
export function prodStr(p: Production): string {
  return `${p.lhs} → ${p.rhs.length === 0 ? 'ε' : p.rhs.join(' ')}`;
}

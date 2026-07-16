// =============================================================================
// PREDICT 预测集 · 纯算法实现
// 依赖 FIRST、FOLLOW；判定 LL(1) 的相交道。
// =============================================================================

export interface Production {
  lhs: string;
  rhs: string[];
}
export interface CFG {
  start: string;
  productions: Production[];
  nonTerminals: Set<string>;
}

export interface PredictEntry {
  production: Production;
  predict: Set<string>;
}

export interface PredictResult {
  entries: PredictEntry[];
  first: Record<string, Set<string>>;
  follow: Record<string, Set<string>>;
  /** 同一非终结符下相交的 PREDICT 集对（冲突）。 */
  conflicts: Array<{ nonTerminal: string; prods: [Production, Production]; overlap: string[] }>;
  isLL1: boolean;
}

export interface PredictHooks {
  onProduction?: (p: Production, predict: Set<string>) => void;
  onConflict?: (nt: string, p1: Production, p2: Production, overlap: string[]) => void;
  onResult?: (r: PredictResult) => void;
}

function isNT(sym: string, nt: Set<string>): boolean {
  return nt.has(sym);
}

/** FIRST 集。 */
function computeFirst(cfg: CFG): Record<string, Set<string>> {
  const first: Record<string, Set<string>> = {};
  for (const nt of cfg.nonTerminals) first[nt] = new Set<string>();
  let changed = true;
  while (changed) {
    changed = false;
    for (const prod of cfg.productions) {
      const A = prod.lhs;
      if (prod.rhs.length === 0) {
        if (!first[A]!.has('ε')) {
          first[A]!.add('ε');
          changed = true;
        }
        continue;
      }
      let allNullable = true;
      for (const sym of prod.rhs) {
        if (!isNT(sym, cfg.nonTerminals)) {
          if (!first[A]!.has(sym)) {
            first[A]!.add(sym);
            changed = true;
          }
          allNullable = false;
          break;
        }
        const before = first[A]!.size;
        for (const t of first[sym] ?? []) {
          if (t !== 'ε') first[A]!.add(t);
        }
        if (first[A]!.size > before) changed = true;
        if (!first[sym]!.has('ε')) {
          allNullable = false;
          break;
        }
      }
      if (allNullable && !first[A]!.has('ε')) {
        first[A]!.add('ε');
        changed = true;
      }
    }
  }
  return first;
}

/** FIRST of a string。 */
function firstOfString(
  cfg: CFG,
  first: Record<string, Set<string>>,
  rhs: string[],
): { set: Set<string>; nullable: boolean } {
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
}

/** FOLLOW 集。 */
function computeFollow(cfg: CFG, first: Record<string, Set<string>>): Record<string, Set<string>> {
  const follow: Record<string, Set<string>> = {};
  for (const nt of cfg.nonTerminals) follow[nt] = new Set<string>();
  follow[cfg.start]!.add('$');
  let changed = true;
  while (changed) {
    changed = false;
    for (const prod of cfg.productions) {
      const A = prod.lhs;
      for (let i = 0; i < prod.rhs.length; i++) {
        const B = prod.rhs[i]!;
        if (!isNT(B, cfg.nonTerminals)) continue;
        const beta = prod.rhs.slice(i + 1);
        const { set, nullable } = firstOfString(cfg, first, beta);
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
 * 计算每条产生式的 PREDICT 集，并检测 LL(1) 相交冲突。
 *
 * @param cfg CFG
 * @param hooks 可选钩子
 */
export function computePredict(cfg: CFG, hooks: PredictHooks = {}): PredictResult {
  const first = computeFirst(cfg);
  const follow = computeFollow(cfg, first);

  const entries: PredictEntry[] = [];
  for (const prod of cfg.productions) {
    const { set, nullable } = firstOfString(cfg, first, prod.rhs);
    const predict = new Set<string>(set);
    if (nullable) {
      for (const t of follow[prod.lhs]!) predict.add(t);
    }
    entries.push({ production: prod, predict });
    hooks.onProduction?.(prod, predict);
  }

  // 检测冲突：同一 lhs 的两条产生式 PREDICT 相交
  const conflicts: PredictResult['conflicts'] = [];
  const byLhs = new Map<string, PredictEntry[]>();
  for (const e of entries) {
    const arr = byLhs.get(e.production.lhs) ?? [];
    arr.push(e);
    byLhs.set(e.production.lhs, arr);
  }
  for (const [nt, arr] of byLhs) {
    for (let i = 0; i < arr.length; i++) {
      for (let j = i + 1; j < arr.length; j++) {
        const overlap = [...arr[i]!.predict].filter((t) => arr[j]!.predict.has(t));
        if (overlap.length > 0) {
          conflicts.push({
            nonTerminal: nt,
            prods: [arr[i]!.production, arr[j]!.production],
            overlap,
          });
          hooks.onConflict?.(nt, arr[i]!.production, arr[j]!.production, overlap);
        }
      }
    }
  }

  const result: PredictResult = {
    entries,
    first,
    follow,
    conflicts,
    isLL1: conflicts.length === 0,
  };
  hooks.onResult?.(result);
  return result;
}

/** 产生式格式化。 */
export function prodStr(p: Production): string {
  return `${p.lhs} → ${p.rhs.length === 0 ? 'ε' : p.rhs.join(' ')}`;
}

// =============================================================================
// FOLLOW 集计算 · 纯算法实现
// 依赖 FIRST 集（自包含计算）。
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

export interface FollowResult {
  follow: Record<string, Set<string>>;
  first: Record<string, Set<string>>;
  iterations: number;
  history: Array<Record<string, string[]>>;
}

export interface FollowHooks {
  onPass?: (iter: number, snapshot: Record<string, string[]>) => void;
  onAdd?: (nt: string, added: string[]) => void;
  onResult?: (r: FollowResult) => void;
}

function isNT(sym: string, nt: Set<string>): boolean {
  return nt.has(sym);
}

function snapshot(m: Record<string, Set<string>>): Record<string, string[]> {
  const out: Record<string, string[]> = {};
  for (const [k, v] of Object.entries(m)) out[k] = [...v].sort();
  return out;
}

/** 计算 FIRST 集（内部辅助）。 */
export function computeFirst(cfg: CFG): Record<string, Set<string>> {
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

/** FIRST of a string（基于已算出的 FIRST）。 */
export function firstOfString(
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

/**
 * 计算 FOLLOW 集。
 *
 * @param cfg CFG
 * @param hooks 可选钩子
 */
export function computeFollow(cfg: CFG, hooks: FollowHooks = {}): FollowResult {
  const first = computeFirst(cfg);
  const follow: Record<string, Set<string>> = {};
  for (const nt of cfg.nonTerminals) follow[nt] = new Set<string>();
  follow[cfg.start]!.add('$');

  const history: Array<Record<string, string[]>> = [];
  let iter = 0;
  history.push(snapshot(follow));
  hooks.onPass?.(iter, snapshot(follow));

  let changed = true;
  while (changed) {
    changed = false;
    iter++;
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
            hooks.onAdd?.(B, [t]);
            changed = true;
          }
        }
        if (nullable || beta.length === 0) {
          for (const t of follow[A]!) {
            if (!follow[B]!.has(t)) {
              follow[B]!.add(t);
              hooks.onAdd?.(B, [t]);
              changed = true;
            }
          }
        }
      }
    }
    history.push(snapshot(follow));
    hooks.onPass?.(iter, snapshot(follow));
  }

  const result: FollowResult = { follow, first, iterations: iter, history };
  hooks.onResult?.(result);
  return result;
}

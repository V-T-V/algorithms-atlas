// =============================================================================
// SLR(1) 冲突检测 · 纯算法实现
// 构造 LR(0) 项目集规范族 + FOLLOW，扫描冲突。
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

/** LR(0) 项目：产生式 + 点位置。 */
export interface Item {
  prodIndex: number;
  dot: number;
}

export interface LR0State {
  id: number;
  items: Item[];
  /** goto[symbol] = 目标状态 id。 */
  goto: Record<string, number>;
}

export interface Conflict {
  state: number;
  kind: 'shift-reduce' | 'reduce-reduce';
  terminal: string;
  detail: string;
}

export interface SLRResult {
  states: LR0State[];
  follow: Record<string, Set<string>>;
  conflicts: Conflict[];
  isSLR1: boolean;
}

export interface SLRHooks {
  onState?: (s: LR0State) => void;
  onGoto?: (from: number, sym: string, to: number) => void;
  onConflict?: (c: Conflict) => void;
  onResult?: (r: SLRResult) => void;
}

function isNT(sym: string, nt: Set<string>): boolean {
  return nt.has(sym);
}

/** 项目字符串键。 */
function itemKey(it: Item): string {
  return `${it.prodIndex}.${it.dot}`;
}

/** 项目点后的符号（无则 undefined）。 */
function symbolAfterDot(it: Item, prods: Production[]): string | undefined {
  const p = prods[it.prodIndex]!;
  return it.dot < p.rhs.length ? p.rhs[it.dot]! : undefined;
}

/** 是否完成项目（点在末尾）。 */
function isComplete(it: Item, prods: Production[]): boolean {
  const p = prods[it.prodIndex]!;
  return it.dot >= p.rhs.length;
}

/** 闭包。 */
function closure(items: Item[], prods: Production[], nonTerminals: Set<string>): Item[] {
  const set = new Map<string, Item>();
  for (const it of items) set.set(itemKey(it), it);
  let changed = true;
  while (changed) {
    changed = false;
    for (const it of [...set.values()]) {
      const sym = symbolAfterDot(it, prods);
      if (sym !== undefined && isNT(sym, nonTerminals)) {
        for (let i = 0; i < prods.length; i++) {
          if (prods[i]!.lhs === sym) {
            const newItem: Item = { prodIndex: i, dot: 0 };
            const k = itemKey(newItem);
            if (!set.has(k)) {
              set.set(k, newItem);
              changed = true;
            }
          }
        }
      }
    }
  }
  return [...set.values()];
}

/** goto(I, X)。 */
function gotoSet(items: Item[], X: string, prods: Production[]): Item[] {
  const moved: Item[] = [];
  for (const it of items) {
    const sym = symbolAfterDot(it, prods);
    if (sym === X) moved.push({ prodIndex: it.prodIndex, dot: it.dot + 1 });
  }
  return moved;
}

/** 项集规范字符串键（用闭包后的项目排序）。 */
function stateKey(items: Item[]): string {
  return items.map(itemKey).sort().join('|');
}

/** FIRST 集（用于 FOLLOW）。 */
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

/** FOLLOW 集。 */
function computeFollow(cfg: CFG, first: Record<string, Set<string>>): Record<string, Set<string>> {
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
 * 构造 LR(0) 自动机 + 检测 SLR(1) 冲突。
 *
 * @param cfg CFG
 * @param hooks 可选钩子
 */
export function detectSLRConflicts(cfg: CFG, hooks: SLRHooks = {}): SLRResult {
  const first = computeFirst(cfg);
  const follow = computeFollow(cfg, first);

  // 起始项目集：S' → · S  —— 这里用起始符的第一条产生式 dot=0
  const startProdIndex = cfg.productions.findIndex((p) => p.lhs === cfg.start);
  const initialItems = closure(
    [{ prodIndex: startProdIndex >= 0 ? startProdIndex : 0, dot: 0 }],
    cfg.productions,
    cfg.nonTerminals,
  );

  const states: LR0State[] = [];
  const keyToId = new Map<string, number>();
  const queue: Item[][] = [initialItems];
  keyToId.set(stateKey(initialItems), 0);
  states.push({ id: 0, items: initialItems, goto: {} });

  while (queue.length > 0) {
    const items = queue.shift()!;
    const sid = keyToId.get(stateKey(items))!;
    hooks.onState?.(states[sid]!);
    // 收集所有点后符号
    const symbols = new Set<string>();
    for (const it of items) {
      const s = symbolAfterDot(it, cfg.productions);
      if (s !== undefined) symbols.add(s);
    }
    for (const sym of symbols) {
      const moved = gotoSet(items, sym, cfg.productions);
      if (moved.length === 0) continue;
      const closed = closure(moved, cfg.productions, cfg.nonTerminals);
      const k = stateKey(closed);
      let targetId = keyToId.get(k);
      if (targetId === undefined) {
        targetId = states.length;
        keyToId.set(k, targetId);
        states.push({ id: targetId, items: closed, goto: {} });
        queue.push(closed);
      }
      states[sid]!.goto[sym] = targetId;
      hooks.onGoto?.(sid, sym, targetId);
    }
  }

  // 扫描冲突
  const conflicts: Conflict[] = [];
  for (const st of states) {
    const complete: Item[] = st.items.filter((it) => isComplete(it, cfg.productions));
    const shiftable = new Set<string>();
    for (const it of st.items) {
      const s = symbolAfterDot(it, cfg.productions);
      if (s !== undefined) shiftable.add(s);
    }
    // shift-reduce：完成项目 B→γ· ，且某 a ∈ FOLLOW(B) 是可移进终结符
    for (const it of complete) {
      const lhs = cfg.productions[it.prodIndex]!.lhs;
      for (const a of follow[lhs]!) {
        if (shiftable.has(a) && !isNT(a, cfg.nonTerminals)) {
          const c: Conflict = {
            state: st.id,
            kind: 'shift-reduce',
            terminal: a,
            detail: `state ${st.id}: 可移进 ${a} 又可规约 ${cfg.productions[it.prodIndex]!.lhs} → ${cfg.productions[it.prodIndex]!.rhs.length === 0 ? 'ε' : cfg.productions[it.prodIndex]!.rhs.join(' ')}`,
          };
          conflicts.push(c);
          hooks.onConflict?.(c);
        }
      }
    }
    // reduce-reduce：两个完成项目 FOLLOW 相交
    for (let i = 0; i < complete.length; i++) {
      for (let j = i + 1; j < complete.length; j++) {
        const la = cfg.productions[complete[i]!.prodIndex]!.lhs;
        const lb = cfg.productions[complete[j]!.prodIndex]!.lhs;
        const overlap = [...follow[la]!].filter((t) => follow[lb]!.has(t));
        for (const a of overlap) {
          const c: Conflict = {
            state: st.id,
            kind: 'reduce-reduce',
            terminal: a,
            detail: `state ${st.id}: ${la} 与 ${lb} 的 FOLLOW 在 ${a} 相交`,
          };
          conflicts.push(c);
          hooks.onConflict?.(c);
        }
      }
    }
  }

  const result: SLRResult = { states, follow, conflicts, isSLR1: conflicts.length === 0 };
  hooks.onResult?.(result);
  return result;
}

/** 产生式格式化。 */
export function prodStr(p: Production): string {
  return `${p.lhs} → ${p.rhs.length === 0 ? 'ε' : p.rhs.join(' ')}`;
}

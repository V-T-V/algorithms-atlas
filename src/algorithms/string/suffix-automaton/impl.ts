// =============================================================================
// 后缀自动机 Suffix Automaton (SAM) · 纯算法实现
// 在线构建：逐字符增量插入，构建后可在 O(n) 时间内判定子串 / 最长子串等。
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// =============================================================================

/** SAM 的一个状态（DAG 中的一个节点）。 */
export interface SamState {
  id: number;
  /** 后缀链接 link：指向「本状态所代表的最长串的最长真后缀」所在状态。 */
  link: number;
  /** len：本状态所代表的最长子串长度。 */
  len: number;
  /** 转移函数：字符 → 目标状态 id。 */
  next: Map<string, number>;
  /** 是否为接受状态（用于可视化），构造时按需标记。 */
  accept?: boolean;
}

/** 构建好的后缀自动机。 */
export interface SuffixAutomaton {
  /** 状态数组；states[0] 为初始根状态。 */
  states: SamState[];
  /** 源串。 */
  s: string;
}

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface SamHooks {
  /** 插入字符 c 前，创建一个新状态（id, len=len(last)+1）。 */
  onCreate?: (id: number, len: number, ch: string) => void;
  /** 设定 link(v) = q（或 clone）。 */
  onLink?: (v: number, linkTo: number) => void;
  /** 新增/修改转移 trans(p) on ch → q。 */
  onTrans?: (from: number, ch: string, to: number) => void;
  /** 克隆状态 q 得到新状态 clone（id）。 */
  onClone?: (cloneId: number, originId: number) => void;
  /** 匹配阶段：在文本下标 i 处，沿转移从 state 到 nextState（读字符 c）。 */
  onMatchStep?: (i: number, state: number, nextState: number, c: string, advanced: boolean) => void;
  /** 匹配阶段：当前最长匹配长度从 prev 更新为 cur。 */
  onMatchLen?: (matchedLen: number) => void;
}

/**
 * 在线增量构建后缀自动机。
 *
 * 维护 `last`（上一步插入字符后所处的状态）。插入字符 c 时：
 *   1. 创建新状态 `cur`，`len(cur) = len(last) + 1`
 *   2. 从 `last` 沿 link 链回溯，凡 `p` 没有 `c` 转移的都加上 `trans(p,c)=cur`
 *   3. 若回溯到根仍未遇到已有 `c` 转移 → `link(cur) = 0`
 *   4. 否则设第一个遇到 `trans(p,c)=q` 的 p：
 *      - 若 `len(q) == len(p) + 1`：`link(cur) = q`
 *      - 否则需**克隆** q：复制 q 的转移得到 `clone`，`len(clone)=len(p)+1`，
 *        把 q 与 cur 的 link 都指向 clone；再从 p 沿 link 链把所有指向 q 的转移改为 clone。
 *   5. `last = cur`
 *
 * 时间 `O(|s|)`（总转移数与状态数都是线性级），空间 `O(|s|)`。
 *
 * @param s 待建自动机的字符串
 * @param hooks 可选事件钩子
 */
export function buildSuffixAutomaton(s: string, hooks: SamHooks = {}): SuffixAutomaton {
  const states: SamState[] = [];
  const make = (len: number, link: number): number => {
    const id = states.length;
    states.push({ id, len, link, next: new Map() });
    return id;
  };
  // 根状态：len=0, link=-1
  make(0, -1);
  let last = 0;

  for (let i = 0; i < s.length; i++) {
    const c = s[i]!;
    const cur = make(states[last]!.len + 1, 0);
    hooks.onCreate?.(cur, states[cur]!.len, c);

    let p = last;
    while (p !== -1 && !states[p]!.next.has(c)) {
      states[p]!.next.set(c, cur);
      hooks.onTrans?.(p, c, cur);
      p = states[p]!.link;
    }
    if (p === -1) {
      states[cur]!.link = 0;
      hooks.onLink?.(cur, 0);
    } else {
      const q = states[p]!.next.get(c)!;
      if (states[p]!.len + 1 === states[q]!.len) {
        states[cur]!.link = q;
        hooks.onLink?.(cur, q);
      } else {
        // 克隆 q
        const clone = make(states[p]!.len + 1, states[q]!.link);
        states[clone]!.next = new Map(states[q]!.next);
        hooks.onClone?.(clone, q);
        // 复制出的转移逐一报告
        for (const [ch, to] of states[clone]!.next) {
          hooks.onTrans?.(clone, ch, to);
        }
        states[q]!.link = clone;
        hooks.onLink?.(q, clone);
        states[cur]!.link = clone;
        hooks.onLink?.(cur, clone);
        // 从 p 沿 link 链：所有指向 q 的 c 转移改为 clone
        let pp = p;
        while (pp !== -1 && states[pp]!.next.get(c) === q) {
          states[pp]!.next.set(c, clone);
          hooks.onTrans?.(pp, c, clone);
          pp = states[pp]!.link;
        }
      }
    }
    last = cur;
  }

  // 标记接受状态：从 last 沿 link 链回溯
  let acc = last;
  while (acc > 0) {
    states[acc]!.accept = true;
    acc = states[acc]!.link;
  }

  return { states, s };
}

/**
 * 在 SAM 上匹配模式串 `pat`：返回 `pat` 在自动机字符串中的最长可匹配前缀长度。
 * 若 `pat` 整串是 `s` 的子串，则返回 `pat.length`；否则返回能匹配的最长前缀长度。
 *
 * 时间 `O(|pat|)`。
 */
export function samMatch(sam: SuffixAutomaton, pat: string, hooks: SamHooks = {}): number {
  let state = 0;
  let matched = 0;
  for (let i = 0; i < pat.length; i++) {
    const c = pat[i]!;
    const nx = sam.states[state]!.next.get(c);
    const advanced = nx !== undefined;
    const next = nx ?? 0;
    hooks.onMatchStep?.(i, state, next, c, advanced);
    if (nx === undefined) {
      // pat 不是 s 的子串（在 i 处断链）
      hooks.onMatchLen?.(matched);
      return matched;
    }
    state = nx;
    matched++;
    hooks.onMatchLen?.(matched);
  }
  return matched;
}

/**
 * 统计字符串 `s` 中**本质不同**的子串个数。
 * 公式：`∑ (states[i].len − states[link(i)].len)`（每个状态贡献它「独有」的子串数）。
 */
export function countDistinctSubstrings(s: string): number {
  const sam = buildSuffixAutomaton(s);
  let total = 0;
  for (let i = 1; i < sam.states.length; i++) {
    const st = sam.states[i]!;
    const linkLen = st.link >= 0 ? sam.states[st.link]!.len : 0;
    total += st.len - linkLen;
  }
  return total;
}

/**
 * 判断 `pat` 是否为 `s` 的子串。
 */
export function isSubstring(s: string, pat: string): boolean {
  if (pat.length === 0) return true;
  const sam = buildSuffixAutomaton(s);
  return samMatch(sam, pat) === pat.length;
}

// =============================================================================
// AC 自动机 v2（Aho-Corasick 转移表 DFA 形式）· 纯算法实现
// 与 ac-automaton（trie+fail 链）不同：v2 在构造 fail 后，把「fail 链回退」预计算成
// 完整的 goto 转移表 trans[state][ch]，匹配阶段每个字符 O(1) 转移、零回溯。
// 适合字母表较小、需多次扫描不同文本的场景。
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步，供录制器使用。
// =============================================================================

/** Trie 节点。 */
export interface AcNode2 {
  id: number;
  children: Map<string, number>;
  /** fail 指针。 */
  fail: number;
  /** 字典后缀链接压缩后的输出（模式下标集合）。 */
  output: number[];
}

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface AhoCorasick2Hooks {
  /** 插入边 parent→child（字符 ch）。 */
  onInsertEdge?: (parent: number, child: number, ch: string) => void;
  /** BFS 确定 node.fail = failTo。 */
  onFail?: (node: number, failTo: number) => void;
  /** 匹配阶段：状态从 state 读 ch 转到 nextState。 */
  onTransfer?: (t: number, state: number, nextState: number, ch: string) => void;
  /** 在文本下标 t 处匹配到模式 patterns[i]。 */
  onFound?: (t: number, patternIdx: number) => void;
}

/**
 * 构造 AC 自动机 + 完整 goto 转移表。
 *
 * @param patterns 模式串数组
 * @param alphabet 字母表（决定转移表宽度）
 * @returns { nodes, trans, patterns } —— trans[state][ch] = 下一状态
 */
export function buildAcDfa(
  patterns: string[],
  alphabet: string,
  hooks: AhoCorasick2Hooks = {},
): { nodes: AcNode2[]; trans: Record<string, number>[]; patterns: string[] } {
  const nodes: AcNode2[] = [];
  const make = (): number => {
    const id = nodes.length;
    nodes.push({ id, children: new Map(), fail: 0, output: [] });
    return id;
  };
  make(); // 根 id=0

  // 1) 插入
  for (let pi = 0; pi < patterns.length; pi++) {
    const pat = patterns[pi]!;
    let cur = 0;
    for (let k = 0; k < pat.length; k++) {
      const ch = pat[k]!;
      let nx = nodes[cur]!.children.get(ch);
      if (nx === undefined) {
        nx = make();
        nodes[cur]!.children.set(ch, nx);
        hooks.onInsertEdge?.(cur, nx, ch);
      }
      cur = nx;
    }
    nodes[cur]!.output.push(pi);
  }

  // 2) BFS 构建 fail + 合并 output
  const queue: number[] = [];
  for (const childId of nodes[0]!.children.values()) {
    nodes[childId]!.fail = 0;
    queue.push(childId);
  }
  let head = 0;
  while (head < queue.length) {
    const u = queue[head]!;
    head++;
    for (const [ch, v] of nodes[u]!.children) {
      let f = nodes[u]!.fail;
      while (f !== 0 && !nodes[f]!.children.has(ch)) f = nodes[f]!.fail;
      const fc = nodes[f]!.children.get(ch);
      nodes[v]!.fail = fc !== undefined && fc !== v ? fc : 0;
      hooks.onFail?.(v, nodes[v]!.fail);
      nodes[v]!.output.push(...nodes[nodes[v]!.fail]!.output);
      queue.push(v);
    }
  }

  // 3) 构造完整 goto 转移表（把 fail 链回退预计算掉）
  const trans: Record<string, number>[] = nodes.map(() => ({}));
  const go = (state: number, ch: string): number => {
    let s = state;
    while (s !== 0 && !nodes[s]!.children.has(ch)) s = nodes[s]!.fail;
    const nx = nodes[s]!.children.get(ch);
    return nx !== undefined ? nx : 0;
  };
  for (let state = 0; state < nodes.length; state++) {
    for (const ch of alphabet) {
      trans[state]![ch] = go(state, ch);
    }
  }

  return { nodes, trans, patterns };
}

/**
 * Aho-Corasick v2：构造 DFA 并扫描文本，返回所有匹配（起点, 模式串, 模式串下标）。
 *
 * 时间 O(|Σ|·Σ|patterns| + |text| + 命中数)。
 *
 * @returns 按 (文本位置, 模式串下标) 排序的匹配列表
 */
export function ahoCorasick2(
  text: string,
  patterns: string[],
  hooks: AhoCorasick2Hooks = {},
): Array<{ start: number; end: number; pattern: string; patternIdx: number }> {
  if (patterns.length === 0) return [];
  const alphabet = Array.from(new Set([...text, ...patterns.join('')])).join('');
  const { nodes, trans, patterns: pats } = buildAcDfa(patterns, alphabet, hooks);

  const out: Array<{ start: number; end: number; pattern: string; patternIdx: number }> = [];
  let state = 0;
  for (let t = 0; t < text.length; t++) {
    const ch = text[t]!;
    const next = trans[state]![ch] ?? 0;
    hooks.onTransfer?.(t, state, next, ch);
    state = next;
    for (const pi of nodes[state]!.output) {
      const pat = pats[pi]!;
      out.push({ start: t - pat.length + 1, end: t, pattern: pat, patternIdx: pi });
      hooks.onFound?.(t, pi);
    }
  }
  return out;
}
